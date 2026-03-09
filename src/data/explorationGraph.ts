/**
 * Exploration Graph — the three-level discovery hierarchy.
 *
 * World → Region → Landmark → Neighborhood
 *
 * When Atlas loads, only region shapes are visible (World level).
 * Clicking a region reveals its 6–10 landmark artifacts.
 * Clicking a landmark spawns its neighborhood in a radial layout.
 *
 * All slugs must exist in artifacts.csv / the ARTIFACT_REGISTRY.
 */

// ── Level 2: Region Landmarks ─────────────────────────────────────────────────
// The artifacts shown when a user enters a region.
// Keep to 6–10 entries per region for a calm, readable view.

export const REGION_LANDMARKS: Record<string, string[]> = {
  'Early Web': [
    'world-wide-web',
    'netscape-navigator',
    'internet-explorer',
    'geocities',
    'webrings',
    'personal-homepages',
    'mosaic',
    'chrome',
  ],

  'Information': [
    'google',
    'wikipedia',
    'yahoo',
    'altavista',
    'internet-archive',
    'wayback-machine',
    'ask-jeeves',
    'slashdot',
  ],

  'Personal Publishing': [
    'blogger',
    'livejournal',
    'wordpress',
    'tumblr',
    'rss',
  ],

  'Messaging': [
    'icq',
    'aol-instant-messenger',
    'irc',
    'msn-messenger',
    'discord',
    'skype',
  ],

  'File Sharing': [
    'napster',
    'limewire',
    'bittorrent',
    'the-pirate-bay',
    'winamp',
    'spotify',
  ],

  'Forums & Culture': [
    'bbs',
    'something-awful',
    '4chan',
    'reddit',
    'ytmnd',
    'know-your-meme',
    'anonymous',
  ],

  'Creative Web': [
    'newgrounds',
    'macromedia-flash',
    'adobe-flash',
    'homestar-runner',
    'deviantart',
  ],

  'Social Platforms': [
    'friendster',
    'myspace',
    'facebook',
    'twitter',
    'instagram',
    'tiktok',
  ],

  'Video & Viral': [
    'hamster-dance',
    'numa-numa',
    'lolcats',
    'star-wars-kid',
    'dancing-baby',
    'rickroll',
    'leeroy-jenkins',
    'all-your-base-are-belong-to-us',
  ],

  'Commerce': [
    'ebay',
    'craigslist',
    'paypal',
  ],

  'Internet DNA': [
    'guestbooks',
    'hit-counters',
    'gif-culture',
    'avatars',
    'away-messages',
    'copypasta',
    'reaction-gifs',
    'ascii-art',
  ],

  'Nordic / Local Web': [
    'lunarstorm',
    'bilddagboken',
    'passagen',
    'fragbite',
    'spray',
    'sweclockers',
  ],
};

// ── Level 3: Landmark Neighborhoods ──────────────────────────────────────────
// The artifacts that spawn around a landmark when you click it.
// These appear in a radial layout around the landmark.
// Keep to 6–10 per landmark.

export const LANDMARK_NEIGHBORHOODS: Record<string, string[]> = {
  // Early Web
  'geocities': [
    'personal-homepages',
    'webrings',
    'guestbooks',
    'hit-counters',
    'fan-pages',
    'netscape-navigator',
    'guestbook-culture',
    'geocities-neighborhoods',
  ],
  'netscape-navigator': [
    'mosaic',
    'internet-explorer',
    'world-wide-web',
    'geocities',
    'webrings',
    'chrome',
  ],
  'world-wide-web': [
    'mosaic',
    'netscape-navigator',
    'internet-explorer',
    'personal-homepages',
    'webrings',
    'internet-archive',
  ],
  'internet-explorer': [
    'netscape-navigator',
    'chrome',
    'mosaic',
    'pop-up-ads',
    'banner-ads',
  ],
  'webrings': [
    'geocities',
    'personal-homepages',
    'hit-counters',
    'guestbooks',
    'fan-pages',
  ],
  'personal-homepages': [
    'geocities',
    'webrings',
    'guestbooks',
    'hit-counters',
    'fan-pages',
    'signatures',
  ],

  // Information
  'google': [
    'yahoo',
    'altavista',
    'ask-jeeves',
    'yahoo-directory',
    'slashdot',
    'digg',
    'stumbleupon',
  ],
  'wikipedia': [
    'internet-archive',
    'wayback-machine',
    'google',
    'everything2',
  ],
  'yahoo': [
    'google',
    'altavista',
    'yahoo-directory',
    'ask-jeeves',
    'digg',
    'stumbleupon',
  ],
  'altavista': [
    'yahoo',
    'google',
    'ask-jeeves',
    'netscape-navigator',
  ],
  'internet-archive': [
    'wayback-machine',
    'wikipedia',
    'geocities',
    'google',
  ],

  // Personal Publishing
  'blogger': [
    'livejournal',
    'wordpress',
    'tumblr',
    'rss',
    'blogspot',
    'rss-readers',
  ],
  'livejournal': [
    'blogger',
    'wordpress',
    'tumblr',
    'myspace',
    'personal-homepages',
  ],
  'wordpress': [
    'blogger',
    'livejournal',
    'tumblr',
    'rss',
    'blogspot',
  ],
  'tumblr': [
    'blogger',
    'livejournal',
    'wordpress',
    'deviantart',
    'tumblr-fandom',
    'tumblr-aesthetics',
  ],

  // Messaging
  'icq': [
    'aol-instant-messenger',
    'msn-messenger',
    'irc',
    'away-messages',
    'buddy-lists',
    'aim-away-messages',
  ],
  'aol-instant-messenger': [
    'icq',
    'msn-messenger',
    'irc',
    'away-messages',
    'skype',
    'aim-away-messages',
  ],
  'irc': [
    'bbs',
    'icq',
    'aol-instant-messenger',
    'something-awful',
    'discord',
  ],
  'msn-messenger': [
    'icq',
    'aol-instant-messenger',
    'skype',
    'discord',
    'away-messages',
  ],
  'discord': [
    'irc',
    'msn-messenger',
    'reddit',
    'skype',
  ],

  // File Sharing
  'napster': [
    'limewire',
    'bittorrent',
    'winamp',
    'kazaa',
    'the-pirate-bay',
    'spotify',
  ],
  'limewire': [
    'napster',
    'bittorrent',
    'kazaa',
    'the-pirate-bay',
    'winamp',
  ],
  'bittorrent': [
    'napster',
    'limewire',
    'the-pirate-bay',
    'kazaa',
    'spotify',
  ],
  'the-pirate-bay': [
    'bittorrent',
    'napster',
    'limewire',
    'kazaa',
  ],
  'winamp': [
    'napster',
    'limewire',
    'spotify',
    'last-fm',
  ],
  'spotify': [
    'napster',
    'winamp',
    'bittorrent',
    'youtube',
  ],

  // Forums & Culture
  'bbs': [
    'irc',
    'something-awful',
    '4chan',
    'reddit',
    'usenet',
  ],
  'something-awful': [
    'bbs',
    '4chan',
    'reddit',
    'ytmnd',
    'know-your-meme',
  ],
  '4chan': [
    'something-awful',
    'reddit',
    'anonymous',
    'ytmnd',
    'memes',
    'know-your-meme',
  ],
  'reddit': [
    '4chan',
    'something-awful',
    'digg',
    'slashdot',
    'discord',
  ],
  'ytmnd': [
    'something-awful',
    '4chan',
    'newgrounds',
    'hamster-dance',
    'know-your-meme',
  ],

  // Creative Web
  'newgrounds': [
    'macromedia-flash',
    'adobe-flash',
    'homestar-runner',
    'deviantart',
    'ytmnd',
    'albino-blacksheep',
    'stick-figure-fights',
  ],
  'macromedia-flash': [
    'newgrounds',
    'adobe-flash',
    'homestar-runner',
    'ytmnd',
    'albino-blacksheep',
  ],
  'adobe-flash': [
    'macromedia-flash',
    'newgrounds',
    'homestar-runner',
    'deviantart',
  ],
  'homestar-runner': [
    'newgrounds',
    'macromedia-flash',
    'ytmnd',
    'something-awful',
  ],
  'deviantart': [
    'newgrounds',
    'tumblr',
    'livejournal',
    'fanfiction-culture',
  ],

  // Social Platforms
  'friendster': [
    'myspace',
    'hi5',
    'bebo',
    'facebook',
    'livejournal',
  ],
  'myspace': [
    'friendster',
    'facebook',
    'livejournal',
    'bebo',
    'hi5',
    'top-8',
  ],
  'facebook': [
    'myspace',
    'twitter',
    'instagram',
    'friendster',
    'hi5',
  ],
  'twitter': [
    'facebook',
    'instagram',
    'reddit',
    'tumblr',
    'twitter-x-retweet-culture',
  ],
  'instagram': [
    'facebook',
    'twitter',
    'tumblr',
    'tiktok',
  ],
  'tiktok': [
    'instagram',
    'twitter',
    'vine',
    'youtube',
  ],

  // Video & Viral
  'hamster-dance': [
    'numa-numa',
    'star-wars-kid',
    'dancing-baby',
    'all-your-base-are-belong-to-us',
    'ytmnd',
  ],
  'lolcats': [
    'know-your-meme',
    'something-awful',
    '4chan',
    'hamster-dance',
    'rickroll',
  ],
  'rickroll': [
    'lolcats',
    'numa-numa',
    'know-your-meme',
    '4chan',
    'youtube',
  ],

  // Commerce
  'ebay': [
    'craigslist',
    'paypal',
    'amazon-reviews',
    'etsy',
  ],

  // Internet DNA
  'guestbooks': [
    'geocities',
    'personal-homepages',
    'webrings',
    'hit-counters',
    'fan-pages',
  ],
  'gif-culture': [
    'reaction-gifs',
    'dancing-baby',
    'hamster-dance',
    'numa-numa',
    'ascii-art',
  ],

  // Nordic
  'lunarstorm': [
    'bilddagboken',
    'passagen',
    'fragbite',
    'spray',
    'sweclockers',
    'myspace',
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Get landmark slugs for a given region label (falls back to empty array) */
export function getRegionLandmarks(regionLabel: string): string[] {
  return REGION_LANDMARKS[regionLabel] ?? [];
}

/** Get neighborhood slugs for a given landmark slug (falls back to empty array) */
export function getLandmarkNeighborhood(slug: string): string[] {
  return LANDMARK_NEIGHBORHOODS[slug] ?? [];
}

/** The radius (in canvas units) for radial neighborhood layout */
export const NEIGHBORHOOD_RADIUS = 290;
