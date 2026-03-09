/**
 * Visual identity for ecosystem nodes.
 *
 * Each entry maps a node id to a short symbol/glyph that appears
 * inside the node circle. These evoke the aesthetic of the practice
 * or artifact, not just label it.
 *
 * For nodes without an entry, fallbacks are applied by relation type.
 */

export interface NodeSymbol {
  /** Short glyph — 1-4 chars, rendered inside the node */
  glyph: string;
  /** Optional override label color */
  glyphColor?: string;
  /** If true, renders glyph in monospace font */
  mono?: boolean;
}

export const NODE_SYMBOLS: Record<string, NodeSymbol> = {
  // ── GeoCities ecosystem ──────────────────────────────────────────────────
  'web-rings':          { glyph: '⊕',   glyphColor: '#ff69b4' },
  'guestbooks':         { glyph: '✍',   glyphColor: '#ffd700' },
  'hit-counters':       { glyph: '1337', glyphColor: '#00ffff', mono: true },
  'under-construction': { glyph: '⚠',   glyphColor: '#ff8c00' },
  'fan-pages':          { glyph: '★',   glyphColor: '#ff69b4' },

  // ── Personal Homepages ───────────────────────────────────────────────────
  'midi':               { glyph: '♪',   glyphColor: '#a78bfa' },
  'marquee':            { glyph: '≋',   glyphColor: '#60a5fa' },
  'fan-pages-2':        { glyph: '★',   glyphColor: '#ff69b4' },

  // ── AOL ecosystem ────────────────────────────────────────────────────────
  'aol-cds':            { glyph: '●',   glyphColor: '#a78bfa' },
  'youve-got-mail':     { glyph: '✉',   glyphColor: '#facc15' },
  'walled-garden':      { glyph: '⊡',   glyphColor: '#94a3b8' },

  // ── Mozilla ecosystem ────────────────────────────────────────────────────
  'tabs':               { glyph: '⊟',   glyphColor: '#fb923c' },
  'extensions':         { glyph: '⊞',   glyphColor: '#fb923c' },
  'open-standards':     { glyph: '</>',  glyphColor: '#60a5fa', mono: true },

  // ── BBS ecosystem ────────────────────────────────────────────────────────
  'usenet':             { glyph: '⊹',   glyphColor: '#94a3b8' },
  'sysops':             { glyph: '⌥',   glyphColor: '#60a5fa' },
  'door-games':         { glyph: '⎵',   glyphColor: '#34d399' },

  // ── IRC ecosystem ────────────────────────────────────────────────────────
  'channels':           { glyph: '#',   glyphColor: '#60a5fa', mono: true },
  'bots':               { glyph: '⚙',   glyphColor: '#94a3b8' },
  'mirc':               { glyph: '⌨',   glyphColor: '#60a5fa' },

  // ── ICQ ecosystem ────────────────────────────────────────────────────────
  'uin':                { glyph: '####', glyphColor: '#34d399', mono: true },
  'uh-oh':              { glyph: '!',   glyphColor: '#facc15' },
  'flower':             { glyph: '✿',   glyphColor: '#34d399' },

  // ── AIM ecosystem ────────────────────────────────────────────────────────
  'away-msgs':          { glyph: '»»',  glyphColor: '#34d399', mono: true },
  'buddy-list':         { glyph: '≡',   glyphColor: '#60a5fa' },
  'door-slam':          { glyph: '))',  glyphColor: '#94a3b8', mono: true },

  // ── Discord ecosystem ────────────────────────────────────────────────────
  'servers':            { glyph: '⊟',   glyphColor: '#5865f2' },
  'nitro':              { glyph: '⊕',   glyphColor: '#5865f2' },
  'bot-economy':        { glyph: '⚙',   glyphColor: '#a78bfa' },

  // ── Google ecosystem ─────────────────────────────────────────────────────
  'pagerank':           { glyph: 'PR',  glyphColor: '#60a5fa', mono: true },
  'feeling-lucky':      { glyph: '?',   glyphColor: '#34d399' },
  'altavista-era':      { glyph: '~',   glyphColor: '#94a3b8' },

  // ── Wikipedia ecosystem ──────────────────────────────────────────────────
  'edit-wars':          { glyph: '⚔',   glyphColor: '#ef4444' },
  'talk-pages':         { glyph: '💬',   glyphColor: '#60a5fa' },
  'citation':           { glyph: '[?]', glyphColor: '#94a3b8', mono: true },

  // ── Internet Archive ecosystem ───────────────────────────────────────────
  'wayback':            { glyph: '⊳',   glyphColor: '#a78bfa' },
  'dig-memory':         { glyph: '◎',   glyphColor: '#8b5cf6' },
  'link-rot':           { glyph: '☠',   glyphColor: '#ef4444' },

  // ── eBay ecosystem ───────────────────────────────────────────────────────
  'seller-ratings':     { glyph: '★★★', glyphColor: '#facc15' },
  'auctions':           { glyph: '⬆',   glyphColor: '#60a5fa' },
  'paypal':             { glyph: '$',   glyphColor: '#60a5fa', mono: true },

  // ── IMDb ecosystem ───────────────────────────────────────────────────────
  'user-ratings':       { glyph: '★/10', glyphColor: '#facc15' },
  'trivia':             { glyph: '?!',  glyphColor: '#94a3b8', mono: true },
  'top250':             { glyph: '◈',   glyphColor: '#facc15' },

  // ── Flash ecosystem ──────────────────────────────────────────────────────
  'loading-bar':        { glyph: '▓░',  glyphColor: '#c03a00', mono: true },
  'browser-games':      { glyph: '⎮',   glyphColor: '#34d399' },

  // ── Newgrounds ecosystem ─────────────────────────────────────────────────
  'blam':               { glyph: '⊘',   glyphColor: '#ef4444' },
  'tom-fulp':           { glyph: '◉',   glyphColor: '#3d6600' },

  // ── Homestar Runner ecosystem ────────────────────────────────────────────
  'strong-bad':         { glyph: 'SB',  glyphColor: '#ef4444', mono: true },
  'trogdor':            { glyph: '≋',   glyphColor: '#fb923c' },
  'teen-girl':          { glyph: '☆',   glyphColor: '#f472b6' },

  // ── DeviantArt ecosystem ─────────────────────────────────────────────────
  'fan-art':            { glyph: '✦',   glyphColor: '#67e8f9' },
  'deviations':         { glyph: '◐',   glyphColor: '#00808a' },
  'llama-badges':       { glyph: '🦙',   glyphColor: '#34d399' },

  // ── Napster ecosystem ────────────────────────────────────────────────────
  'mp3':                { glyph: '♫',   glyphColor: '#60a5fa' },
  'riaa':               { glyph: '⚖',   glyphColor: '#ef4444' },
  'dial-up-dl':         { glyph: '≈≈',  glyphColor: '#94a3b8', mono: true },

  // ── Winamp ecosystem ─────────────────────────────────────────────────────
  'skins':              { glyph: '◈',   glyphColor: '#34d399' },
  'llama':              { glyph: '≋',   glyphColor: '#34d399' },
  'playlist':           { glyph: '♬',   glyphColor: '#a78bfa' },

  // ── Slashdot ecosystem ───────────────────────────────────────────────────
  'slashdot-effect':    { glyph: '⚡',   glyphColor: '#facc15' },
  'karma':              { glyph: 'K+',  glyphColor: '#34d399', mono: true },
  'news-for-nerds':     { glyph: '//',  glyphColor: '#3d5200', mono: true },

  // ── Something Awful ecosystem ────────────────────────────────────────────
  'goons':              { glyph: '∫',   glyphColor: '#ef4444' },
  'fyad':               { glyph: 'LOL', glyphColor: '#660000', mono: true },
  'lets-plays':         { glyph: '▶',   glyphColor: '#34d399' },

  // ── 4chan ecosystem ──────────────────────────────────────────────────────
  'anon':               { glyph: '?',   glyphColor: '#2e3d00' },
  'greentext':          { glyph: '>',   glyphColor: '#789922', mono: true },
  'raids':              { glyph: '⚡',   glyphColor: '#ef4444' },

  // ── Reddit ecosystem ─────────────────────────────────────────────────────
  'subreddits':         { glyph: 'r/',  glyphColor: '#ff4500', mono: true },
  'ama':                { glyph: 'AMA', glyphColor: '#ff4500', mono: true },
  'upvotes':            { glyph: '▲',   glyphColor: '#ff4500' },

  // ── Memes ecosystem ──────────────────────────────────────────────────────
  'dancing-baby':       { glyph: '∿',   glyphColor: '#94a3b8' },
  'image-macros':       { glyph: '⊟',   glyphColor: '#94a3b8' },

  // ── Digg ecosystem ───────────────────────────────────────────────────────
  'digg-v4':            { glyph: '†',   glyphColor: '#663300' },
  'dem-voting':         { glyph: '▲',   glyphColor: '#60a5fa' },
  'getting-dugg':       { glyph: '⬆',   glyphColor: '#fb923c' },

  // ── Friendster ecosystem ─────────────────────────────────────────────────
  'social-graph':       { glyph: '⊙',   glyphColor: '#804000' },
  'testimonials':       { glyph: '✍',   glyphColor: '#804000' },
  'fakesters':          { glyph: '?',   glyphColor: '#94a3b8' },

  // ── MySpace ecosystem ────────────────────────────────────────────────────
  'top-8':              { glyph: '#8',  glyphColor: '#11998e', mono: true },
  'profile-music':      { glyph: '♬',   glyphColor: '#a78bfa' },
  'tom':                { glyph: '◎',   glyphColor: '#11998e' },

  // ── Facebook ecosystem ───────────────────────────────────────────────────
  'the-wall':           { glyph: '|',   glyphColor: '#4267b2', mono: true },
  'like-btn':           { glyph: '👍',   glyphColor: '#4267b2' },
  'news-feed':          { glyph: '≡',   glyphColor: '#60a5fa' },

  // ── Twitter ecosystem ────────────────────────────────────────────────────
  'char-140':           { glyph: '140', glyphColor: '#1da1f2', mono: true },
  'hashtags':           { glyph: '#',   glyphColor: '#1da1f2', mono: true },
  'retweets':           { glyph: '↺',   glyphColor: '#17bf63' },

  // ── LiveJournal ecosystem ────────────────────────────────────────────────
  'friends-list':       { glyph: '◉',   glyphColor: '#2e3666' },
  'mood-icons':         { glyph: '◑',   glyphColor: '#a78bfa' },
  'fandom-comm':        { glyph: '♥',   glyphColor: '#f472b6' },

  // ── Tumblr ecosystem ─────────────────────────────────────────────────────
  'reblogs':            { glyph: '↺',   glyphColor: '#35465c' },
  'aesthetic':          { glyph: '✦',   glyphColor: '#a78bfa' },
  'fandom-wars':        { glyph: '⚔',   glyphColor: '#ef4444' },

  // ── Blogs ecosystem ──────────────────────────────────────────────────────
  'blogroll':           { glyph: '⊞',   glyphColor: '#60a5fa' },
  'comments':           { glyph: '💬',   glyphColor: '#94a3b8' },
  'rss':                { glyph: '◉',   glyphColor: '#fb923c' },

  // ── Instagram ecosystem ──────────────────────────────────────────────────
  'filters':            { glyph: '◈',   glyphColor: '#c13584' },
  'influencers':        { glyph: '★',   glyphColor: '#f56040' },
  'stories':            { glyph: '◎',   glyphColor: '#833ab4' },

  // ── Second Life ecosystem ────────────────────────────────────────────────
  'virtual-economy':    { glyph: '$L',  glyphColor: '#0060a0', mono: true },
  'avatars':            { glyph: '◉',   glyphColor: '#004080' },
  'linden-dollars':     { glyph: 'L$',  glyphColor: '#0060a0', mono: true },

  // ── Early Web ecosystem ──────────────────────────────────────────────────
  'html':               { glyph: '</>',  glyphColor: '#60a5fa', mono: true },
  'hyperlinks':         { glyph: '⊕',   glyphColor: '#60a5fa' },
};

/**
 * Fallback glyphs by relation type, for nodes not in NODE_SYMBOLS.
 */
export const RELATION_GLYPHS: Record<string, NodeSymbol> = {
  before:   { glyph: '◁',  glyphColor: '#94a3b8' },
  after:    { glyph: '▷',  glyphColor: '#60a5fa' },
  sideways: { glyph: '◈',  glyphColor: '#a78bfa' },
  culture:  { glyph: '◇',  glyphColor: '#34d399' },
  strange:  { glyph: '⊛',  glyphColor: '#fb923c' },
};

export function getNodeSymbol(
  nodeId: string,
  relation: string,
): NodeSymbol {
  return NODE_SYMBOLS[nodeId] ?? RELATION_GLYPHS[relation] ?? { glyph: '◆', glyphColor: '#94a3b8' };
}
