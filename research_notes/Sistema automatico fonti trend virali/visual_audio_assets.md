# Visual and audio asset sources for automated faceless Italian short-form video (state: 2026-10-07)

Method note: ~21 tool calls, ~10 primary-page fetches (Pexels, Pixabay, Unsplash, Met, YouTube Help, Wikimedia Commons). Several official pages returned 403 or unreadable content (Smithsonian, Europeana, NASA PDF, Openverse), so those items are in Gaps, not asserted. Pricing for paid/AI tools comes mostly from third-party aggregators and must be re-verified.

## 1. Free stock APIs (Pexels, Pixabay, Unsplash) - terms, limits, fit

### Takeaway
Pexels and Pixabay are the only mainstream free stock APIs with VIDEO and keyword search that are workable for automation; both are commercially usable without attribution but forbid mass/bulk abuse and require some API-level credit. Unsplash is photo-only, hotlink-mandatory, and poor for a download-and-render pipeline.

### Cited Findings
- Pexels API default: 200 requests/hour and 20,000/month; free unlimited available on request if API-terms compliant; attempting to work around the limit can get access terminated. — [Pexels API docs](https://www.pexels.com/api/documentation/)
- Pexels API requires a prominent link to Pexels on API usage and crediting photographers "when possible"; cannot replicate Pexels core functionality. — [Pexels API docs](https://www.pexels.com/api/documentation/)
- Pexels video endpoints moved to `https://api.pexels.com/v1/videos/` (search, popular, by id); old `/videos/` paths to be deprecated. — [Pexels API docs](https://www.pexels.com/api/documentation/)
- Pexels license: photos and videos free to use, attribution not required, edits allowed; prohibited: portraying identifiable people negatively/offensively, selling unaltered copies, implying endorsement, redistributing on other stock platforms, use as trademark. — [Pexels License](https://www.pexels.com/license/)
- Pixabay API: 100 requests per 60 s per key; responses must be cached 24 h; "automated bulk querying and systematic mass downloads are prohibited"; permanent hotlinking of images not allowed (download them); full-res originals/Full HD image URLs require approved full access. — [Pixabay API docs](https://pixabay.com/api/docs/)
- Pixabay video endpoint `https://pixabay.com/api/videos/`: params q (<=100 chars), video_type (film/animation), category, min_width/min_height, editors_choice, safesearch, order, per_page 3-200; renditions large (up to 3840x2160, may be empty), medium, small, tiny. — [Pixabay API docs](https://pixabay.com/api/docs/)
- Pixabay API asks you to show users where images/videos come from when displaying results (in return for free API use). — [Pixabay API docs](https://pixabay.com/api/docs/)
- Pixabay Content License: free commercial use, no attribution required; cannot sell/distribute unchanged; no recognizable trademarks/logos commercially; careful with recognizable people; summary page does not address Content ID. — [Pixabay license summary](https://pixabay.com/service/license-summary/)
- Unsplash API: demo 50 req/h, production 1,000 req/h; images should be hotlinked via returned URLs (keep `ixid`); must call `/photos/:id/download` when a download happens; must credit photographer and Unsplash. Photos only. — [Unsplash docs](https://unsplash.com/documentation)

### Inferences
- A pipeline using Pexels (primary) + Pixabay (secondary) can fit limits easily if it caches search results locally (Pixabay mandates 24 h caching anyway) - 200 req/h is ~ 1 search per scene for dozens of videos/hour.
- "Systematic mass downloads prohibited" (Pixabay) is a legal grey zone for building a local mirror of whole libraries; per-video targeted downloads are safer than bulk crawling.
- Because Pexels/Pixabay clips are free to everyone, the same clip will appear across many channels: a direct driver of "template-like" look and of YouTube repetition flags (see section 5).
- Unsplash: not recommended for the automated render pipeline (hotlink/tracking model); use only for stills with credit.

### Gaps
- Coverr, Mixkit, Videvo, Pexels/Pixabay 2025-2026 terms changes: not verified in this session (no fetch done). Treat as unknown; check each site's license page.
- Whether Pexels/Pixabay API terms permit unattended automated pipelines producing dozens of videos/day without a visible Pexels link on the final video: Pexels text says link on API usage (app context); not clarified for rendered video output.

## 2. Public-domain / open-access cultural and science archives

### Takeaway
Best differentiated (less-stocky) visuals come from CC0/public-domain museum and space archives (Met, Smithsonian, NASA, Wikimedia Commons, Europeana). Italian state archives (Luce, Rai Teche) appear to be paid-licence, not free.

### Cited Findings
- Met Museum Open Access API: no key, asks <=80 requests/s; CC0 for selected datasets (some records identify works still under copyright); v1.1 search paginated (limit max 500, offset+limit <= 10,000); the old v1 search endpoint is deprecated and retired 1 Oct 2026. — [Met API](https://metmuseum.github.io/)
- Wikimedia Commons reuse: media generally CC BY, CC BY-SA, GFDL or public domain, license on each file page; credit the creator (not necessarily uploader), name and link the license, attribution must be "reasonable to the medium"; ShareAlike requires derivative works under same license; non-copyright restrictions (personality rights) may apply. — [Commons:Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia); Italian version: [Commons:Riuso del contenuto](https://commons.wikimedia.org/wiki/Commons:Riuso_del_contenuto_al_di_fuori_di_Wikimedia)
- Archivio Storico Luce: a 2014 Regione Piemonte decision shows paid licensing (about EUR 8,540 for 2-year, Italy-only web-TV rights for 10 films); the Luce YouTube channel uses Content ID. — [Regione Piemonte bollettino](https://www.regione.piemonte.it/governo/bollettino/abbonati/2014/42/attach/dd_cr_a0402a_139_2014.pdf); [Corriere Comunicazioni](https://www.corrierecomunicazioni.it/media/google-su-youtube-l-archivio-dell-istituto-luce/)
- Creative Commons Italia campaigned against Italy's restrictive fees/permission regime on reproductions of cultural-heritage images (signal that Italian museum images often need authorisation despite public-domain works). — [Artribune](https://www.artribune.com/progettazione/new-media/2021/03/no-copyright-cultura-appello-creative-commons-italia/)

### Inferences
- For astrologia/mistero: Met, Smithsonian, Rijksmuseum, Wikimedia (zodiac engravings, old star charts, alchemical manuscripts) offer distinctive vintage visuals; for storia: Commons, LoC, Internet Archive, Europeana. For scienza: NASA/ESA/ESO/Webb.
- In Italy, reuse of photos of Italian cultural heritage objects (Codice dei beni culturali, art. 107-108) can require fees even if the artwork is old; prefer foreign CC0 museum collections or Commons files with explicit CC0/PD marking. (Legal point from Italian context; not verified against statute text in this session - verify.)
- Never mix: Commons CC BY-SA files require on-screen/description credit; automate by storing author+license+URL per asset and auto-generating end-card/description credits.

### Gaps
- Smithsonian Open Access API (403), Europeana API (403), NASA Image & Video Library API rate limits (docs PDF unreadable; the Gaps remain: endpoints seen were search/asset/metadata/captions/album - [NASA PDF](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)), Openverse (rate limits not retrievable), Flickr Commons, Internet Archive, Library of Congress, Rijksmuseum, ESA/ESO/Hubble/Webb, NOAA, Cultura Italia, Rai Teche reuse terms: NOT verified. Do not assert specifics. NASA media guidelines (generally not copyrighted but no implied endorsement; some third-party content excepted) are from background knowledge only.
- Archivio Luce current reuse terms and any Public Domain/free-use subset: not found.

## 3. Paid stock and AI-generated visuals

### Takeaway
Paid music/footage subscriptions give cleaner licensing and Content ID support but API access is generally enterprise/quote-based. AI video is now priced per second (Veo 3.1 about $0.40/s per third parties), making full-AI footage expensive vs stock; AI stills are cheap.

### Cited Findings
- Storyblocks: reported from $21-42/month (sources conflict); API appears tied to Enterprise/quote-only; aggregator claims catalog is exclusive and supports Content ID claim handling and $1M indemnification on Business tier (marketing claims, unverified). — [PricingSaaS](https://pricingsaas.com/companies/storyblocks); [GTM Directory](https://thegtmdirectory.com/tools/storyblocks)
- Envato Elements: roughly $16.50/month (undated listing); lifetime license per downloaded asset claimed by comparison sites; 2025-26 reviews report Content ID claims on Envato music; Claim Clear safelists up to 3 channels and 15 videos/month. — [GTM Directory Envato](https://thegtmdirectory.com/tools/envato-elements); [CheckThat reviews](https://checkthat.ai/brands/envato/reviews)
- Artlist: 2026 aggregator lists Music&SFX $9.99-16.60/mo, Footage $24.90/mo, Max $33.25/mo (annual); social plan does not cover client/commercial work; plan details vary by source. — [Toolsurf](https://www.toolsurf.com/artlist-pricing-2026)
- Veo 3.1 via Gemini API reported at $0.40/s output (checked by Techsy against Google page on 2026-05-19); Veo 3.0 preview reported $0.75/s; a successor "Gemini Omni Flash" reported about $0.10/s at 720p in July 2026 (not confirmed on Google's page). — [Techsy](https://techsy.io/en/blog/gemini-omni-api-pricing); [Google dev forum](https://discuss.ai.google.dev/t/am-i-being-absolutely-ripped-off-to-the-teeth-220-for-35-veo-3-0-videos/96970); official: https://ai.google.dev/gemini-api/docs/pricing (not fetched)
- YouTube AI disclosure: creators must disclose realistic altered/synthetic content (voice cloning, face swaps, realistic fictional events); clearly unrealistic/fantasy content, script/idea generation are exempt; labels more prominent for health, news, elections, finance; repeated non-disclosure can lead to removal or YPP suspension. — [Engadget](https://www.engadget.com/youtube-lays-out-new-rules-for-realistic-ai-generated-videos-154248008.html) (search summary of 2024 rule; not re-verified on YouTube Help)
- TikTok: AIGC label required for realistic AI content, includes AI voiceovers over real footage; C2PA auto-labelling since Jan 2025; label cannot be removed once applied. Meta: "AI info" label via C2PA metadata/self-disclosure for photorealistic content; routine edits exempt. Sources are vendor blogs. — [Cinerads TikTok](https://www.cinerads.com/blog/tiktok-ai-content-policy); [Cinerads comparison](https://www.cinerads.com/blog/ai-ad-disclosure-requirements)

### Inferences
- Cost per minute of video: all-AI footage at $0.40/s = $24/min (Veo 3.1, if figure right); at ~$0.10/s = $6/min; compared with ~$0 for Pexels/Pixabay. A hybrid (AI stills with Ken Burns motion + stock b-roll) is the economic sweet spot. (Arithmetic from cited rates.)
- Stylized/mystic astrology art (clearly unrealistic) falls into the YouTube "no label needed" category, which makes it the safest niche for AI imagery; true crime/finance/history with realistic fabricated scenes carry disclosure and misinformation risk and should avoid photoreal AI.
- AI imagery is a differentiator vs the same stock clips seen everywhere, but only if the style/prompts vary per channel.

### Gaps
- Midjourney (no official API as of my background knowledge, unverified), Flux, Imagen, Ideogram, Sora, Kling, Runway, Luma 2026 pricing/API: not researched; no data.
- Shutterstock/Getty/Adobe Stock API pricing and creator licenses: not researched.
- Storyblocks API exact pricing and terms: only third-party claims.
- Official TikTok/Meta policy pages and any monetization effect of AI labels on TikTok/Meta: not found (YouTube says label itself does not affect eligibility per secondary source).

## 4. Audio: music and voice-over

### Takeaway
No library is Content-ID-proof; YouTube Audio Library is the safest for YouTube, Pixabay Music is usable but some tracks are Content-ID registered, and subscription services (Epidemic, Artlist, Storyblocks) offer channel safelisting. Keep license proof for disputes.

### Cited Findings
- YouTube Audio Library downloads reportedly are not claimed via Content ID, but some tracks require attribution (yellow icon). — [Foxi Music 2026 guide](https://www.foximusic.com/blog/?p=546) (commercial blog; verify on YouTube Help)
- Pixabay Music: Pixabay Content License, music must be part of a larger work; a shield icon marks tracks registered with Content ID; legal use can still trigger automated claims, resolved by dispute with license certificate. — [Foxi Music](https://www.foximusic.com/blog/is-royalty-free-music-copyrighted/); [Thematic comparison](https://hellothematic.com/thematic-vs-pixabay/)
- Royalty-free does not mean Content-ID-free; keep screenshots of license; claim is not a strike but can affect monetization/visibility. — [Foxi Music](https://www.foximusic.com/blog/is-royalty-free-music-copyrighted/)
- Epidemic Sound: Creator plan allows monetization on 1 channel per platform; content published during subscription stays cleared after cancellation (safelisted channels); prices conflicting across trackers ($11-18/mo Personal/Creator); has REST API per third-party overview. — [Recurdash](https://recurdash.com/subscription-pricing/epidemic-sound); [Photutorial](https://photutorial.com/epidemic-sound-pricing)
- ElevenLabs API (July 2026, per aggregators): Flash/Turbo $50 per 1M chars; Multilingual v2/v3 $100 per 1M chars; free tier 10,000 chars/month; Italian supported on Multilingual (Flash v2.5 Italian not confirmed in results). — [Invideo TTS pricing comparison](https://invideo.io/blog/ai-voice-model-pricing/); [ElevenLabs Italian TTS](https://elevenlabs.io/zh/text-to-speech/italian)
- TikTok AIGC label explicitly extends to AI-generated voiceovers. — [Cinerads](https://www.cinerads.com/blog/tiktok-ai-content-policy)

### Inferences
- A 60-s Italian script is about 900-1,000 characters: ~$0.05-0.10 per video on ElevenLabs API ($50-100 per 1M chars), negligible vs. visuals.
- Synthetic-voice policy: YouTube's inauthentic-content rule penalises low-effort voice+slideshow, not synthetic voices per se (see section 5). A high-quality narration with real script value is the key.

### Gaps
- TikTok Commercial Music Library terms (business accounts only?), Artlist/Epidemic/Storyblocks official licence texts, OpenAI TTS, Azure, Google, Fish Audio Italian quality/prices, platform views on synthetic voices beyond label: not researched.
- YouTube Help pages for Audio Library not fetched.

## 5. Automation: keyword-to-visual matching, anti-repetition, and avoiding "template look"

### Takeaway
YouTube's official policy explicitly lists template-looking, repetitive, mass-produced content and slideshow-like videos with minimal narrative as ineligible; the practical mitigation is varied substance, varied visual treatment, and original elements - not just swapping clips.

### Cited Findings
- YouTube Help (monetization policies): July 15, 2025 renamed "repetitious content" to "inauthentic content"; "Generic or repetitive content includes content that looks like it's made with a template"; content should "Not be mass-produced, generic, repetitive, or manipulative"; repeated intros/outros OK if bulk differs; "the substance of each video should be materially varied"; ineligible: "Image slideshows, templated storylines, or scrolling text with minimal or no narrative"; AI content excluded when using "generic or unoriginal templates giving the impression of mass production"; reused content policy applies at channel level even with permission. — [YouTube Help](https://support.google.com/youtube/answer/1311392)
- Secondary reporting: AI content not banned if it adds original value (commentary, editing, narration); background music/speed change/cropping is not enough; YouTube called it a clarification. — [Social Samosa](https://www.socialsamosa.com/news-2/youtube-clarifies-monetisation-policy-targeting-inauthentic-content-9493155); [Plagiarism Today](https://www.plagiarismtoday.com/2025/07/08/youtube-targets-inauthentic-content/)
- Existing open-source reference: MoneyPrinterTurbo (Python; topic -> LLM script -> LLM-generated search terms -> Pexels clips -> TTS -> subtitles -> MP4; Streamlit UI + FastAPI); relevance depends on LLM search terms. — [Verdent guide](https://www.verdent.ai/guides/moneyprinterturbo-github) (secondary; repo not read)

### Inferences (design recommendations, not sourced facts)
- Scene-level pipeline: LLM splits script into scenes with (a) literal keywords, (b) abstract/visual metaphor keywords, (c) English translation of Italian terms (stock libraries are English-indexed; Pexels/Pixabay search in English works best). Query several sources, pool ~20 candidates per scene.
- Rerank candidates with CLIP/SigLIP embeddings of thumbnails vs scene text (or LLM vision), then penalise reuse via a global "used asset" table (asset id, channel, date); enforce per-channel cooldown and cross-channel uniqueness. Cache search results (required 24 h by Pixabay).
- De-templating: per-channel visual identity (colour grade LUT, typography, caption animation style), randomised scene-length rhythm, mix of source types (stock + public-domain archive images + AI stylised stills + generated motion graphics/charts/maps), varied hooks/structures, original overlays (data charts for finanza, timelines for storia, own screen recordings). Rendering with Remotion/FFmpeg/MoviePy is feasible but parameterise layouts so videos are not visually identical (YouTube text: "looks like it's made with a template").
- Add per-video substance (research, specific facts, commentary) because YouTube judges substance, not just visuals.

### Gaps
- No evidence found on how YouTube technically detects repetition (secondary sources only say "enhanced detection"); no data on CLIP-based stock matching projects beyond MoneyPrinterTurbo; Remotion/MoviePy specifics not researched.

## 6. Attribution and licence tracking; fit per niche

### Takeaway
Store source, author, licence, URL and retrieval date per asset and generate credits automatically; most CC0/Pexels/Pixabay assets need no credit but Commons CC BY/BY-SA and Luce/other paid archives do.

### Cited Findings
- Commons: credit creator, name licence and link it, attribution reasonable for the medium (so description/end-card is acceptable); ShareAlike for derivatives. — [Commons reuse](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- Pixabay/Pexels: no mandatory credit under licence, but API terms ask for source display. — [Pixabay API](https://pixabay.com/api/docs/); [Pexels API](https://www.pexels.com/api/documentation/)
- Pexels/Pixabay licenses both restrict depicting identifiable people in misleading/offensive ways. — [Pexels License](https://www.pexels.com/license/); [Pixabay license](https://pixabay.com/service/license-summary/)

### Inferences
- Suggested schema: asset_id, source, source_url, author, license_id/version, requires_attribution, share_alike flag, people_present flag, retrieved_at, sha256, used_in_video_ids, channel. Add auto-generated credit line in description and (for Shorts, where descriptions are low-visibility) a brief end-frame credit for BY/BY-SA items.
- Is a video using a CC BY-SA image itself bound by SA? Commons text says derivative works must carry same license; whether a video "incorporating" an image is an adaptation is legally unsettled - avoid BY-SA in monetized video or limit to CC0/PD/CC BY (inference; seek legal advice).
- Niche fit: astrologia - AI stylised art + museum engravings (Met/Smithsonian CC0) + NASA star/planet imagery; curiosita - Pexels/Pixabay b-roll + Commons; scienza/storia - NASA/ESA/Commons/LoC/Met; psicologia - Pexels abstract/people b-roll (watch identifiable-people rules: negative portrayal prohibited, e.g. mental-illness topics); motivazionale - Pexels/Pixabay nature/cityscape, paid Artlist/Storyblocks; true crime/misteri - public-domain archival photos, maps, newspaper scans (avoid identifiable stock people portrayed as criminals; Pexels/Pixabay license bans negative portrayal); finanza - own charts/data overlays (YouTube applies more prominent AI labels on finance), stock office/city b-roll.

### Gaps
- Per-niche performance evidence not found; niche fit above is inference.
- Italian-specific legal checks (personality rights, Codice dei beni culturali) not verified.
