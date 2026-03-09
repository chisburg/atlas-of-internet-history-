/**
 * Atlas v2 world hierarchy.
 *
 * Four exploration levels:
 *   World  → Territory (5–8 on screen)
 *   Place  → Landmark  (4–7 per territory)
 *   Artifact → centered portal
 *   Ecosystem → cultural nodes around artifact
 *
 * Angles use screen coordinates: 0 = right, 90 = down, 180 = left, 270 = up.
 * Earlier influences → left (180–240°)
 * What came next    → right (0–60°)
 * Parallel ideas    → above/beside (270–315° or 45–90°)
 * Cultural practices → close, distance ~0.9
 * Strange jumps      → farther, distance ~1.3
 */

export interface EcosystemNode {
  id: string;
  label: string;
  /** degrees, screen convention: 0=right 90=down 180=left 270=up */
  angle: number;
  /** 1.0 = standard orbit, higher = farther out */
  distance: number;
  relation: 'before' | 'after' | 'sideways' | 'culture' | 'strange';
  /** true if matches an artifact slug in seed.ts and can be navigated into */
  navigable: boolean;
}

export interface Place {
  /** matches an artifact slug in seed.ts */
  slug: string;
  label: string;
  year: number;
  ecosystem: EcosystemNode[];
}

export interface Territory {
  id: string;
  label: string;
  sublabel: string;
  /** year when this territory first appears on the world map */
  startYear: number;
  /** CSS color for borders and accents */
  color: string;
  /** darker background tint */
  bg: string;
  places: Place[];
}

export const WORLD: Territory[] = [
  // ─── EARLY WEB ────────────────────────────────────────────────────────────
  {
    id: 'early-web',
    label: 'Early Web',
    sublabel: 'The first corner of the internet',
    startYear: 1991,
    color: '#3b82f6',
    bg: '#0c1628',
    places: [
      {
        slug: 'early-web',
        label: 'Early Web',
        year: 1991,
        ecosystem: [
          { id: 'aol',          label: 'AOL',             angle: 80,  distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'geocities',    label: 'GeoCities',       angle: 20,  distance: 1.05, relation: 'after',    navigable: true },
          { id: 'google',       label: 'Google',          angle: 340, distance: 1.2,  relation: 'after',    navigable: true },
          { id: 'archive-org',  label: 'Wayback Machine', angle: 210, distance: 1.3,  relation: 'strange',  navigable: true },
          { id: 'html',         label: 'HTML Pages',      angle: 270, distance: 0.9,  relation: 'culture',  navigable: false },
          { id: 'hyperlinks',   label: 'Hyperlinks',      angle: 305, distance: 0.85, relation: 'culture',  navigable: false },
        ],
      },
      {
        slug: 'geocities',
        label: 'GeoCities',
        year: 1994,
        ecosystem: [
          { id: 'personal-homepages', label: 'Personal Homepages', angle: 260, distance: 1.05, relation: 'sideways', navigable: true },
          { id: 'archive-org',        label: 'Internet Archive',   angle: 185, distance: 1.35, relation: 'strange',  navigable: true },
          { id: 'web-rings',          label: 'Web Rings',          angle: 40,  distance: 0.9,  relation: 'culture',  navigable: false },
          { id: 'guestbooks',         label: 'Guestbooks',         angle: 110, distance: 0.85, relation: 'culture',  navigable: false },
          { id: 'hit-counters',       label: 'Hit Counters',       angle: 155, distance: 0.9,  relation: 'culture',  navigable: false },
          { id: 'under-construction', label: '🚧 Under Construction', angle: 325, distance: 0.95, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'personal-homepages',
        label: 'Personal Homepages',
        year: 1993,
        ecosystem: [
          { id: 'geocities', label: 'GeoCities', angle: 255,  distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'blogs',     label: 'Blogs',     angle: 10,   distance: 1.05, relation: 'after',   navigable: true },
          { id: 'myspace',   label: 'MySpace',   angle: 55,   distance: 1.15, relation: 'after',   navigable: true },
          { id: 'fan-pages',    label: 'Fan Pages',                angle: 135, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'midi',         label: 'MIDI Background Music',    angle: 215, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'marquee',      label: 'Marquee & Blink Tags',     angle: 300, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'aol',
        label: 'AOL',
        year: 1991,
        ecosystem: [
          { id: 'aim',       label: 'AIM',       angle: 10,  distance: 1.05, relation: 'after',   navigable: true },
          { id: 'irc',       label: 'IRC',        angle: 200, distance: 1.2,  relation: 'before',  navigable: true },
          { id: 'early-web', label: 'Open Web',   angle: 270, distance: 1.1,  relation: 'sideways',navigable: true },
          { id: 'aol-cds',  label: 'CDs in the Mail', angle: 90,  distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'youve-got-mail', label: '"You\'ve Got Mail"', angle: 145, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'walled-garden',  label: 'Walled Garden',     angle: 330, distance: 1.0,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'mozilla',
        label: 'Mozilla Firefox',
        year: 2002,
        ecosystem: [
          { id: 'google',    label: 'Google',         angle: 10,  distance: 1.05, relation: 'sideways', navigable: true },
          { id: 'flash',     label: 'Flash',          angle: 185, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'early-web', label: 'Netscape Era',   angle: 250, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'tabs',           label: 'Tabbed Browsing',  angle: 60,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'extensions',     label: 'Extensions',       angle: 120, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'open-standards', label: 'Open Standards',   angle: 310, distance: 1.0,  relation: 'culture', navigable: false },
        ],
      },
    ],
  },

  // ─── MESSAGING & CHAT ─────────────────────────────────────────────────────
  {
    id: 'messaging',
    label: 'Messaging & Chat',
    sublabel: 'How we found each other online',
    startYear: 1988,
    color: '#10b981',
    bg: '#061a0f',
    places: [
      {
        slug: 'bbs',
        label: 'Bulletin Board Systems',
        year: 1978,
        ecosystem: [
          { id: 'irc',           label: 'IRC',            angle: 10,  distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'something-awful',label: 'Something Awful', angle: 55, distance: 1.1, relation: 'after',    navigable: true },
          { id: 'imdb',          label: 'IMDb',           angle: 295, distance: 1.3,  relation: 'strange',  navigable: true },
          { id: 'usenet',    label: 'Usenet',     angle: 265, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'sysops',    label: 'Sysops',     angle: 175, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'door-games', label: 'Door Games', angle: 230, distance: 0.9, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'irc',
        label: 'IRC',
        year: 1988,
        ecosystem: [
          { id: 'bbs',     label: 'BBS',     angle: 255, distance: 1.0,  relation: 'before', navigable: true },
          { id: 'aim',     label: 'AIM',     angle: 10,  distance: 1.05, relation: 'after',  navigable: true },
          { id: 'discord', label: 'Discord', angle: 45,  distance: 1.2,  relation: 'after',  navigable: true },
          { id: 'channels',  label: '#channels',     angle: 120, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'bots',      label: 'IRC Bots',      angle: 200, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'mirc',      label: 'mIRC Client',   angle: 305, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'icq',
        label: 'ICQ',
        year: 1996,
        ecosystem: [
          { id: 'irc',  label: 'IRC',  angle: 215, distance: 1.1,  relation: 'before', navigable: true },
          { id: 'aim',  label: 'AIM',  angle: 10,  distance: 1.0,  relation: 'after',  navigable: true },
          { id: 'bbs',  label: 'BBS',  angle: 240, distance: 1.2,  relation: 'before', navigable: true },
          { id: 'uin',       label: 'UIN Numbers',    angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'uh-oh',     label: '"Uh Oh!" Sound', angle: 150, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'flower',    label: 'The Flower Icon', angle: 335, distance: 0.85, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'aim',
        label: 'AIM',
        year: 1997,
        ecosystem: [
          { id: 'icq',      label: 'ICQ',      angle: 205, distance: 1.0,  relation: 'before',   navigable: true },
          { id: 'facebook', label: 'Facebook', angle: 30,  distance: 1.1,  relation: 'after',    navigable: true },
          { id: 'myspace',  label: 'MySpace',  angle: 330, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'away-msgs',   label: 'Away Messages', angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'buddy-list',  label: 'Buddy Lists',   angle: 145, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'door-slam',   label: 'Door Slam Sound', angle: 255, distance: 0.9, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'discord',
        label: 'Discord',
        year: 2015,
        ecosystem: [
          { id: 'irc',    label: 'IRC',    angle: 205, distance: 1.1,  relation: 'before',  navigable: true },
          { id: 'reddit', label: 'Reddit', angle: 265, distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'youtube',label: 'YouTube', angle: 335, distance: 1.1, relation: 'sideways', navigable: true },
          { id: 'servers',   label: 'Servers & Channels', angle: 55,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'nitro',     label: 'Discord Nitro',      angle: 115, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'bot-economy', label: 'Bot Economy',      angle: 10,  distance: 1.0,  relation: 'culture', navigable: false },
        ],
      },
    ],
  },

  // ─── KNOWLEDGE & COMMERCE ─────────────────────────────────────────────────
  {
    id: 'knowledge',
    label: 'Knowledge & Commerce',
    sublabel: 'Finding things and trading with strangers',
    startYear: 1994,
    color: '#8b5cf6',
    bg: '#0f0a1e',
    places: [
      {
        slug: 'google',
        label: 'Google',
        year: 1998,
        ecosystem: [
          { id: 'wikipedia', label: 'Wikipedia', angle: 30,  distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'early-web', label: 'Early Web', angle: 200, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'mozilla',   label: 'Firefox',   angle: 270, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'pagerank',      label: 'PageRank',          angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'feeling-lucky', label: '"I\'m Feeling Lucky"', angle: 145, distance: 0.9, relation: 'culture', navigable: false },
          { id: 'altavista-era', label: 'AltaVista Era',     angle: 335, distance: 1.0,  relation: 'before',  navigable: false },
        ],
      },
      {
        slug: 'wikipedia',
        label: 'Wikipedia',
        year: 2001,
        ecosystem: [
          { id: 'google', label: 'Google', angle: 210, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'imdb',   label: 'IMDb',   angle: 255, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'reddit', label: 'Reddit', angle: 335, distance: 1.1,  relation: 'sideways', navigable: true },
          { id: 'edit-wars',   label: 'Edit Wars',        angle: 55,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'talk-pages',  label: 'Talk Pages',       angle: 115, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'citation',    label: '[citation needed]', angle: 20,  distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'archive-org',
        label: 'Internet Archive',
        year: 1996,
        ecosystem: [
          { id: 'geocities', label: 'GeoCities', angle: 305, distance: 1.2,  relation: 'strange',  navigable: true },
          { id: 'early-web', label: 'Early Web', angle: 260, distance: 1.1,  relation: 'strange',  navigable: true },
          { id: 'wikipedia', label: 'Wikipedia', angle: 335, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'wayback',     label: 'Wayback Machine', angle: 55,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'dig-memory',  label: 'Digital Memory',  angle: 115, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'link-rot',    label: 'Link Rot',         angle: 210, distance: 1.0,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'ebay',
        label: 'eBay',
        year: 1995,
        ecosystem: [
          { id: 'early-web',  label: 'Early Web',  angle: 200, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'craigslist', label: 'Craigslist', angle: 335, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'google',     label: 'Google',     angle: 30,  distance: 1.1,  relation: 'sideways', navigable: true },
          { id: 'seller-ratings', label: 'Seller Ratings',  angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'auctions',       label: 'Online Auctions', angle: 145, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'paypal',         label: 'PayPal',          angle: 270, distance: 0.9,  relation: 'after',   navigable: false },
        ],
      },
      {
        slug: 'imdb',
        label: 'IMDb',
        year: 1990,
        ecosystem: [
          { id: 'bbs',       label: 'BBS / Usenet', angle: 220, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'wikipedia', label: 'Wikipedia',    angle: 10,  distance: 1.1,  relation: 'after',    navigable: true },
          { id: 'google',    label: 'Google',       angle: 315, distance: 1.1,  relation: 'sideways', navigable: true },
          { id: 'user-ratings', label: 'User Ratings',   angle: 55,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'trivia',       label: 'Trivia & Goofs', angle: 115, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'top250',       label: 'Top 250',         angle: 175, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
    ],
  },

  // ─── CREATIVE UNDERGROUND ─────────────────────────────────────────────────
  {
    id: 'creative',
    label: 'Creative Underground',
    sublabel: 'Flash, animations, and wild expression',
    startYear: 1995,
    color: '#f59e0b',
    bg: '#1a0d00',
    places: [
      {
        slug: 'flash',
        label: 'Adobe Flash',
        year: 1996,
        ecosystem: [
          { id: 'newgrounds',     label: 'Newgrounds',      angle: 30,  distance: 1.0,  relation: 'after',    navigable: true },
          { id: 'homestar-runner',label: 'Homestar Runner', angle: 335, distance: 1.05, relation: 'sideways', navigable: true },
          { id: 'winamp',         label: 'Winamp',          angle: 185, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'youtube',        label: 'YouTube',         angle: 60,  distance: 1.2,  relation: 'after',    navigable: true },
          { id: 'loading-bar',    label: 'The Loading Bar', angle: 240, distance: 0.9,  relation: 'culture',  navigable: false },
          { id: 'browser-games',  label: 'Browser Games',  angle: 148, distance: 0.85, relation: 'culture',  navigable: false },
        ],
      },
      {
        slug: 'newgrounds',
        label: 'Newgrounds',
        year: 1995,
        ecosystem: [
          { id: 'flash',          label: 'Adobe Flash',    angle: 200, distance: 1.0,  relation: 'before',   navigable: true },
          { id: 'homestar-runner',label: 'Homestar Runner', angle: 318, distance: 1.05, relation: 'sideways', navigable: true },
          { id: 'deviantart',     label: 'DeviantArt',     angle: 265, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'youtube',        label: 'YouTube',        angle: 30,  distance: 1.1,  relation: 'after',    navigable: true },
          { id: 'blam',         label: 'Blam & Protect', angle: 118, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'tom-fulp',     label: 'Tom Fulp',       angle: 160, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'homestar-runner',
        label: 'Homestar Runner',
        year: 2000,
        ecosystem: [
          { id: 'flash',      label: 'Flash',      angle: 195, distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'newgrounds', label: 'Newgrounds', angle: 230, distance: 1.0,  relation: 'sideways',navigable: true },
          { id: 'youtube',    label: 'YouTube',    angle: 15,  distance: 1.15, relation: 'after',   navigable: true },
          { id: 'strong-bad',   label: 'Strong Bad Emails', angle: 75,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'trogdor',      label: 'Trogdor!',           angle: 130, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'teen-girl',    label: 'Teen Girl Squad',    angle: 295, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'deviantart',
        label: 'DeviantArt',
        year: 2000,
        ecosystem: [
          { id: 'newgrounds',label: 'Newgrounds', angle: 200, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'tumblr',    label: 'Tumblr',    angle: 30,  distance: 1.1,  relation: 'after',    navigable: true },
          { id: 'geocities', label: 'GeoCities', angle: 250, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'fan-art',      label: 'Fan Art',       angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'deviations',   label: 'Deviations',    angle: 148, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'llama-badges', label: 'Llama Badges',  angle: 335, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'napster',
        label: 'Napster',
        year: 1999,
        ecosystem: [
          { id: 'limewire',   label: 'LimeWire',   angle: 30,  distance: 1.0,  relation: 'after',    navigable: true },
          { id: 'winamp',     label: 'Winamp',     angle: 335, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'bittorrent', label: 'BitTorrent', angle: 60,  distance: 1.1,  relation: 'after',    navigable: true },
          { id: 'mp3',        label: 'MP3 Files',      angle: 270, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'riaa',       label: 'Lawsuits & RIAA', angle: 145, distance: 1.0, relation: 'culture', navigable: false },
          { id: 'dial-up-dl', label: 'Dial-Up Downloads',angle: 220, distance: 0.9, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'winamp',
        label: 'Winamp',
        year: 1997,
        ecosystem: [
          { id: 'napster', label: 'Napster', angle: 265, distance: 1.0,  relation: 'before',   navigable: true },
          { id: 'flash',   label: 'Flash',   angle: 185, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'youtube', label: 'YouTube', angle: 30,  distance: 1.2,  relation: 'after',    navigable: true },
          { id: 'skins',    label: 'Winamp Skins',       angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'llama',    label: '"Whips the Llama\'s Ass"', angle: 148, distance: 0.9, relation: 'culture', navigable: false },
          { id: 'playlist', label: 'Playlist Culture',   angle: 335, distance: 0.85, relation: 'culture', navigable: false },
        ],
      },
    ],
  },

  // ─── FORUMS & SUBCULTURE ──────────────────────────────────────────────────
  {
    id: 'subculture',
    label: 'Forums & Subculture',
    sublabel: 'Where internet culture was forged',
    startYear: 1997,
    color: '#ef4444',
    bg: '#1a0000',
    places: [
      {
        slug: 'slashdot',
        label: 'Slashdot',
        year: 1997,
        ecosystem: [
          { id: 'bbs',  label: 'BBS',  angle: 200, distance: 1.1, relation: 'before',  navigable: true },
          { id: 'irc',  label: 'IRC',  angle: 230, distance: 1.0, relation: 'sideways',navigable: true },
          { id: 'digg', label: 'Digg', angle: 10,  distance: 1.0, relation: 'after',   navigable: true },
          { id: 'slashdot-effect', label: 'The Slashdot Effect', angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'karma',           label: 'Karma System',        angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'news-for-nerds',  label: 'News for Nerds',      angle: 322, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'something-awful',
        label: 'Something Awful',
        year: 1999,
        ecosystem: [
          { id: 'bbs',    label: 'BBS',    angle: 210, distance: 1.1,  relation: 'before', navigable: true },
          { id: '4chan',  label: '4chan',   angle: 30,  distance: 1.0,  relation: 'after',  navigable: true },
          { id: 'reddit', label: 'Reddit', angle: 60,  distance: 1.1,  relation: 'after',  navigable: true },
          { id: 'goons',      label: 'Goons',      angle: 118, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'fyad',       label: 'FYAD',       angle: 180, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'lets-plays', label: "Let's Plays", angle: 300, distance: 1.0, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: '4chan',
        label: '4chan',
        year: 2003,
        ecosystem: [
          { id: 'something-awful',label: 'Something Awful', angle: 210, distance: 1.0, relation: 'before',  navigable: true },
          { id: 'memes',          label: 'Internet Memes',  angle: 30,  distance: 1.0, relation: 'after',   navigable: true },
          { id: 'reddit',         label: 'Reddit',          angle: 335, distance: 1.0, relation: 'sideways',navigable: true },
          { id: 'anon',      label: 'Anonymous Culture',angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'greentext', label: 'Greentext Stories', angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'raids',     label: 'Internet Raids',    angle: 265, distance: 1.0,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'reddit',
        label: 'Reddit',
        year: 2005,
        ecosystem: [
          { id: 'something-awful',label: 'Something Awful', angle: 220, distance: 1.1,  relation: 'before',  navigable: true },
          { id: 'digg',           label: 'Digg',            angle: 250, distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'discord',        label: 'Discord',         angle: 30,  distance: 1.1,  relation: 'after',   navigable: true },
          { id: 'subreddits', label: 'Subreddits',    angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'ama',        label: 'AMAs',           angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'upvotes',    label: 'Karma & Upvotes',angle: 330, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'memes',
        label: 'Internet Memes',
        year: 1996,
        ecosystem: [
          { id: 'flash',   label: 'Flash Animations', angle: 240, distance: 1.1,  relation: 'before',  navigable: true },
          { id: '4chan',   label: '4chan',             angle: 200, distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'twitter', label: 'Twitter',          angle: 10,  distance: 1.1,  relation: 'after',   navigable: true },
          { id: 'tumblr',  label: 'Tumblr',           angle: 40,  distance: 1.0,  relation: 'sideways',navigable: true },
          { id: 'dancing-baby',  label: 'Dancing Baby (1996)', angle: 270, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'image-macros',  label: 'Image Macros',        angle: 118, distance: 0.85, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'digg',
        label: 'Digg',
        year: 2004,
        ecosystem: [
          { id: 'slashdot', label: 'Slashdot', angle: 200, distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'reddit',   label: 'Reddit',   angle: 30,  distance: 1.0,  relation: 'after',   navigable: true },
          { id: 'twitter',  label: 'Twitter',  angle: 335, distance: 1.1,  relation: 'sideways',navigable: true },
          { id: 'digg-v4',    label: 'The Digg v4 Collapse', angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'dem-voting', label: 'Democratic Voting',    angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'getting-dugg',label: '"Getting Dugg"',      angle: 270, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
    ],
  },

  // ─── SOCIAL WEB ───────────────────────────────────────────────────────────
  {
    id: 'social',
    label: 'Social Web',
    sublabel: 'Identity, connection, and performance',
    startYear: 2002,
    color: '#60a5fa',
    bg: '#061228',
    places: [
      {
        slug: 'friendster',
        label: 'Friendster',
        year: 2002,
        ecosystem: [
          { id: 'personal-homepages', label: 'Personal Homepages', angle: 230, distance: 1.1,  relation: 'before', navigable: true },
          { id: 'myspace',            label: 'MySpace',            angle: 30,  distance: 1.0,  relation: 'after',  navigable: true },
          { id: 'facebook',           label: 'Facebook',           angle: 60,  distance: 1.15, relation: 'after',  navigable: true },
          { id: 'social-graph',  label: 'The Social Graph', angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'testimonials',  label: 'Testimonials',     angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'fakesters',     label: 'Fakesters',        angle: 315, distance: 1.0,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'myspace',
        label: 'MySpace',
        year: 2003,
        ecosystem: [
          { id: 'friendster', label: 'Friendster', angle: 210, distance: 1.0,  relation: 'before',  navigable: true },
          { id: 'facebook',   label: 'Facebook',   angle: 30,  distance: 1.0,  relation: 'after',   navigable: true },
          { id: 'aim',        label: 'AIM',        angle: 305, distance: 1.0,  relation: 'sideways',navigable: true },
          { id: 'top-8',       label: 'The Top 8',             angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'profile-music', label: 'Autoplay Profile Music', angle: 148, distance: 0.9, relation: 'culture', navigable: false },
          { id: 'tom',           label: 'Tom Anderson',          angle: 335, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'facebook',
        label: 'Facebook',
        year: 2004,
        ecosystem: [
          { id: 'myspace',   label: 'MySpace',   angle: 210, distance: 1.0,  relation: 'before',   navigable: true },
          { id: 'instagram', label: 'Instagram', angle: 30,  distance: 1.0,  relation: 'after',    navigable: true },
          { id: 'twitter',   label: 'Twitter',   angle: 335, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'the-wall',  label: 'The Wall',         angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'like-btn',  label: 'The Like Button',  angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'news-feed', label: 'News Feed',         angle: 265, distance: 0.85, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'twitter',
        label: 'Twitter / X',
        year: 2006,
        ecosystem: [
          { id: 'blogs',    label: 'Blogs',    angle: 220, distance: 1.1,  relation: 'before',   navigable: true },
          { id: 'facebook', label: 'Facebook', angle: 200, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'memes',    label: 'Meme Spread', angle: 10,  distance: 1.0, relation: 'sideways', navigable: true },
          { id: 'char-140', label: '140 Characters',angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'hashtags', label: 'Hashtags',       angle: 148, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'retweets', label: 'Retweets',        angle: 330, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'livejournal',
        label: 'LiveJournal',
        year: 1999,
        ecosystem: [
          { id: 'blogs',  label: 'Blogs',  angle: 265, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'aim',    label: 'AIM',    angle: 330, distance: 1.0,  relation: 'sideways', navigable: true },
          { id: 'tumblr', label: 'Tumblr', angle: 30,  distance: 1.1,  relation: 'after',    navigable: true },
          { id: 'friends-list', label: 'Friends List',        angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'mood-icons',   label: 'Mood Icons',          angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'fandom-comm',  label: 'Fandom Communities',  angle: 210, distance: 0.85, relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'tumblr',
        label: 'Tumblr',
        year: 2007,
        ecosystem: [
          { id: 'livejournal', label: 'LiveJournal', angle: 210, distance: 1.0, relation: 'before',   navigable: true },
          { id: 'deviantart',  label: 'DeviantArt',  angle: 240, distance: 1.0, relation: 'before',   navigable: true },
          { id: 'twitter',     label: 'Twitter',     angle: 335, distance: 1.0, relation: 'sideways', navigable: true },
          { id: 'reblogs',     label: 'Reblogs',        angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'aesthetic',   label: 'Aesthetic Tags',  angle: 148, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'fandom-wars', label: 'Fandom Wars',     angle: 30,  distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'blogs',
        label: 'Blogs',
        year: 1999,
        ecosystem: [
          { id: 'personal-homepages', label: 'Personal Homepages', angle: 210, distance: 1.0, relation: 'before',   navigable: true },
          { id: 'livejournal',        label: 'LiveJournal',        angle: 315, distance: 1.0, relation: 'sideways', navigable: true },
          { id: 'twitter',            label: 'Twitter',            angle: 30,  distance: 1.1, relation: 'after',    navigable: true },
          { id: 'blogroll', label: 'The Blogroll',  angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'comments', label: 'Blog Comments', angle: 148, distance: 0.85, relation: 'culture', navigable: false },
          { id: 'rss',      label: 'RSS Feeds',     angle: 260, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
      {
        slug: 'instagram',
        label: 'Instagram',
        year: 2010,
        ecosystem: [
          { id: 'facebook', label: 'Facebook', angle: 200, distance: 1.0, relation: 'before',   navigable: true },
          { id: 'tumblr',   label: 'Tumblr',   angle: 240, distance: 1.0, relation: 'sideways', navigable: true },
          { id: 'youtube',  label: 'YouTube',  angle: 330, distance: 1.0, relation: 'sideways', navigable: true },
          { id: 'filters',     label: 'Photo Filters',angle: 90,  distance: 0.85, relation: 'culture', navigable: false },
          { id: 'influencers', label: 'Influencers',  angle: 30,  distance: 0.9,  relation: 'culture', navigable: false },
          { id: 'stories',     label: 'Stories',       angle: 148, distance: 0.9,  relation: 'culture', navigable: false },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** All places across all territories (flat list) */
export function getAllPlaces(): Place[] {
  return WORLD.flatMap((t) => t.places);
}

/** Territories visible at a given year */
export function getTerritoriesForYear(year: number): Territory[] {
  return WORLD.filter((t) => t.startYear <= year);
}

/** Territory that owns a given place slug */
export function getTerritoryForPlace(slug: string): Territory | undefined {
  return WORLD.find((t) => t.places.some((p) => p.slug === slug));
}

/** Place data for a slug (if curated) */
export function getPlace(slug: string): Place | undefined {
  return getAllPlaces().find((p) => p.slug === slug);
}
