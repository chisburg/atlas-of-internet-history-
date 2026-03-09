/**
 * Thumbnail pipeline — master target list for Tier 1 + Tier 2 artifacts.
 *
 * wikipedia: Wikipedia article title for the REST summary API.
 *   → https://en.wikipedia.org/api/rest_v1/page/summary/{title}
 *   The response contains thumbnail.source (lead image / screenshot).
 *
 * waybackUrl: Optional direct Wayback Machine path if the Wikipedia
 *   thumbnail is not meaningful (logo-only).
 *   Format: https://web.archive.org/web/{timestamp}/{url}
 *
 * output_path is always /thumbnails/{slug}.jpg
 */

export interface ThumbnailTarget {
  slug:         string;
  tier:         1 | 2;
  preferred_year: number;
  canonical_url:  string;
  wikipedia?:     string;   // Wikipedia article title
  waybackUrl?:    string;   // Specific Wayback Machine snapshot
  output_path:    string;   // public path, e.g. /thumbnails/geocities.jpg
}

export const THUMBNAIL_TARGETS: ThumbnailTarget[] = [
  // ── Tier 1 ─────────────────────────────────────────────────────────────────

  {
    slug: 'world-wide-web', tier: 1, preferred_year: 1991,
    canonical_url: 'http://info.cern.ch/',
    wikipedia: 'World_Wide_Web',
    waybackUrl: 'https://web.archive.org/web/19961017235908/http://www.w3.org/',
    output_path: '/thumbnails/world-wide-web.jpg',
  },
  {
    slug: 'netscape-navigator', tier: 1, preferred_year: 1995,
    canonical_url: 'http://home.netscape.com/',
    wikipedia: 'Netscape_Navigator',
    waybackUrl: 'https://web.archive.org/web/19961017031003/http://home.netscape.com/',
    output_path: '/thumbnails/netscape-navigator.jpg',
  },
  {
    slug: 'geocities', tier: 1, preferred_year: 1998,
    canonical_url: 'http://www.geocities.com/',
    wikipedia: 'GeoCities',
    waybackUrl: 'https://web.archive.org/web/19981212031312/http://www.geocities.com/',
    output_path: '/thumbnails/geocities.jpg',
  },
  {
    slug: 'google', tier: 1, preferred_year: 2000,
    canonical_url: 'http://www.google.com/',
    wikipedia: 'Google',
    waybackUrl: 'https://web.archive.org/web/19981111181551/http://google.com/',
    output_path: '/thumbnails/google.jpg',
  },
  {
    slug: 'blogger', tier: 1, preferred_year: 2002,
    canonical_url: 'http://www.blogger.com/',
    wikipedia: 'Blogger_(service)',
    waybackUrl: 'https://web.archive.org/web/20021009020459/http://www.blogger.com/',
    output_path: '/thumbnails/blogger.jpg',
  },
  {
    slug: 'icq', tier: 1, preferred_year: 1999,
    canonical_url: 'http://www.icq.com/',
    wikipedia: 'ICQ',
    output_path: '/thumbnails/icq.jpg',
  },
  {
    slug: 'napster', tier: 1, preferred_year: 2000,
    canonical_url: 'http://www.napster.com/',
    wikipedia: 'Napster',
    waybackUrl: 'https://web.archive.org/web/20000511230540/http://www.napster.com/',
    output_path: '/thumbnails/napster.jpg',
  },
  {
    slug: 'newgrounds', tier: 1, preferred_year: 2004,
    canonical_url: 'http://www.newgrounds.com/',
    wikipedia: 'Newgrounds',
    waybackUrl: 'https://web.archive.org/web/20040101090000/http://www.newgrounds.com/',
    output_path: '/thumbnails/newgrounds.jpg',
  },
  {
    slug: 'myspace', tier: 1, preferred_year: 2005,
    canonical_url: 'http://www.myspace.com/',
    wikipedia: 'Myspace',
    waybackUrl: 'https://web.archive.org/web/20050301012843/http://www.myspace.com/',
    output_path: '/thumbnails/myspace.jpg',
  },
  {
    slug: 'reddit', tier: 1, preferred_year: 2008,
    canonical_url: 'http://www.reddit.com/',
    wikipedia: 'Reddit',
    waybackUrl: 'https://web.archive.org/web/20081001000000/http://www.reddit.com/',
    output_path: '/thumbnails/reddit.jpg',
  },
  {
    slug: 'facebook', tier: 1, preferred_year: 2007,
    canonical_url: 'http://www.facebook.com/',
    wikipedia: 'Facebook',
    waybackUrl: 'https://web.archive.org/web/20070101000000/http://www.facebook.com/',
    output_path: '/thumbnails/facebook.jpg',
  },
  {
    slug: 'wikipedia', tier: 1, preferred_year: 2004,
    canonical_url: 'http://www.wikipedia.org/',
    wikipedia: 'Wikipedia',
    waybackUrl: 'https://web.archive.org/web/20040101000000/http://en.wikipedia.org/',
    output_path: '/thumbnails/wikipedia.jpg',
  },

  // ── Tier 2 ─────────────────────────────────────────────────────────────────

  {
    slug: 'mosaic', tier: 2, preferred_year: 1993,
    canonical_url: 'http://www.ncsa.uiuc.edu/',
    wikipedia: 'Mosaic_(web_browser)',
    output_path: '/thumbnails/mosaic.jpg',
  },
  {
    slug: 'internet-explorer', tier: 2, preferred_year: 1998,
    canonical_url: 'http://www.microsoft.com/windows/ie/',
    wikipedia: 'Internet_Explorer',
    output_path: '/thumbnails/internet-explorer.jpg',
  },
  {
    slug: 'firefox', tier: 2, preferred_year: 2004,
    canonical_url: 'http://www.mozilla.org/products/firefox/',
    wikipedia: 'Firefox',
    output_path: '/thumbnails/firefox.jpg',
  },
  {
    slug: 'chrome', tier: 2, preferred_year: 2008,
    canonical_url: 'http://www.google.com/chrome/',
    wikipedia: 'Google_Chrome',
    output_path: '/thumbnails/chrome.jpg',
  },
  {
    slug: 'yahoo', tier: 2, preferred_year: 1998,
    canonical_url: 'http://www.yahoo.com/',
    wikipedia: 'Yahoo!',
    waybackUrl: 'https://web.archive.org/web/19961017235908/http://www.yahoo.com/',
    output_path: '/thumbnails/yahoo.jpg',
  },
  {
    slug: 'altavista', tier: 2, preferred_year: 1998,
    canonical_url: 'http://www.altavista.com/',
    wikipedia: 'AltaVista',
    waybackUrl: 'https://web.archive.org/web/19961017042033/http://www.altavista.digital.com/',
    output_path: '/thumbnails/altavista.jpg',
  },
  {
    slug: 'slashdot', tier: 2, preferred_year: 2000,
    canonical_url: 'http://slashdot.org/',
    wikipedia: 'Slashdot',
    waybackUrl: 'https://web.archive.org/web/20000101000000/http://slashdot.org/',
    output_path: '/thumbnails/slashdot.jpg',
  },
  {
    slug: 'digg', tier: 2, preferred_year: 2006,
    canonical_url: 'http://digg.com/',
    wikipedia: 'Digg',
    waybackUrl: 'https://web.archive.org/web/20060101000000/http://digg.com/',
    output_path: '/thumbnails/digg.jpg',
  },
  {
    slug: 'livejournal', tier: 2, preferred_year: 2003,
    canonical_url: 'http://www.livejournal.com/',
    wikipedia: 'LiveJournal',
    waybackUrl: 'https://web.archive.org/web/20030101000000/http://www.livejournal.com/',
    output_path: '/thumbnails/livejournal.jpg',
  },
  {
    slug: 'wordpress', tier: 2, preferred_year: 2005,
    canonical_url: 'http://wordpress.org/',
    wikipedia: 'WordPress',
    output_path: '/thumbnails/wordpress.jpg',
  },
  {
    slug: 'tumblr', tier: 2, preferred_year: 2009,
    canonical_url: 'http://www.tumblr.com/',
    wikipedia: 'Tumblr',
    output_path: '/thumbnails/tumblr.jpg',
  },
  {
    slug: 'aol-instant-messenger', tier: 2, preferred_year: 2001,
    canonical_url: 'http://www.aim.com/',
    wikipedia: 'AIM_(software)',
    output_path: '/thumbnails/aol-instant-messenger.jpg',
  },
  {
    slug: 'msn-messenger', tier: 2, preferred_year: 2003,
    canonical_url: 'http://messenger.msn.com/',
    wikipedia: 'Windows_Live_Messenger',
    output_path: '/thumbnails/msn-messenger.jpg',
  },
  {
    slug: 'skype', tier: 2, preferred_year: 2005,
    canonical_url: 'http://www.skype.com/',
    wikipedia: 'Skype',
    output_path: '/thumbnails/skype.jpg',
  },
  {
    slug: 'discord', tier: 2, preferred_year: 2017,
    canonical_url: 'http://discord.com/',
    wikipedia: 'Discord',
    output_path: '/thumbnails/discord.jpg',
  },
  {
    slug: 'napster', tier: 1, preferred_year: 2000,
    canonical_url: 'http://www.napster.com/',
    wikipedia: 'Napster',
    output_path: '/thumbnails/napster.jpg',
  },
  {
    slug: 'limewire', tier: 2, preferred_year: 2003,
    canonical_url: 'http://www.limewire.com/',
    wikipedia: 'LimeWire',
    output_path: '/thumbnails/limewire.jpg',
  },
  {
    slug: 'bittorrent', tier: 2, preferred_year: 2004,
    canonical_url: 'http://www.bittorrent.com/',
    wikipedia: 'BitTorrent',
    output_path: '/thumbnails/bittorrent.jpg',
  },
  {
    slug: 'the-pirate-bay', tier: 2, preferred_year: 2006,
    canonical_url: 'http://thepiratebay.org/',
    wikipedia: 'The_Pirate_Bay',
    output_path: '/thumbnails/the-pirate-bay.jpg',
  },
  {
    slug: 'winamp', tier: 2, preferred_year: 2000,
    canonical_url: 'http://www.winamp.com/',
    wikipedia: 'Winamp',
    output_path: '/thumbnails/winamp.jpg',
  },
  {
    slug: 'spotify', tier: 2, preferred_year: 2009,
    canonical_url: 'http://www.spotify.com/',
    wikipedia: 'Spotify',
    output_path: '/thumbnails/spotify.jpg',
  },
  {
    slug: 'something-awful', tier: 2, preferred_year: 2004,
    canonical_url: 'http://www.somethingawful.com/',
    wikipedia: 'Something_Awful',
    output_path: '/thumbnails/something-awful.jpg',
  },
  {
    slug: 'macromedia-flash', tier: 2, preferred_year: 2002,
    canonical_url: 'http://www.macromedia.com/software/flash/',
    wikipedia: 'Adobe_Flash',
    output_path: '/thumbnails/macromedia-flash.jpg',
  },
  {
    slug: 'adobe-flash', tier: 2, preferred_year: 2008,
    canonical_url: 'http://www.adobe.com/products/flashplayer/',
    wikipedia: 'Adobe_Flash',
    output_path: '/thumbnails/adobe-flash.jpg',
  },
  {
    slug: 'homestar-runner', tier: 2, preferred_year: 2004,
    canonical_url: 'http://www.homestarrunner.com/',
    wikipedia: 'Homestar_Runner',
    waybackUrl: 'https://web.archive.org/web/20040101000000/http://www.homestarrunner.com/',
    output_path: '/thumbnails/homestar-runner.jpg',
  },
  {
    slug: 'friendster', tier: 2, preferred_year: 2004,
    canonical_url: 'http://www.friendster.com/',
    wikipedia: 'Friendster',
    waybackUrl: 'https://web.archive.org/web/20040101000000/http://www.friendster.com/',
    output_path: '/thumbnails/friendster.jpg',
  },
  {
    slug: 'twitter', tier: 2, preferred_year: 2008,
    canonical_url: 'http://twitter.com/',
    wikipedia: 'Twitter',
    waybackUrl: 'https://web.archive.org/web/20080101000000/http://twitter.com/',
    output_path: '/thumbnails/twitter.jpg',
  },
  {
    slug: 'instagram', tier: 2, preferred_year: 2013,
    canonical_url: 'http://instagram.com/',
    wikipedia: 'Instagram',
    output_path: '/thumbnails/instagram.jpg',
  },
  {
    slug: '4chan', tier: 2, preferred_year: 2007,
    canonical_url: 'http://www.4chan.org/',
    wikipedia: '4chan',
    waybackUrl: 'https://web.archive.org/web/20070101000000/http://www.4chan.org/',
    output_path: '/thumbnails/4chan.jpg',
  },
  {
    slug: 'deviantart', tier: 2, preferred_year: 2005,
    canonical_url: 'http://www.deviantart.com/',
    wikipedia: 'DeviantArt',
    output_path: '/thumbnails/deviantart.jpg',
  },
  {
    slug: 'ebay', tier: 2, preferred_year: 2001,
    canonical_url: 'http://www.ebay.com/',
    wikipedia: 'EBay',
    waybackUrl: 'https://web.archive.org/web/20010101000000/http://www.ebay.com/',
    output_path: '/thumbnails/ebay.jpg',
  },
  {
    slug: 'craigslist', tier: 2, preferred_year: 2003,
    canonical_url: 'http://www.craigslist.org/',
    wikipedia: 'Craigslist',
    output_path: '/thumbnails/craigslist.jpg',
  },
  {
    slug: 'paypal', tier: 2, preferred_year: 2002,
    canonical_url: 'http://www.paypal.com/',
    wikipedia: 'PayPal',
    output_path: '/thumbnails/paypal.jpg',
  },
  {
    slug: 'internet-archive', tier: 2, preferred_year: 2002,
    canonical_url: 'http://www.archive.org/',
    wikipedia: 'Internet_Archive',
    waybackUrl: 'https://web.archive.org/web/20020101000000/http://www.archive.org/',
    output_path: '/thumbnails/internet-archive.jpg',
  },
  {
    slug: 'wayback-machine', tier: 2, preferred_year: 2002,
    canonical_url: 'http://web.archive.org/',
    wikipedia: 'Wayback_Machine',
    output_path: '/thumbnails/wayback-machine.jpg',
  },
  {
    slug: 'know-your-meme', tier: 2, preferred_year: 2012,
    canonical_url: 'http://knowyourmeme.com/',
    wikipedia: 'Know_Your_Meme',
    output_path: '/thumbnails/know-your-meme.jpg',
  },
  {
    slug: 'lunarstorm', tier: 2, preferred_year: 2002,
    canonical_url: 'http://www.lunarstorm.se/',
    wikipedia: 'LunarStorm',
    output_path: '/thumbnails/lunarstorm.jpg',
  },
  {
    slug: 'ytmnd', tier: 2, preferred_year: 2005,
    canonical_url: 'http://ytmnd.com/',
    wikipedia: 'YTMND',
    output_path: '/thumbnails/ytmnd.jpg',
  },
  {
    slug: 'tiktok', tier: 2, preferred_year: 2020,
    canonical_url: 'http://www.tiktok.com/',
    wikipedia: 'TikTok',
    output_path: '/thumbnails/tiktok.jpg',
  },
  {
    slug: 'lolcats', tier: 2, preferred_year: 2007,
    canonical_url: 'http://icanhas.cheezburger.com/',
    wikipedia: 'I_Can_Has_Cheezburger%3F',
    output_path: '/thumbnails/lolcats.jpg',
  },
  {
    slug: 'stumbleupon', tier: 2, preferred_year: 2006,
    canonical_url: 'http://www.stumbleupon.com/',
    wikipedia: 'StumbleUpon',
    output_path: '/thumbnails/stumbleupon.jpg',
  },
  {
    slug: 'ask-jeeves', tier: 2, preferred_year: 1999,
    canonical_url: 'http://www.askjeeves.com/',
    wikipedia: 'Ask.com',
    output_path: '/thumbnails/ask-jeeves.jpg',
  },
  {
    slug: 'yahoo-directory', tier: 2, preferred_year: 1998,
    canonical_url: 'http://dir.yahoo.com/',
    wikipedia: 'Yahoo!_Directory',
    output_path: '/thumbnails/yahoo-directory.jpg',
  },
  {
    slug: 'hamster-dance', tier: 2, preferred_year: 1999,
    canonical_url: 'http://www.hamsterdance.com/',
    wikipedia: 'Hampster_Dance',
    output_path: '/thumbnails/hamster-dance.jpg',
  },
];

// Deduplicate by slug (napster appeared twice in target list above)
const seen = new Set<string>();
export const THUMBNAIL_TARGETS_DEDUPED = THUMBNAIL_TARGETS.filter(t => {
  if (seen.has(t.slug)) return false;
  seen.add(t.slug);
  return true;
});
