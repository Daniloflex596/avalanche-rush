# Trend-detection data sources (Italy + global) for an automated short-form video research pipeline (state as of 2026-10-07)

Legend: "[web]" = confirmed in fetched/search results this session; "[memory]" = from model background knowledge, NOT re-verified now (treat as hints, test before relying). Most 2026 pricing comes from vendor/competitor blogs; confirm on official pages before budgeting.

## Google Trends: official API, pytrends, Trending Now RSS, SerpApi/DataForSEO

### Takeaway
There is still no generally available official Google Trends API: the alpha (announced 2025-07-24) is application-gated. The practical routes are the Trending Now RSS feed (free, geo=IT, ~10-min refresh) for "what is hot now" plus SerpApi (trending_now engine) or DataForSEO (cheap per-task) for time series/related queries. pytrends is archived.

### Cited Findings
- Official Google Trends API (alpha) announced 2025-07-24 on Search Central blog: consistently scaled interest data up to 1,800 days back, daily/weekly/monthly/yearly aggregation, region/sub-region filters; application-based, targeting researchers/journalists/developers — [Google blog](https://developers.google.com/search/blog/2025/07/trends-api); [PPC Land](https://ppc.land/google-opens-alpha-testing-for-new-trends-api-targeting-developers-and-journalists/)
- As of 2026 commentary, it remains an application-gated alpha with no public pricing/quotas; no newer official Google update found — [ScrapeBadger](https://scrapebadger.com/blog/does-google-trends-have-an-api-what-to-use-in-2026); [Konabayev](https://konabayev.com/blog/google-trends-api-landscape-2026/) (vendor/SEO sources)
- pytrends reported archived 2025-04-17 / unmaintained (single secondary source; verify on GitHub) — [Scrapfly](https://scrapfly.io/blog/posts/google-trends-api-alternatives)
- Trending Now page covers 100+ countries, refreshed on average every ~10 minutes; export menu offers RSS/CSV — [Google Trends help](https://support.google.com/trends/answer/3076011); IT page: [trends.google.com/trending?geo=IT](https://trends.google.com/trends/trendingsearches/daily?geo=IT)
- RSS URL form: `https://trends.google.com/trending/rss?geo=IT` (search result said to open in a browser/curl; I could not fetch the live feed, so contents/format unverified). Third-party scrapers claim to use the same feed and return approx traffic, publish time and related news items — [Apify dr_ben actor](https://apify.com/dr_ben/google-trending-searches)
- DataForSEO Google Trends API: $0.00225/task standard queue (up to 45 min), $0.009/task live; another page shows $0.0027/$0.011 (conflict) — [DataForSEO pricing](https://dev_wp.dataforseo.com/pricing/keywords-data/google-trends); [socialcrawl comparison](https://www.socialcrawl.dev/blog/best-google-trends-apis-2026)
- SerpApi: `google_trends_trending_now` engine with lookback windows 4/24/48/168 h; plans: Free 100 searches/mo (other sources say 250), $75/mo 5,000, $150 15,000, $275 30,000; only successful searches count — [SerpApi pricing](https://serpapi.com/pricing); [SerpApi blog](https://serpapi.com/blog/how-to-scrape-google-trends/)
- Apify actors scrape Trending Now/timelines (e.g. [memo23](https://apify.com/memo23/google-trends-scraper)); reliability unverified.

### Inferences
- Pipeline: daily poll of RSS geo=IT (free) as primary; if blocked/format changes, fall back to SerpApi trending_now (geo=IT, hours=24/168): ~30 calls/month = within free tier or ~$25/mo Starter. Weekly deeper dive (interest_over_time, related_queries for ~20 topics) via DataForSEO ≈ <$1/month.
- Python hints [memory]: `feedparser.parse(url)` for RSS (items typically include `ht:approx_traffic`, `ht:news_item`); `serpapi` package `GoogleSearch({"engine":"google_trends_trending_now","geo":"IT","hours":24,"api_key":...})`; DataForSEO REST `POST https://api.dataforseo.com/v3/keywords_data/google_trends/explore/live` with `location_code` for Italy and `language_code":"it"`.
- Estimated cost: RSS $0; SerpApi $0–25/mo; DataForSEO <$2/mo.

### Gaps
- Live RSS schema, rate-limit behaviour and any Google ToS stance on RSS use not verified (feed not fetched).
- Whether SerpApi Trending Now calls cost 1 search each: not confirmed.
- Alpha application status/approval odds and quotas unknown.
- pytrends archive date from a single secondary source.

## YouTube Data API v3

### Takeaway
`videos.list?chart=mostPopular&regionCode=IT` costs 1 quota unit and is cheap; the big caveat is `search.list`, where the current official quota page appears to have changed to a separate bucket of 100 calls/day (conflicts with the historical 100 units/call). Outlier detection = views / channel median views, computed from `channels.list` + `playlistItems.list` (1 unit each).

### Cited Findings
- Default 10,000 units/day; `videos.list`, `channels.list`, `playlistItems.list`, `videoCategories.list` cost 1 unit; quotas reset at midnight Pacific — [Quota cost page](https://developers.google.com/youtube/v3/determine_quota_cost)
- Same page (fetched twice, via summarizer) states `search.list` and `videos.insert` "have their own quota buckets... default daily limit of 100 per day... Each call costs 1 quota"; the summarizer noted an internal inconsistency on videos.insert (1600 vs 1) — [Quota cost page](https://developers.google.com/youtube/v3/determine_quota_cost). This differs from my memory of 100 units per search call, so verify in Cloud console Quotas.

### Inferences
- Daily chart pull: `GET https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IT&maxResults=50&videoCategoryId=<id>` [memory for params]: 1 unit per page; ~10 category pages/day = ~10 units. Shorts are not separately flagged; filter by duration <=60 s (contentDetails.duration), note Shorts can be up to 3 min since 2024 [memory].
- Outlier score: for each video get channel's last ~30 uploads (`playlistItems.list` on uploads playlist `UC...`->`UU...`, then `videos.list`), score = views / median(views of channel's recent videos), also views/hour since publish. ~3 units per channel. Trivially within 10k units/day.
- Search (publishedAfter, order=viewCount, regionCode=IT, relevanceLanguage=it) limited to ~100/day; budget it for weekly topic-keyword checks only.
- Cost: $0 (free quota); quota extension needs audit form.

### Gaps
- Exact current search.list quota semantics (100 units vs 100 calls/day) unresolved.
- Whether mostPopular for IT is still populated for all categories (some categories return errors) — not tested.

## Wikipedia / Wikimedia

### Takeaway
Pageviews REST API gives top articles per day for it.wikipedia with no key; a strong, free, reliable Italy-language "public attention" signal (lags ~1 day). Detailed docs pages I fetched did not state limits, so details come from memory.

### Cited Findings
- Analytics API pageviews data served from 2015-07-01; rate limits referred to the Access policy (not stated on page) — [Wikimedia pageviews reference](https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/reference/page-views.html); [Getting started](https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/documentation/getting-started.html)

### Inferences
- [memory, unverified now] Endpoint: `GET https://wikimedia.org/api/rest_v1/metrics/pageviews/top/it.wikipedia/all-access/YYYY/MM/DD` (also `/top-per-country/IT/all-access/YYYY/MM/DD` for Italian traffic across projects); per-article trend: `/per-article/it.wikipedia/all-access/user/<title>/daily/YYYYMMDD/YYYYMMDD`. Requires descriptive User-Agent with contact; documented soft limit ~200 req/s per client [memory]. Filter out "Pagina_principale", "Speciale:Ricerca" and evergreen pages (compare with 30-day baseline for spike ratio). Data for day D normally available on D+1 UTC.
- Also useful: it.wikipedia Portale:Attualità / "Wikipedia:Cronaca recente" pages and Wikimedia EventStreams (recentchange SSE) for edit-surge detection [memory].
- Cost $0.

### Gaps
- Rate limits, UA policy, freshness, and "top-per-country" availability not confirmed in this session.

## Reddit

### Takeaway
New-app access is approval-gated (Responsible Builder Policy; 2-4 weeks; free tier non-commercial only), so for a commercial content pipeline Reddit official API is risky; public RSS (reportedly still works) or paid third parties are fallbacks. Arctic Shift is archival, not a real-time trend source.

### Cited Findings
- Access requires prior approval; free tier 100 QPM with OAuth, 10 without, non-commercial only; commercial needs separate agreement; commonly cited $0.24/1,000 calls, minimum commitments disputed — [Octolens](https://octolens.com/blog/reddit-api-pricing); [Techloy](https://www.techloy.com/reddit-api-pricing-in-2026-complete-guide-for-developers-and-businesses/); [Xpoz](https://www.xpoz.ai/blog/guides/reddit-api-pricing-tiers-and-alternatives/) (all third-party)
- Anonymous `.json` endpoints reportedly return 403 "blocked by network security" while RSS/search RSS still return 200 (single MCP-server README claim); other reports of RSS rate limits — [Glama listing](https://glama.ai/mcp/servers/dljz9z6h8v); [OpenRSS](https://openrss.org/work/161)
- Pushshift lost API access in 2023; Arctic Shift is main successor: keyless API, monthly Parquet dumps (~2.5B items to Feb 2026), search scoped to one subreddit/user, not real-time per one source though another measured ~34 s lag — [Xpoz](https://www.xpoz.ai/blog/tutorials/how-to-get-historical-reddit-data-after-pushshift/); [Arctic Shift starter kit](https://jwatte.com/downloads/arctic-shift-starter-kit.md)

### Inferences
- Use `https://www.reddit.com/r/italy/top/.rss?t=day` and `/rising/.rss` [memory] for r/italy, r/Italia, r/CasualItalian (verify subreddit names/activity), with a descriptive User-Agent, low frequency (a handful of requests/day). If blocked, use ScrapeCreators/other Reddit scrapers (~$1-2/1k requests) or PRAW after approval (non-commercial only).
- Cost: $0 via RSS; ~$1-5/mo via paid scraper.

### Gaps
- Official Reddit Data API terms page not fetched; commercial price floor unverified.
- Which Italian subreddits are active/size: not researched.
- Legal status of RSS scraping for commercial use not verified.

## TikTok, Instagram, X, Threads, Telegram

### Takeaway
No official free trend API for TikTok; Creative Center data is available only via unofficial scrapers (Apify ~$1-5/1k results) and may be shrinking (a listing says public Videos/Creators/Songs feeds were removed June 2026; hashtags apparently remain). Research API is academic-only. X is pay-per-use. Threads has official keyword search; Instagram has a trending-audio endpoint but only for account holders via Facebook Login.

### Cited Findings
- Apify Creative Center scrapers (hashtags/songs/creators/videos by country; 27 vs 47 countries claims differ; ~$1-5/1k results); one listing says TikTok redesigned Creative Center and removed public Videos/Creators/Songs feeds in June 2026 — [eunit](https://apify.com/eunit/tiktok-trends-scraper); [crawlerbros](https://apify.com/crawlerbros/tiktok-hashtag-trends-scraper); [webdata_labs](https://apify.com/webdata_labs/tiktok-hashtag-trends-scraper); [datapeak](https://apify.com/datapeak/tiktok-creative-center) (vendor listings, unverified; Italy coverage not confirmed)
- TikTok Research API: academic institutions in US/EEA/UK/Switzerland and EU non-profits; commercial users excluded; ~4 weeks approval; 1,000 req/day, 100k records/day — [Xpoz](https://www.xpoz.ai/blog/guides/tiktok-research-api-limits-access-and-alternatives/); [TikTok codebook](https://developers.tiktok.com/docs/en/research-api-codebook); [Forklog on EU access barriers](https://forklog.com/en/researchers-report-barriers-to-accessing-social-media-data-in-the-eu/). Commercial Content API reportedly EU ads only (third-party).
- ScrapeCreators: pay-as-you-go, $47 for 25k credits ($1.88/1k), $497 for 500k ($0.99/1k), 100 free credits — [ScrapeCreators](https://scrapecreators.com/blog/pay-as-you-go-scraping-apis); [aisotools](https://aisotools.com/pricing/scrape-creators). EnsembleData $100/mo (1,500 units/day) to $1,400 — [aisotools](https://aisotools.com/pricing/ensembledata). TikAPI $29/$79/$189 per month (conflicting entry-tier descriptions) — [socialcrawl](https://www.socialcrawl.dev/blog/best-tiktok-data-apis-2026); [Xpoz](https://www.xpoz.ai/blog/guides/tiktok-api-pricing-2026/)
- Instagram Audio API: omitting the query returns trending original sounds/music; requires Instagram Platform with Facebook Login; licensed audio only — [Meta docs](https://developers.facebook.com/documentation/instagram-platform/content-publishing/audio-api)
- Meta Content Library/API: researcher-only (via CASD enclave); Threads coverage limited to public profiles with 100+ followers — [Meta](https://transparency.meta.com/en-gb/researchtools/meta-content-library/); [docs](https://developers.facebook.com/docs/content-library-and-api/content-library-api)
- Threads keyword search (incl. TAG mode): 2,200 queries / rolling 24h; no official trending-topics API found — [Meta Threads docs](https://developers.facebook.com/documentation/threads/keyword-search)
- X API: pay-per-use default since 2026-02-06; post read $0.005/resource, user read $0.01, post create ~$0.015 (sources differ); no trends endpoint price found; Enterprise ~$42k/mo — [Gigazine](https://gigazine.net/gsc_news/en/20260209-x-api-pay-per-use); [postproxy](https://www.postproxy.dev/blog/x-api-pricing-2026/); [bundle.social](https://bundle.social/blog/x-api-pricing-2026-costs-limits)

### Inferences
- Weekly Creative Center IT hashtag pull via Apify: ~100 results × 4–5 runs/month ≈ <$1–3/mo; treat as optional, brittle signal. Scraping TikTok may violate ToS; accessible-board scraping is a legal grey area (not verified legally).
- Cheapest viable TikTok signal for commercial: ScrapeCreators (~$47 one-off pack covers months at this scale) for hashtag/search/popular endpoints [endpoint names not verified].
- X: trending data likely unaffordable/unclear; use Trends24-style scrapers or skip. Telegram: public channels readable free via Telethon/MTProto API (api_id, `GetHistory`), no trending list; [memory, not verified now]. Pick Italian news/meme channels manually.

### Gaps
- Telegram, Trends24, TikTok Creative Center official ToS, Italy-specific (region=IT) coverage in scrapers: not verified.
- X trends endpoint cost not found.
- Instagram trending hashtags: no official option found.

## Other aggregators: news, autocomplete, keyword tools

### Takeaway
Free robust signals: Google News Italy RSS and GDELT. NewsAPI/GNews free tiers are small (~100 req/day). Autocomplete endpoints are free but unofficial. Paid keyword APIs (Exploding Topics, Glimpse, Semrush/Ahrefs) were not researched here.

### Cited Findings
- GDELT DOC 2.0: free, no key, searches 65 machine-translated languages, ~3 months window, up to 250 articles per request; Python client `gdeltdoc` — [GDELT blog](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/); [gdeltdoc PyPI](https://pypi.org/project/gdeltdoc/); rate limits not published, `sourcelang:italian` syntax unconfirmed.
- GNews free: 100 req/day, articles from ~past week, language/country filters (it/IT); NewsAPI free: ~100/day, dev-only, ~1 month history, commercial restricted — [cloro.dev](https://cloro.dev/blog/news-api-free/); [toolpod](https://toolpod.dev/blog/10-best-free-news-apis-for-developers-in-2026) (secondary; unverified)

### Inferences
- [memory] Google News Italy RSS: `https://news.google.com/rss?hl=it&gl=IT&ceid=IT:it` (top stories) and topic/search feeds `.../rss/search?q=...&hl=it&gl=IT&ceid=IT:it`; free, no key, headline clustering gives a news-velocity signal. Google autocomplete: `https://suggestqueries.google.com/complete/search?client=firefox&hl=it&gl=it&q=<seed>`; Bing: `https://api.bing.com/osjson.aspx?query=`; DuckDuckGo `https://duckduckgo.com/ac/?q=` — unofficial, use sparingly. All $0.
- Estimated total stack cost: ~$0–40/mo (free tier of above + optional SerpApi $25 + optional ScrapeCreators pack).

### Gaps
- Not researched: Exploding Topics, Glimpse, Semrush/Ahrefs, AnswerThePublic pricing/APIs; Mediastack; Trends24.
- Google News RSS / autocomplete ToS and rate limits not verified.
- GDELT Italian filter syntax unverified.
