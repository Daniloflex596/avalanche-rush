# Automated discovery and analysis of viral short-form scripts (IT/EN) — state as of 2026-10-07

Bias flag: much of the tool pricing/comparison material comes from vendors with a commercial interest (OutlierKit, ScrapeCreators, SocialCrawl, Virlo, Xpoz). Prices are from search snippets of third-party and vendor pages, not verified on live pricing pages; confirm before budgeting.

## 1. Discovery methods and tool pricing

### Takeaway
For YouTube Shorts, the official Data API is cheap if you track a curated channel list via uploads playlists (1 unit/call) and avoid search.list (100 units/call). For TikTok/Instagram, pay-per-request scraping APIs (ScrapeCreators, EnsembleData, Apify actors) cost roughly $1-5 per 1,000 items and are the pragmatic route; ready-made outlier SaaS (1of10, ViewStats, vidIQ) are YouTube-centric.

### Cited Findings
- YouTube Data API: default 10,000 units/day per project; search.list costs 100 units, videos.list 1 unit; each paginated page adds full cost; quota resets midnight Pacific; extra quota only via the audit/extension form — [Google overview](https://developers.google.com/youtube/v3/getting-started); [ChannelCrawler (Mar 2026)](https://channelcrawler.com/insights/youtube-api-daily-limit-quotas-costs-and-how-to-scale-beyond-10000-units-channelcrawler); [OutlierKit guide](https://outlierkit.com/resources/youtube-search-api/) (vendor)
- Reading a channel's uploads playlist costs ~1 unit instead of search — [OutlierKit quota guide](https://outlierkit.com/resources/youtube-api-quota/) (vendor)
- ScrapeCreators: credit-based; ~$47 for 25,000 credits (about $1.88/1k), $497 for 500k, 100 free credits, credits do not expire, ~1 credit per request, Instagram transcripts only for videos under 2 minutes — [ScrapeCreators](https://scrapecreators.com/); [SocialCrawl comparison](https://www.socialcrawl.dev/blog/best-tiktok-data-apis-2026) (tier labels were garbled in snippet; vendor)
- EnsembleData: daily-unit plans — Wood $100/mo 1,500 units/day; Bronze $200/mo 5,000; Silver $400/mo 11,000; Gold $800 25,000; Platinum $1,400 50,000; user posts ~1 unit per 10 posts; keyword search ~20 posts/unit; per-call costs conflict between sources — [ScrapeCreators roundup](https://scrapecreators.com/blog/best-tiktok-scrapers), [Phyllo](https://www.getphyllo.com/post/social-data-api-pricing), [Xpoz](https://www.xpoz.ai/blog/comparisons/best-tiktok-api-alternatives-2026/), [aisotools](https://aisotools.com/tool/ensembledata)
- Apify actors (third-party-priced): TikTok scrapers about $0.25 to $4 per 1k results ([example $0.25/1k](https://apify.com/dami_studio/tiktok-scraper?fpr=wcqem0), [roundup](https://use-apify.com/docs/best-apify-actors/best-tiktok-scrapers)); Instagram Reel scrapers about $1.5-3 per 1k, measured ~$2.30/1k in one competitor benchmark — [Apify Reel scraper](https://apify.com/autoscraping/instagram-reel-scraper), [ScrapeCreators benchmark](https://scrapecreators.com/blog/apify-instagram-reels-scraper-benchmark) (competitor)
- An Apify "YouTube Outlier Finder" actor exists (classifies by multiple of channel median) — [Apify](https://apify.com/vanity_arias/youtube-outlier-finder)
- Outlier SaaS (YouTube-focused): 1of10 free / $29 Basic / $69 Pro (one source says $39); ViewStats Pro $49.99/mo, Business from $249; vidIQ ~ $7.50-39/mo (sources disagree); OutlierKit from $9/mo — [OutlierKit comparison](https://outlierkit.com/resources/1of10-vs-viewstats/), [OutlierKit 1of10 vs vidIQ](https://outlierkit.com/blog/1of10-vs-vidiq) (written by a competitor)
- Virlo: REST/MCP API over TikTok, Shorts, Reels with velocity ranking; Starter ~$49/mo (Pro $149-199 conflicting); API credit-based, some requests 150 credits ($1.50) — [Virlo about](https://virlo.ai/about), [dev.to post](https://dev.to/virlobuilder/i-built-an-api-that-tracks-viral-tiktok-reels-and-youtube-shorts-content-in-real-time-3593), [changelog](https://dev.virlo.ai/changelog) (vendor)

### Inferences
- A weekly job tracking ~100-200 channels via uploads playlists (playlistItems.list + videos.list in batches of 50) needs well under 1,000 units/day, so it fits the free quota.
- Rough monthly cost for a lean stack: YouTube API $0; ScrapeCreators or Apify for TikTok/IG ~$20-50; optional 1of10/ViewStats $29-50. EnsembleData ($100+) only if volume demands it.

### Gaps
- No data found on Exolyt, Pentos, Social Blade, HypeAuditor, Tikapi, Bright Data, ViralFindr pricing/reliability (not searched or not surfaced). No independent reliability benchmark of scrapers in 2026.

## 2. Transcript extraction

### Takeaway
youtube-transcript-api works locally but cloud IPs are frequently blocked; residential proxies or fallback to downloading audio and running Whisper-class ASR is the robust path. ASR via Groq Whisper turbo is by far the cheapest (~$0.04/hour).

### Cited Findings
- youtube-transcript-api: YouTube blocks most cloud-provider IPs (RequestBlocked/IpBlocked); README suggests rotating residential proxies (Webshare integration); free Webshare tier reportedly datacenter-only and ineffective; cookie auth discouraged (account bans) — [GitHub](https://github.com/jdepoix/youtube-transcript-api), [issue 593](https://github.com/jdepoix/youtube-transcript-api/issues/593)
- Groq whisper-large-v3-turbo $0.04/hour, 10-second minimum per request; full large-v3 $0.111/hour — [Groq](https://groq.com/whisper-large-v3-turbo-now-available-on-groq-combining-speed-quality-for-speech-recognition/), [Groq ASR guide](https://groq.com/GroqDocs/Groq%20ASR%20Model%20Guide.pdf)
- Deepgram Nova-3 about $0.0043/min batch (~$0.26/h), $0.0048-0.0092/min streaming; $200 free credit — [convertaudiototext](https://convertaudiototext.com/blog/deepgram-nova-3-explained), [diyai](https://diyai.io/ai-tools/speech-to-text/deepgram-pricing-2026/) (aggregators)
- AssemblyAI about $0.15-0.21/hour base, $50 free credit; one source's per-minute figure looks like an error — [Costbench](https://costbench.com/software/ai-transcription-apis/assemblyai/calculator/), [Gladia](https://gladia.io/blog/assemblyai-pricing)
- Whisper large-v3 reported to hallucinate more on real-world audio than v2 (Deepgram analysis, competitor) — [Deepgram](https://deepgram.com/learn/whisper-v3-results)
- Fine-tuned Italian Whisper model reports 3.07% WER FLEURS / 10.27% Common Voice 25 (not the stock model) — [BuzzASR](https://huggingface.co/BuzzASR/italian)
- Instagram transcripts via ScrapeCreators limited to <2 min videos — [ScrapeCreators](https://scrapecreators.com/)

### Inferences
- 500 Shorts/Reels of ~45s is ~6 hours of audio: under $1 on Groq turbo. ASR cost is negligible; scraping and LLM analysis dominate.
- Short clips with music/voiceover: Italian accuracy should be validated on a 50-clip sample with a human-corrected reference.

### Gaps
- No verified stock Whisper large-v3 Italian WER (OpenAI paper/model card table not fetched). No source on captions.download quota/limits (needs channel-owner OAuth; I believe it does not work for third-party videos, unverified). No OCR tool comparison found (candidates: PaddleOCR, Tesseract, or multimodal LLM on sampled frames).

## 3. Outlier and virality metrics

### Takeaway
The standard outlier score is views divided by the channel's median recent views (median beats mean); practitioners use 2x as noise-to-investigate, 3x as outlier, 5x strong, 10x+ breakout. Always normalise for video age and require a minimum baseline sample.

### Cited Findings
- Views ÷ channel median baseline; median safer than average; tiers 2x/3x-5x/5-10x/10x+ — [OutlierKit outlier scores](https://outlierkit.com/resources/outlier-scores/), [how to find outliers](https://outlierkit.com/resources/how-to-find-outlier-videos/)
- Apify actor code classes: >=3x OUTLIER, 5x STRONG, 10x BREAKOUT, 20x MONSTER — [Apify actor](https://apify.com/vanity_arias/youtube-outlier-finder)
- OverseerOS study (938 videos, 137 channels): median 5x+ outlier was 16.2x short-form vs 16.15x long-form; thresholds are not official; small baselines inflate scores; compare similar video ages — [OverseerOS](https://www.overseeros.com/blog/youtube-outlier-benchmark-report), [outlier trap](https://www.overseeros.com/blog/youtube-outlier-trap) (vendor)

### Inferences (my own formulas, not sourced)
- outlier = views / median(views of channel's last 20-30 Shorts, excluding the video itself); require >=10 baseline videos.
- velocity = views / hours since publish (snapshot twice: at ~24h and ~72h via repeated videos.list; the API gives only cumulative counts, so velocity needs your own snapshots).
- engagement: like/view, comment/view, (shares+saves)/view on TikTok/IG where available; YouTube Shorts API exposes likes and comments only.
- viral score = 0.5*log(outlier) + 0.3*z(velocity) + 0.2*z(engagement); weekly leaderboard: filter published in last 7 days and language=it/en, rank by score, keep top 50 per niche, de-duplicate per channel (max 3).
- subscriber ratio (views/subs) helps find small channels breaking out, but weak for Shorts, which are fed to non-subscribers.

### Gaps
- No source for retention proxies on third-party videos (not public). No Shorts-specific peer-reviewed thresholds.

## 4. Hook and structure analysis with LLMs

### Takeaway
No standard hook taxonomy exists; define your own mutually exclusive labels, feed the LLM transcript + on-screen text + sampled first-3s frames, validate against human labels, and store derived patterns, not scripts.

### Cited Findings
- 2026 arXiv paper analyses the first 3 seconds of video ads with multimodal LLMs and BERTopic clustering of generated descriptions — [arXiv 2602.22299](https://arxiv.org/abs/2602.22299)
- Practitioner taxonomies differ (curiosity gap, contrarian, direct address, visual interrupt, mid-action, social proof); no unified standard — [Captions](https://captions.ai/blog/video-hooks-how-to-write-a-scroll-stopping-opening), [CapCut](https://www.capcut.com/create/short-form-video-hooks), [go-viral](https://www.go-viral.app/blog/best-hooks-for-short-form-video/) (marketing content; retention stats unverified)

### Inferences (suggested design)
- Schema per video (JSON): hook_type, hook_text_paraphrase, hook_end_sec, beats[{t,function}], open_loop (bool), payoff_time, cta_type, total_words, words_per_sec, language, niche, emotional_driver, tone. Use structured outputs; temperature 0; two-pass (label then critique).
- Cluster by embedding hook/structure descriptions (not raw text), label clusters, keep a swipe file of patterns with example IDs and metrics; for generation, give the model the abstract pattern and require new topic/facts.
- Validate: 50 human-labelled clips, check agreement (Cohen's kappa) before trusting.

### Gaps
- No rigorous study linking LLM-labelled hook types to retention.

## 5. Legal and ToS

### Takeaway
Safest design: YouTube via official API (store only derived patterns and IDs, refresh stats within 30 days); TikTok/IG via vendors that bear scraping risk, never with your own logged-in accounts; keep personal data minimal and store paraphrased patterns, not transcripts.

### Cited Findings
- YouTube API Developer Policies: non-authorized data (e.g. stats) must be refreshed or deleted within 30 days; developer reported a violation notice for storing stats longer; a blog claims a June 2026 amendment lets audited developers store some stats longer (unverified) — [Policies](https://developers.google.com/youtube/terms/developer-policies), [Tubular terms](https://tubularlabs.com/tubular-labs-online-api-terms-of-service), [teratail](https://teratail.com/questions/261315?rss=all)
- Meta v. Bright Data (N.D. Cal., Jan 2024): logged-out scraping of public data did not breach Meta's terms; narrow, fact-specific, other claims continued — [FBM](https://www.fbm.com/data-analytics/publications/major-decision-affects-law-of-scraping-and-online-data-collection-meta-platforms-v-bright-data/), [MediaPost](https://www.mediapost.com/publications/article/392920/judge-sides-against-meta-in-battle-over-scraping-p.html)
- TikTok terms reportedly prohibit automated access; ToS breach is civil (account/IP bans); GDPR applies to public personal data — [SocialCrawl legal guide](https://www.socialcrawl.dev/blog/social-media-scraping-legal-technical-guide.md), [SociaVault](https://sociavault.com/blog/is-scraping-tiktok-legal-2026) (scraping vendors; TikTok ToS not checked directly)
- Italy: TDM exceptions arts. 70-ter/70-quater LDA (d.lgs. 177/2021, from CDSM Directive); Law 132/2025 (in force 10 Oct 2025) extends TDM to AI systems conditioned on lawful access and the existing exceptions (commercial TDM subject to rightsholder opt-out), adds a sanction under art. 171-ter; exact article numbering disputed among sources — [Communia](https://communia-association.org/2025/10/01/italy-updates-its-copyright-law-to-address-ai/), [Agenda Digitale](https://www.agendadigitale.eu/mercati-digitali/diritto-dautore-leccezione-di-text-and-data-mining-nella-direttiva-copyright/), [consulenza.it](https://www.consulenza.it/Contenuti/News/news/9514/legge-sullai-e-diritto-dautore-cosa-cambia-e)

### Inferences
- Italy has no US-style fair use; the TDM exception (analysis to extract patterns/trends) is the closer fit, but it is conditioned on lawful access and opt-out, and ToS-violating access may undermine "lawful". Not legal advice; consult an Italian IP lawyer.
- Burner accounts increase ToS exposure and ban risk; prefer logged-out access via vendor APIs. Do not store creator handles beyond need; keep video IDs/URLs plus derived features.

### Gaps
- Not verified: TikTok/Instagram current ToS text, Garante privacy guidance on scraping, Normattiva text of L.132/2025, EU court rulings on transcripts as works.

## 6. Italian specifics

### Takeaway
I found no authoritative source for Italian seed lists; the approach must be built empirically, and English scripts can be localized but should be rewritten, not literally translated.

### Cited Findings
- None sourced for Italian creator seed lists or hashtag performance in this research.

### Inferences (unsourced, my suggestions)
- Seed method: run hashtag/keyword queries (#oroscopo, #segnizodiacali, #curiosità, #psicologia, #truecrime, #motivazione) via a scraper API with language filter (YouTube relevanceLanguage=it, regionCode=IT), take authors appearing repeatedly, then snowball via "related" creators; detect language of captions with fastText/lingua and keep it only.
- Localization workflow: extract abstract pattern from the EN script, regenerate in Italian with Italian examples, references and units (euros, Italian cultural context), idiomatic hook phrasing; native-speaker review; never publish a near-literal translation (copyright and plagiarism risk).

### Gaps
- Italian competitor lists, relative performance of EN-to-IT adaptation, and Italian-market benchmarks: no sources found.
