// Visual metadata for atlas nodes — taglines shown on artifact cards at close zoom

export interface NodeVisualMeta {
  tagline: string;
}

export const NODE_VISUAL_META: Record<string, NodeVisualMeta> = {
  // ── Early Web ──────────────────────────────────────────────────────────────
  'world-wide-web':         { tagline: 'The Web Begins' },
  'netscape':               { tagline: 'First Browser' },
  'netscape-navigator':     { tagline: 'First Browser' },
  'internet-explorer':      { tagline: 'Microsoft Browser' },
  'mosaic':                 { tagline: 'Pioneering Browser' },
  'geocities':              { tagline: 'Hosted Homepages' },
  'webrings':               { tagline: 'Web Navigation Rings' },
  'hit-counters':           { tagline: 'Visitor Tracking' },
  'guestbooks':             { tagline: 'Web Guestbooks' },
  'personal-homepages':     { tagline: 'Personal Web Pages' },
  'frames':                 { tagline: 'HTML Frames Era' },
  'html':                   { tagline: 'Markup Language' },
  'css':                    { tagline: 'Web Styling' },
  'javascript':             { tagline: 'Web Scripting' },

  // ── Search ─────────────────────────────────────────────────────────────────
  'google':                 { tagline: 'Search Engine' },
  'yahoo':                  { tagline: 'Web Portal' },
  'altavista':              { tagline: 'Early Search Engine' },
  'ask-jeeves':             { tagline: 'Q&A Search' },
  'excite':                 { tagline: 'Web Directory' },
  'lycos':                  { tagline: 'Early Search' },

  // ── Messaging & Chat ───────────────────────────────────────────────────────
  'icq':                    { tagline: 'Instant Messaging' },
  'aim':                    { tagline: 'AIM Messenger' },
  'aol-instant-messenger':  { tagline: 'AIM Messenger' },
  'msn-messenger':          { tagline: 'MSN Chat' },
  'windows-live-messenger': { tagline: 'Windows Live' },
  'irc':                    { tagline: 'Internet Relay Chat' },
  'aol':                    { tagline: 'AOL Online' },

  // ── Webmail & Commerce ─────────────────────────────────────────────────────
  'hotmail':                { tagline: 'Free Webmail' },
  'gmail':                  { tagline: 'Google Mail' },
  'yahoo-mail':             { tagline: 'Yahoo Webmail' },
  'amazon':                 { tagline: 'E-Commerce' },
  'amazon-com':             { tagline: 'E-Commerce' },
  'ebay':                   { tagline: 'Online Auctions' },
  'craigslist':             { tagline: 'Local Classifieds' },
  'paypal':                 { tagline: 'Online Payments' },

  // ── File Sharing ───────────────────────────────────────────────────────────
  'napster':                { tagline: 'P2P Music Sharing' },
  'limewire':               { tagline: 'Peer-to-Peer' },
  'bittorrent':             { tagline: 'Distributed Downloads' },
  'kazaa':                  { tagline: 'File Sharing' },
  'emule':                  { tagline: 'P2P Network' },
  'gnutella':               { tagline: 'P2P Protocol' },

  // ── Flash / Animation ──────────────────────────────────────────────────────
  'flash':                  { tagline: 'Web Animation' },
  'macromedia-flash':       { tagline: 'Web Animation' },
  'adobe-flash':            { tagline: 'Web Animation' },
  'shockwave':              { tagline: 'Web Media' },
  'newgrounds':             { tagline: 'Flash Games & Art' },
  'homestar-runner':        { tagline: 'Flash Cartoon' },
  'albino-blacksheep':      { tagline: 'Flash Movies' },
  'ebaumsworld':            { tagline: 'Video & Humor' },

  // ── Forums / Anonymous Culture ─────────────────────────────────────────────
  'bbs':                    { tagline: 'Bulletin Boards' },
  'something-awful':        { tagline: 'Comedy Forum' },
  '4chan':                  { tagline: 'Imageboard' },
  'reddit':                 { tagline: 'Link Aggregator' },
  'slashdot':               { tagline: 'Nerd News' },
  'digg':                   { tagline: 'Social News' },
  'hacker-news':            { tagline: 'Startup News' },

  // ── Social Platforms ───────────────────────────────────────────────────────
  'myspace':                { tagline: 'A Place for Friends' },
  'facebook':               { tagline: 'Social Network' },
  'twitter':                { tagline: 'Microblogging' },
  'x':                      { tagline: 'Microblogging' },
  'instagram':              { tagline: 'Photo Sharing' },
  'tumblr':                 { tagline: 'Blogging Platform' },
  'livejournal':            { tagline: 'Online Journals' },
  'friendster':             { tagline: 'Social Pioneer' },
  'discord':                { tagline: 'Voice & Chat' },
  'snapchat':               { tagline: 'Disappearing Photos' },
  'tiktok':                 { tagline: 'Short Video' },
  'vine':                   { tagline: '6-Second Videos' },
  'linkedin':               { tagline: 'Professional Network' },

  // ── Blogging / Publishing ──────────────────────────────────────────────────
  'blogs':                  { tagline: 'Personal Publishing' },
  'blogger':                { tagline: 'Blog Platform' },
  'wordpress':              { tagline: 'CMS Platform' },
  'typepad':                { tagline: 'Blog Hosting' },
  'medium':                 { tagline: 'Writing Platform' },
  'substack':               { tagline: 'Newsletter Platform' },

  // ── Video ──────────────────────────────────────────────────────────────────
  'youtube':                { tagline: 'Broadcast Yourself' },
  'dailymotion':            { tagline: 'Video Sharing' },
  'vimeo':                  { tagline: 'Filmmaker Video' },
  'twitch':                 { tagline: 'Live Streaming' },

  // ── Reference & Archive ────────────────────────────────────────────────────
  'wikipedia':              { tagline: 'Free Encyclopedia' },
  'internet-archive':       { tagline: 'Digital Archive' },
  'wayback-machine':        { tagline: 'Web History' },
  'wikileaks':              { tagline: 'Leaked Documents' },

  // ── Music ──────────────────────────────────────────────────────────────────
  'winamp':                 { tagline: 'MP3 Player' },
  'last-fm':                { tagline: 'Music Discovery' },
  'last.fm':                { tagline: 'Music Discovery' },
  'soundcloud':             { tagline: 'Music Sharing' },
  'spotify':                { tagline: 'Streaming Music' },
  'myspace-music':          { tagline: 'Band Profiles' },

  // ── Creative & Art ─────────────────────────────────────────────────────────
  'deviantart':             { tagline: 'Fan Art Community' },
  'flickr':                 { tagline: 'Photo Sharing' },
  'pinterest':              { tagline: 'Visual Discovery' },
  'dribbble':               { tagline: 'Design Community' },

  // ── Memes & Culture ────────────────────────────────────────────────────────
  'memes':                  { tagline: 'Internet Humor' },
  'ytmnd':                  { tagline: 'Web Culture' },
  'i-can-has-cheezburger':  { tagline: 'LOLcats' },
  'rage-comics':            { tagline: 'Rage Faces' },
  'know-your-meme':         { tagline: 'Meme Database' },
  'lolcats':                { tagline: 'Cat Humor' },

  // ── Tech & Dev ─────────────────────────────────────────────────────────────
  'github':                 { tagline: 'Code Hosting' },
  'stackoverflow':          { tagline: 'Dev Q&A' },
  'sourceforge':            { tagline: 'Open Source Hub' },
};

export function getNodeTagline(slug: string): string {
  return NODE_VISUAL_META[slug]?.tagline ?? '';
}
