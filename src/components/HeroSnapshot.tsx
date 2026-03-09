'use client';

import React from 'react';

/**
 * Rich artifact-specific hero visuals for anchor artifacts.
 * Each scene evokes the aesthetic and feel of the original platform.
 * Falls back to gradient for non-anchor artifacts.
 */

export function hasHeroSnapshot(slug: string): boolean {
  return slug in HERO_SCENES;
}

export default function HeroSnapshot({ slug }: { slug: string }) {
  const Scene = HERO_SCENES[slug];
  if (!Scene) return null;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Scene />
    </div>
  );
}

// ─── GeoCities (1994–2009) ───────────────────────────────────────────────────
function GeoCitiesScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gc-tiles" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#000080"/>
          <rect x="0" y="0" width="40" height="40" fill="#000080"/>
          <rect x="40" y="40" width="40" height="40" fill="#000066"/>
        </pattern>
        <pattern id="gc-stars" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <text x="10" y="25" fontSize="14" fill="#FFD700" opacity="0.9">★</text>
          <text x="70" y="60" fontSize="10" fill="#FF69B4" opacity="0.7">✦</text>
          <text x="40" y="100" fontSize="16" fill="#00FFFF" opacity="0.8">★</text>
          <text x="95" y="30" fontSize="8" fill="#FFD700" opacity="0.6">✦</text>
          <text x="20" y="75" fontSize="12" fill="#FF4500" opacity="0.7">★</text>
        </pattern>
      </defs>
      <rect width="800" height="460" fill="url(#gc-tiles)"/>
      <rect width="800" height="460" fill="url(#gc-stars)"/>
      {/* Rainbow horizontal divider bars */}
      <rect x="0" y="100" width="800" height="6" fill="#FF0000" opacity="0.6"/>
      <rect x="0" y="106" width="800" height="6" fill="#FF7F00" opacity="0.6"/>
      <rect x="0" y="112" width="800" height="6" fill="#FFFF00" opacity="0.6"/>
      <rect x="0" y="118" width="800" height="6" fill="#00FF00" opacity="0.6"/>
      <rect x="0" y="124" width="800" height="6" fill="#0000FF" opacity="0.6"/>
      <rect x="0" y="130" width="800" height="6" fill="#8B00FF" opacity="0.6"/>
      {/* Animated GIF-style construction element */}
      <rect x="40" y="160" width="200" height="100" rx="4" fill="#000000" opacity="0.7" stroke="#FFD700" strokeWidth="2"/>
      <text x="140" y="195" fontSize="11" fill="#FFD700" textAnchor="middle" fontFamily="monospace">🚧 UNDER</text>
      <text x="140" y="212" fontSize="11" fill="#FFD700" textAnchor="middle" fontFamily="monospace">CONSTRUCTION</text>
      <text x="140" y="235" fontSize="9" fill="#FF69B4" textAnchor="middle" fontFamily="monospace">[ Back | Home | Links ]</text>
      {/* Hit counter box */}
      <rect x="560" y="160" width="160" height="60" rx="4" fill="#000000" opacity="0.7" stroke="#00FFFF" strokeWidth="1"/>
      <text x="640" y="182" fontSize="9" fill="#00FFFF" textAnchor="middle" fontFamily="monospace">You are visitor</text>
      <text x="640" y="202" fontSize="18" fill="#FFD700" textAnchor="middle" fontFamily="monospace" fontWeight="bold">001,337</text>
      {/* Guestbook / Welcome */}
      <rect x="300" y="155" width="220" height="110" rx="4" fill="#000066" opacity="0.85" stroke="#FF69B4" strokeWidth="1.5"/>
      <text x="410" y="178" fontSize="10" fill="#FF69B4" textAnchor="middle" fontFamily="monospace">✦ WELCOME TO MY PAGE ✦</text>
      <text x="410" y="198" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">Best viewed in Netscape 4.0</text>
      <text x="410" y="216" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">800×600 resolution</text>
      <text x="410" y="236" fontSize="8" fill="#FFFF00" textAnchor="middle" fontFamily="monospace">[ Sign My Guestbook! ]</text>
      {/* Bottom marquee bar */}
      <rect x="0" y="380" width="800" height="22" fill="#FF0000" opacity="0.4"/>
      <text x="400" y="395" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontFamily="monospace">♫ MIDI PLAYING: midi_song_003.mid ♫ &lt;&lt;&lt; This page is always under construction &gt;&gt;&gt;</text>
    </svg>
  );
}

// ─── MySpace (2003–2011) ──────────────────────────────────────────────────────
function MySpaceScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ms-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a0040"/>
          <stop offset="100%" stopColor="#0d0020"/>
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#ms-bg)"/>
      {/* Glitter dots */}
      {[...Array(40)].map((_, i) => (
        <circle key={i} cx={(i * 97 + 23) % 780 + 10} cy={(i * 67 + 31) % 420 + 20}
          r={i % 3 === 0 ? 2 : 1.5} fill={['#FF69B4','#FF1493','#DA70D6','#C71585'][i % 4]} opacity={0.4 + (i % 3) * 0.2}/>
      ))}
      {/* Profile header bar */}
      <rect x="20" y="20" width="760" height="50" rx="6" fill="#2d0060" opacity="0.9"/>
      <text x="40" y="35" fontSize="20" fill="#FF69B4" fontFamily="Impact, sans-serif" fontWeight="bold">MySpace</text>
      <text x="40" y="58" fontSize="10" fill="#DA70D6" fontFamily="Arial, sans-serif">Home | Browse | Search | Invite | Film | Mail | Blog | Favorites | Forum | Groups</text>
      {/* Main profile area */}
      <rect x="20" y="85" width="180" height="220" rx="4" fill="#1a0035" opacity="0.9" stroke="#9400D3" strokeWidth="1"/>
      {/* Profile photo */}
      <rect x="30" y="95" width="160" height="130" rx="3" fill="#2d0060"/>
      <circle cx="110" cy="150" r="45" fill="#3d0080" stroke="#FF69B4" strokeWidth="2"/>
      <text x="110" y="157" fontSize="32" textAnchor="middle" fill="#FF69B4">♥</text>
      <text x="110" y="200" fontSize="9" fill="#DA70D6" textAnchor="middle" fontFamily="Arial, sans-serif">online now!</text>
      <rect x="30" y="230" width="160" height="18" rx="3" fill="#9400D3" opacity="0.8"/>
      <text x="110" y="243" fontSize="9" fill="#FFFFFF" textAnchor="middle" fontFamily="Arial, sans-serif">Send Message | Add Friend</text>
      <text x="110" y="268" fontSize="9" fill="#FF69B4" textAnchor="middle" fontFamily="monospace" fontStyle="italic">"don't read my profile"</text>
      {/* Top 8 */}
      <rect x="215" y="85" width="570" height="220" rx="4" fill="#1a0035" opacity="0.9" stroke="#9400D3" strokeWidth="1"/>
      <text x="235" y="103" fontSize="11" fill="#FF69B4" fontFamily="Arial, sans-serif" fontWeight="bold">Tom's Top 8</text>
      {[0,1,2,3,4,5,6,7].map(i => (
        <g key={i} transform={`translate(${235 + (i % 4) * 130}, ${115 + Math.floor(i/4) * 85})`}>
          <rect width="110" height="70" rx="3" fill="#2d0060"/>
          <rect x="5" y="5" width="100" height="48" rx="2" fill="#3d0080"/>
          <text x="55" y="34" fontSize="20" textAnchor="middle" fill="#9400D3" opacity="0.6">{['♥','★','✦','♫','☆','◆','♠','♣'][i]}</text>
          <text x="55" y="60" fontSize="8" textAnchor="middle" fill="#DA70D6" fontFamily="Arial, sans-serif">{['xXx_scene_xXx','emo_4ever','tom','sk8er_punk','hawthorne','paramore_fan','MCR_<3','fall_out'][i]}</text>
        </g>
      ))}
      {/* Music player bar */}
      <rect x="20" y="320" width="760" height="50" rx="4" fill="#2d0060" opacity="0.95" stroke="#9400D3" strokeWidth="1"/>
      <text x="40" y="339" fontSize="9" fill="#DA70D6" fontFamily="Arial, sans-serif">♫ NOW PLAYING:</text>
      <text x="40" y="355" fontSize="10" fill="#FF69B4" fontFamily="Arial, sans-serif" fontWeight="bold">My Chemical Romance - Welcome to the Black Parade</text>
      <rect x="580" y="332" width="140" height="8" rx="4" fill="#3d0080"/>
      <rect x="580" y="332" width="60" height="8" rx="4" fill="#FF69B4"/>
    </svg>
  );
}

// ─── Napster (1999–2001) ──────────────────────────────────────────────────────
function NapsterScene() {
  const nodes = [
    {x:400, y:230, r:18, label:'YOU'},
    {x:220, y:140, r:12},{x:580, y:140, r:12},{x:160, y:280, r:10},
    {x:640, y:280, r:10},{x:300, y:340, r:11},{x:500, y:340, r:11},
    {x:120, y:180, r:8},{x:680, y:180, r:8},{x:350, y:110, r:9},
    {x:450, y:110, r:9},{x:200, y:360, r:8},{x:600, y:360, r:8},
  ];
  const conns = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[1,9],[2,8],[2,10],[3,11],[4,12],[5,6]];
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nap-bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#001a3d"/>
          <stop offset="100%" stopColor="#000a1a"/>
        </radialGradient>
      </defs>
      <rect width="800" height="460" fill="url(#nap-bg)"/>
      {/* Network edges */}
      {conns.map(([a,b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#00ccff" strokeWidth="0.8" opacity="0.3"/>
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 4} fill="#00ccff" opacity="0.05"/>
          <circle cx={n.x} cy={n.y} r={n.r} fill={i === 0 ? '#0066cc' : '#003366'} stroke="#00ccff" strokeWidth={i===0?2:1} opacity="0.9"/>
          {i===0 && <text x={n.x} y={n.y+4} fontSize="8" fill="#00ccff" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{n.label}</text>}
          {i>0 && <circle cx={n.x} cy={n.y} r="3" fill="#00ccff" opacity="0.6"/>}
        </g>
      ))}
      {/* Song files floating */}
      {[{x:260,y:200,song:'Metallica - Enter Sandman.mp3'},{x:460,y:190,song:'Britney - Toxic.mp3'},{x:310,y:300,song:'Daft Punk - One More Time.mp3'},{x:510,y:295,song:'Eminem - Slim Shady.mp3'}].map((f,i) => (
        <g key={i}>
          <rect x={f.x-5} y={f.y-10} width="10" height="12" rx="1" fill="#00ccff" opacity="0.8"/>
          <text x={f.x+10} y={f.y} fontSize="7.5" fill="#00ccff" fontFamily="monospace" opacity="0.7">{f.song}</text>
        </g>
      ))}
      {/* Napster logo text */}
      <text x="400" y="60" fontSize="42" fill="#00ccff" textAnchor="middle" fontFamily="Impact, sans-serif" opacity="0.15" letterSpacing="4">NAPSTER</text>
      {/* Status bar */}
      <rect x="20" y="400" width="760" height="36" rx="4" fill="#001a3d" opacity="0.9" stroke="#003366" strokeWidth="1"/>
      <text x="40" y="413" fontSize="9" fill="#00ccff" fontFamily="monospace">Status: Connected  |  Users online: 1,348,912  |  Files shared: 847,281,004</text>
      <text x="40" y="428" fontSize="8" fill="#0099cc" fontFamily="monospace">Search results: 1,337 matches for "Metallica" — 847 sources available</text>
    </svg>
  );
}

// ─── Flash (1996–2020) ────────────────────────────────────────────────────────
function FlashScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0500"/>
          <stop offset="50%" stopColor="#3d1000"/>
          <stop offset="100%" stopColor="#7a2000"/>
        </linearGradient>
        <linearGradient id="fl-bar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cc4400"/>
          <stop offset="70%" stopColor="#ff6600"/>
          <stop offset="70%" stopColor="#111"/>
          <stop offset="100%" stopColor="#111"/>
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#fl-bg)"/>
      {/* Grid lines */}
      {[...Array(10)].map((_,i) => <line key={`h${i}`} x1="0" y1={i*50} x2="800" y2={i*50} stroke="#cc4400" strokeWidth="0.3" opacity="0.2"/>)}
      {[...Array(16)].map((_,i) => <line key={`v${i}`} x1={i*55} y1="0" x2={i*55} y2="460" stroke="#cc4400" strokeWidth="0.3" opacity="0.2"/>)}
      {/* Flash Player chrome */}
      <rect x="150" y="60" width="500" height="320" rx="4" fill="#111111" stroke="#444" strokeWidth="1.5"/>
      <rect x="150" y="60" width="500" height="24" rx="4" fill="#222222"/>
      <circle cx="170" cy="72" r="5" fill="#ff5f57"/>
      <circle cx="186" cy="72" r="5" fill="#febc2e"/>
      <circle cx="202" cy="72" r="5" fill="#28c840"/>
      <text x="360" y="76" fontSize="10" fill="#888" textAnchor="middle" fontFamily="monospace">Macromedia Flash Player 8</text>
      {/* Content area — Flash bolt logo */}
      <rect x="150" y="84" width="500" height="282" fill="#000000"/>
      {/* Large Flash bolt */}
      <polygon points="400,130 365,220 395,220 380,330 435,215 403,215 425,130" fill="#ff6600" opacity="0.9"/>
      <polygon points="400,130 365,220 395,220 380,330 435,215 403,215 425,130" fill="none" stroke="#ff9944" strokeWidth="2"/>
      {/* Loading state */}
      <rect x="270" y="350" width="260" height="18" rx="9" fill="#222" stroke="#444" strokeWidth="1"/>
      <rect x="271" y="351" width="182" height="16" rx="8" fill="url(#fl-bar)"/>
      <text x="400" y="362" fontSize="9" fill="#ff6600" textAnchor="middle" fontFamily="monospace">Loading... 70%</text>
      {/* Control bar */}
      <rect x="150" y="366" width="500" height="14" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
      <text x="165" y="376" fontSize="9" fill="#666" fontFamily="monospace">▶  ⏹  ⏮  ⏭  |  ▐▌</text>
      <text x="560" y="376" fontSize="8" fill="#666" fontFamily="monospace" textAnchor="end">00:00 / 01:23</text>
      {/* Plugin notice */}
      <text x="400" y="420" fontSize="9" fill="#ff6600" textAnchor="middle" fontFamily="monospace" opacity="0.6">
        Get Adobe Flash Player — click to install plugin
      </text>
    </svg>
  );
}

// ─── YouTube (2005–present) ───────────────────────────────────────────────────
function YouTubeScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="yt-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f0f0f"/>
          <stop offset="100%" stopColor="#181818"/>
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#yt-bg)"/>
      {/* Header */}
      <rect x="0" y="0" width="800" height="48" fill="#212121"/>
      <rect x="20" y="12" width="90" height="24" rx="4" fill="#ff0000"/>
      <text x="65" y="29" fontSize="14" fill="white" textAnchor="middle" fontFamily="Arial" fontWeight="bold">YouTube</text>
      <rect x="200" y="14" width="340" height="20" rx="10" fill="#121212" stroke="#303030" strokeWidth="1"/>
      <text x="370" y="28" fontSize="9" fill="#555" textAnchor="middle" fontFamily="Arial">Search</text>
      {/* Main player */}
      <rect x="20" y="58" width="510" height="286" rx="2" fill="#000"/>
      {/* Video frame */}
      <rect x="20" y="58" width="510" height="260" fill="#0a0a0a"/>
      {/* Play overlay */}
      <circle cx="275" cy="188" r="36" fill="rgba(0,0,0,0.7)"/>
      <polygon points="262,170 262,206 300,188" fill="white"/>
      {/* Progress bar */}
      <rect x="20" y="318" width="510" height="4" fill="#333"/>
      <rect x="20" y="318" width="210" height="4" fill="#ff0000"/>
      <circle cx="230" cy="320" r="6" fill="#ff0000"/>
      {/* Video controls */}
      <rect x="20" y="325" width="510" height="20" fill="transparent"/>
      <text x="30" y="339" fontSize="10" fill="#aaa" fontFamily="monospace">▶  🔊──── 3:24 / 10:42</text>
      <text x="480" y="339" fontSize="10" fill="#aaa" fontFamily="monospace" textAnchor="end">⛶ ⚙ CC ⤢</text>
      {/* Video info */}
      <text x="20" y="368" fontSize="13" fill="#f1f1f1" fontFamily="Arial" fontWeight="bold">Charlie Bit My Finger - Again!</text>
      <text x="20" y="388" fontSize="10" fill="#aaa" fontFamily="Arial">HDCYT • 900M views • 2007</text>
      {/* Like/Dislike bar */}
      <rect x="20" y="396" width="200" height="1" fill="#333"/>
      <rect x="20" y="396" width="160" height="1" fill="#3ea6ff"/>
      <text x="20" y="412" fontSize="9" fill="#aaa" fontFamily="Arial">👍 2.3M  👎  Share  Save</text>
      {/* Sidebar recommended */}
      <rect x="545" y="58" width="235" height="380" fill="transparent"/>
      {[0,1,2,3,4].map(i => (
        <g key={i} transform={`translate(545, ${58 + i*74})`}>
          <rect width="235" height="68" fill="transparent"/>
          <rect x="0" y="4" width="108" height="62" rx="2" fill="#333"/>
          <polygon points="44,22 44,46 68,34" fill="rgba(255,255,255,0.7)"/>
          <text x="118" y="22" fontSize="9" fill="#f1f1f1" fontFamily="Arial" fontWeight="bold">{['Evolution of Dance','Keyboard Cat','Numa Numa Guy','Star Wars Kid','Leave Britney Alone'][i]}</text>
          <text x="118" y="36" fontSize="8" fill="#aaa" fontFamily="Arial">{['121M views','98M views','700M views','900M views','45M views'][i]}</text>
          <text x="118" y="48" fontSize="8" fill="#aaa" fontFamily="Arial">200{5+i}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Newgrounds (1995–present) ────────────────────────────────────────────────
function NewgroundsScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ng-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a1200"/>
          <stop offset="100%" stopColor="#050900"/>
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#ng-bg)"/>
      {/* Header */}
      <rect x="0" y="0" width="800" height="50" fill="#1a2800"/>
      {/* NG Tank logo (simplified) */}
      <g transform="translate(20, 8)">
        <rect x="0" y="10" width="50" height="28" rx="3" fill="#5a8000"/>
        <rect x="5" y="6" width="40" height="16" rx="2" fill="#4a7000"/>
        <rect x="38" y="0" width="8" height="16" rx="1" fill="#5a8000"/>
        <circle cx="10" cy="38" r="7" fill="#3a5000" stroke="#2a4000" strokeWidth="1"/>
        <circle cx="30" cy="38" r="7" fill="#3a5000" stroke="#2a4000" strokeWidth="1"/>
        <circle cx="50" cy="38" r="7" fill="#3a5000" stroke="#2a4000" strokeWidth="1"/>
      </g>
      <text x="90" y="20" fontSize="18" fill="#e8ff00" fontFamily="Impact, sans-serif" fontWeight="bold">NEWGROUNDS</text>
      <text x="90" y="38" fontSize="9" fill="#8aaa00" fontFamily="Arial">Everything By Everyone</text>
      <text x="720" y="20" fontSize="10" fill="#8aaa00" fontFamily="Arial">Movies  Games  Audio  Art</text>
      {/* Portal queue */}
      <rect x="20" y="60" width="760" height="30" fill="#1a2800" stroke="#2a4000" strokeWidth="1"/>
      <text x="30" y="78" fontSize="10" fill="#e8ff00" fontFamily="Arial" fontWeight="bold">THE PORTAL  </text>
      <text x="120" y="78" fontSize="9" fill="#aaa" fontFamily="Arial">[ B/P this submission ]  Votes needed: 23 more  Score: 2.77 / 5.00</text>
      {/* Featured submissions grid */}
      {[
        {x:20, y:100, title:'Madness Combat 5', score:'4.38', votes:'18.2k', type:'🎬'},
        {x:200, y:100, title:'Pico\'s School', score:'4.12', votes:'12.1k', type:'🎮'},
        {x:380, y:100, title:'Alien Hominid', score:'4.61', votes:'31.4k', type:'🎮'},
        {x:560, y:100, title:'Dad\'n Me', score:'4.44', votes:'24.8k', type:'🎬'},
        {x:20, y:260, title:'Clock Day 2004', score:'3.88', votes:'8.2k', type:'🎬'},
        {x:200, y:260, title:'The Decline of VG', score:'4.52', votes:'28.1k', type:'🎬'},
        {x:380, y:260, title:'Sonic Vs. Tails', score:'2.41', votes:'4.4k', type:'🎬'},
        {x:560, y:260, title:'BLOCKHEAD', score:'4.18', votes:'14.2k', type:'🎬'},
      ].map((item, i) => (
        <g key={i}>
          <rect x={item.x} y={item.y} width="165" height="145" rx="3" fill="#111800" stroke="#2a4000" strokeWidth="1"/>
          <rect x={item.x} y={item.y} width="165" height="105" rx="3" fill="#1a2800"/>
          <text x={item.x+82} y={item.y+52} fontSize="36" textAnchor="middle" fill="#2a4000">{item.type}</text>
          <text x={item.x+82} y={item.y+66} fontSize="30" textAnchor="middle" fill="#3a5500" opacity="0.4">▶</text>
          <rect x={item.x+5} y={item.y+112} width={item.x < 500 ? 155 : 155} height="4" rx="2" fill="#1a2800"/>
          <rect x={item.x+5} y={item.y+112} width={parseFloat(item.score)/5*155} height="4" rx="2" fill="#8aaa00"/>
          <text x={item.x+8} y={item.y+130} fontSize="8" fill="#e8ff00" fontFamily="Arial" fontWeight="bold">{item.title}</text>
          <text x={item.x+8} y={item.y+142} fontSize="7.5" fill="#668800" fontFamily="monospace">⭐{item.score}  👍{item.votes}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Wikipedia (2001–present) ─────────────────────────────────────────────────
function WikipediaScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#1a1a2e"/>
      {/* Dark page background */}
      <rect x="60" y="20" width="680" height="420" rx="2" fill="#f8f9fa" opacity="0.06"/>
      {/* Wikipedia globe */}
      <circle cx="130" cy="100" r="55" fill="none" stroke="#aaa" strokeWidth="1.5" opacity="0.5"/>
      <ellipse cx="130" cy="100" rx="25" ry="55" fill="none" stroke="#aaa" strokeWidth="1" opacity="0.4"/>
      <line x1="75" y1="100" x2="185" y2="100" stroke="#aaa" strokeWidth="1" opacity="0.4"/>
      <line x1="75" y1="75" x2="185" y2="75" stroke="#aaa" strokeWidth="0.5" opacity="0.3"/>
      <line x1="75" y1="125" x2="185" y2="125" stroke="#aaa" strokeWidth="0.5" opacity="0.3"/>
      {/* W letters on globe */}
      <text x="115" y="105" fontSize="22" fill="#aaa" fontFamily="serif" opacity="0.7">W</text>
      {/* Article title */}
      <text x="200" y="55" fontSize="22" fill="#93b0ff" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.9">Internet</text>
      <rect x="200" y="60" width="420" height="1" fill="#aaa" opacity="0.2"/>
      <text x="200" y="75" fontSize="8" fill="#7d9fd4" fontFamily="Arial" opacity="0.8">From Wikipedia, the free encyclopedia</text>
      {/* Article text columns */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i} x="200" y={90 + i*13} width={200 + (i%3)*60 + (i%5)*20} height="8" rx="2" fill="#aaa" opacity="0.12"/>
      ))}
      <text x="200" y="105" fontSize="9" fill="#7d9fd4" fontFamily="Arial" opacity="0.7">The <tspan fill="#93b0ff" textDecoration="underline">Internet</tspan> (or internet) is the global system of</text>
      <text x="200" y="119" fontSize="9" fill="#7d9fd4" fontFamily="Arial" opacity="0.7">interconnected <tspan fill="#93b0ff" textDecoration="underline">computer networks</tspan> that uses the</text>
      <text x="200" y="133" fontSize="9" fill="#7d9fd4" fontFamily="Arial" opacity="0.7">Internet protocol suite (<tspan fill="#93b0ff" textDecoration="underline">TCP/IP</tspan>) to communicate.</text>
      {/* TOC */}
      <rect x="200" y="155" width="200" height="120" rx="2" fill="#1e2040" stroke="#3a4080" strokeWidth="0.5"/>
      <text x="210" y="170" fontSize="9" fill="#93b0ff" fontFamily="Arial" fontWeight="bold">Contents</text>
      {['1  History','2  Terminology','3  Infrastructure','4  Governance','5  See also'].map((t,i) => (
        <text key={i} x="210" y={185+i*16} fontSize="8.5" fill="#93b0ff" fontFamily="Arial" textDecoration="underline" opacity="0.8">{t}</text>
      ))}
      {/* Infobox */}
      <rect x="530" y="80" width="210" height="240" rx="2" fill="#1e2040" stroke="#3a4080" strokeWidth="0.5"/>
      <rect x="530" y="80" width="210" height="22" fill="#2a3060"/>
      <text x="635" y="95" fontSize="10" fill="#93b0ff" textAnchor="middle" fontFamily="Arial" fontWeight="bold">Internet</text>
      {[
        ['Launched','January 1, 1983'],
        ['Protocol','TCP/IP'],
        ['Users','5.4 billion'],
        ['Websites','1.9 billion'],
        ['Governed by','ICANN / IETF'],
      ].map(([k,v],i) => (
        <g key={i}>
          <text x="540" y={115+i*26} fontSize="8" fill="#7d9fd4" fontFamily="Arial">{k}</text>
          <text x="540" y={128+i*26} fontSize="9" fill="#93b0ff" fontFamily="Arial" fontWeight="bold">{v}</text>
        </g>
      ))}
      {/* Footer: edit / languages */}
      <text x="400" y="420" fontSize="8" fill="#555" textAnchor="middle" fontFamily="Arial">This page was last edited on 14 March 2024 • 321 languages • 6,789,201 articles in English</text>
    </svg>
  );
}

// ─── 4chan (2003–present) ─────────────────────────────────────────────────────
function FourChanScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#0e1005"/>
      {/* Board header */}
      <rect x="0" y="0" width="800" height="40" fill="#117743"/>
      <text x="20" y="15" fontSize="20" fontFamily="Arial" fontWeight="bold" fill="white">4chan</text>
      <text x="20" y="32" fontSize="9" fill="#d6fad6" fontFamily="Arial">Boards: /a/ - /b/ - /c/ - /d/ - /g/ - /k/ - /m/ - /pol/ - /r9k/ - /s4s/ - /v/ - /w/ - /wg/</text>
      {/* Board title */}
      <rect x="0" y="40" width="800" height="24" fill="#1c3a1c"/>
      <text x="20" y="56" fontSize="12" fill="#d6fad6" fontFamily="Arial" fontWeight="bold">/g/ - Technology  [Return] [Catalog] [Bottom]</text>
      {/* Thread 1 - main */}
      <rect x="10" y="72" width="780" height="130" rx="2" fill="#0e1a0e" stroke="#1a3a1a" strokeWidth="1"/>
      {/* OP image */}
      <rect x="18" y="80" width="100" height="100" rx="2" fill="#1a2a1a"/>
      <text x="68" y="140" fontSize="32" textAnchor="middle" fill="#2a4a2a">🖥</text>
      {/* OP post */}
      <text x="128" y="92" fontSize="8.5" fill="#117743" fontFamily="monospace" fontWeight="bold">Anonymous</text>
      <text x="200" y="92" fontSize="8.5" fill="#555" fontFamily="monospace">03/14/04(Tue)16:42 No.1337001</text>
      <text x="128" y="106" fontSize="8.5" fill="#d6fad6" fontFamily="monospace" fontWeight="bold">ITT: We post our battlestations</text>
      <text x="128" y="120" fontSize="8.5" fill="#d6fad6" fontFamily="monospace">I'll start. Just got a new CRT, thoughts?</text>
      <text x="128" y="134" fontSize="8.5" fill="#789922" fontFamily="monospace">&gt;be me, finally upgraded from pentium 2</text>
      <text x="128" y="148" fontSize="8.5" fill="#789922" fontFamily="monospace">&gt;mfw the RAM arrived</text>
      <text x="128" y="165" fontSize="8" fill="#555" fontFamily="monospace">[ Reply ] [ Quote ]  234 replies | 18 images | 42 IPs</text>
      {/* Thread 2 */}
      <rect x="10" y="210" width="780" height="80" rx="2" fill="#0e1a0e" stroke="#1a3a1a" strokeWidth="1"/>
      <rect x="18" y="218" width="60" height="60" rx="2" fill="#1a2a1a"/>
      <text x="48" y="253" fontSize="20" textAnchor="middle" fill="#2a4a2a">📁</text>
      <text x="88" y="230" fontSize="8.5" fill="#117743" fontFamily="monospace" fontWeight="bold">Anonymous</text>
      <text x="165" y="230" fontSize="8.5" fill="#555" fontFamily="monospace">03/14/04(Tue)17:01 No.1337042</text>
      <text x="88" y="244" fontSize="8.5" fill="#d6fad6" fontFamily="monospace" fontWeight="bold">Linux vs Windows thread</text>
      <text x="88" y="258" fontSize="8.5" fill="#789922" fontFamily="monospace">&gt;using Windows in {new Date().getFullYear()}</text>
      <text x="88" y="272" fontSize="8.5" fill="#789922" fontFamily="monospace">&gt;not using Arch btw</text>
      {/* Reply chain */}
      <rect x="30" y="298" width="750" height="60" rx="2" fill="#0a150a" stroke="#152a15" strokeWidth="0.5"/>
      <text x="40" y="313" fontSize="8" fill="#117743" fontFamily="monospace" fontWeight="bold">Anonymous</text>
      <text x="105" y="313" fontSize="8" fill="#555" fontFamily="monospace">03/14/04(Tue)17:15 No.<tspan fill="#d6fad6" textDecoration="underline">1337109</tspan></text>
      <text x="40" y="328" fontSize="8" fill="#d6fad6" fontFamily="monospace">&gt;&gt;1337001</text>
      <text x="40" y="342" fontSize="8" fill="#d6fad6" fontFamily="monospace">kek. nice setup anon. what specs?</text>
      {/* Bottom post area */}
      <rect x="0" y="370" width="800" height="50" fill="#0a0f0a"/>
      <text x="20" y="390" fontSize="8.5" fill="#789922" fontFamily="monospace">[Return] [Catalog] [Bottom]  Reply to thread No.1337001</text>
      <rect x="20" y="398" width="300" height="16" rx="2" fill="#1a2a1a" stroke="#2a4a2a" strokeWidth="0.5"/>
      <text x="30" y="410" fontSize="8" fill="#555" fontFamily="monospace">Name (optional): Anonymous</text>
    </svg>
  );
}

// ─── Reddit (2005–present) ────────────────────────────────────────────────────
function RedditScene() {
  const posts = [
    { votes: '↑ 124k', title: 'I made a website that does nothing and it has 2 million visitors', sub: 'r/webdev', comments: '4.2k', time: '6h' },
    { votes: '↑ 89k', title: 'TIL that the first person to buy something on the internet paid $12.48 for a Sting CD in 1994', sub: 'r/todayilearned', comments: '2.8k', time: '4h' },
    { votes: '↑ 67k', title: '"We are the MySpace generation. We know things can go very wrong." — Zuckerberg', sub: 'r/technology', comments: '1.9k', time: '8h' },
    { votes: '↑ 44k', title: 'Napster is 25 years old today. It changed everything.', sub: 'r/Music', comments: '3.1k', time: '12h' },
    { votes: '↑ 28k', title: 'Me explaining to my parents what a dial-up modem was', sub: 'r/mildlyinteresting', comments: '912', time: '2h' },
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#0d1117"/>
      {/* Reddit header */}
      <rect x="0" y="0" width="800" height="44" fill="#1a1a1b" stroke="#343536" strokeWidth="0.5"/>
      {/* Reddit alien logo */}
      <circle cx="24" cy="22" r="14" fill="#ff4500"/>
      <text x="24" y="28" fontSize="14" fill="white" textAnchor="middle">👾</text>
      <text x="46" y="28" fontSize="14" fill="white" fontFamily="Arial" fontWeight="bold">reddit</text>
      <rect x="90" y="12" width="400" height="20" rx="10" fill="#272729" stroke="#343536" strokeWidth="0.5"/>
      <text x="290" y="26" fontSize="9" fill="#818384" textAnchor="middle" fontFamily="Arial">Search Reddit</text>
      <rect x="600" y="12" width="80" height="20" rx="4" fill="#ff4500"/>
      <text x="640" y="25" fontSize="9" fill="white" textAnchor="middle" fontFamily="Arial" fontWeight="bold">Log In</text>
      {/* Posts */}
      {posts.map((post, i) => (
        <g key={i} transform={`translate(10, ${54 + i * 78})`}>
          <rect width="780" height="72" rx="4" fill="#1a1a1b" stroke="#343536" strokeWidth="0.5"/>
          {/* Vote column */}
          <text x="20" y="18" fontSize="8" fill="#ff4500" fontFamily="monospace" fontWeight="bold">▲</text>
          <text x="12" y="32" fontSize="9" fill="#d7dadc" fontFamily="monospace" fontWeight="bold">{post.votes.split(' ')[1]}</text>
          <text x="20" y="46" fontSize="8" fill="#818384" fontFamily="monospace">▼</text>
          {/* Post content */}
          <text x="55" y="20" fontSize="8" fill="#818384" fontFamily="Arial">
            <tspan fill="#ff4500">{post.sub}</tspan>  •  Posted by u/anonymous  •  {post.time} ago
          </text>
          <text x="55" y="37" fontSize="11" fill="#d7dadc" fontFamily="Arial" fontWeight="bold">{post.title.length > 70 ? post.title.slice(0,70)+'…' : post.title}</text>
          <text x="55" y="57" fontSize="8.5" fill="#818384" fontFamily="Arial">
            💬 {post.comments} comments  •  🔗 Share  •  🏅 Award  •  🔖 Save
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Facebook (2004–present) ──────────────────────────────────────────────────
function FacebookScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="460" fill="#18191a"/>
      {/* Facebook header */}
      <rect x="0" y="0" width="800" height="44" fill="#242526" stroke="#3a3b3c" strokeWidth="0.5"/>
      {/* Facebook f logo */}
      <rect x="12" y="6" width="32" height="32" rx="8" fill="#1877f2"/>
      <text x="28" y="30" fontSize="22" fill="white" textAnchor="middle" fontFamily="Arial" fontWeight="bold">f</text>
      <rect x="56" y="12" width="220" height="20" rx="10" fill="#3a3b3c"/>
      <text x="70" y="26" fontSize="9" fill="#b0b3b8" fontFamily="Arial">🔍 Search Facebook</text>
      <text x="380" y="28" fontSize="10" fill="#e4e6eb" textAnchor="middle" fontFamily="Arial" fontWeight="bold">facebook</text>
      <rect x="660" y="8" width="28" height="28" rx="14" fill="#3a3b3c"/>
      <text x="674" y="27" fontSize="14" textAnchor="middle">👤</text>
      {/* Left sidebar */}
      <rect x="8" y="52" width="170" height="400" fill="transparent"/>
      {['👤  John Smith','👥  Friends','📸  Photos','🎭  Memories','⭐  Saved','👥  Groups'].map((item, i) => (
        <text key={i} x="20" y={72 + i*28} fontSize="10" fill="#e4e6eb" fontFamily="Arial">{item}</text>
      ))}
      {/* News feed */}
      <rect x="190" y="52" width="400" height="60" rx="8" fill="#242526" stroke="#3a3b3c" strokeWidth="0.5"/>
      <circle cx="210" cy="82" r="14" fill="#3a3b3c"/>
      <text x="210" y="87" fontSize="14" textAnchor="middle">😊</text>
      <rect x="232" y="72" width="340" height="20" rx="10" fill="#3a3b3c"/>
      <text x="255" y="86" fontSize="9" fill="#b0b3b8" fontFamily="Arial">What's on your mind, Mark?</text>
      {/* Post 1 */}
      <rect x="190" y="120" width="400" height="180" rx="8" fill="#242526" stroke="#3a3b3c" strokeWidth="0.5"/>
      <circle cx="210" cy="140" r="14" fill="#3a3b3c"/>
      <text x="210" y="145" fontSize="14" textAnchor="middle">👤</text>
      <text x="232" y="137" fontSize="10" fill="#e4e6eb" fontFamily="Arial" fontWeight="bold">Alex Johnson</text>
      <text x="232" y="151" fontSize="8.5" fill="#b0b3b8" fontFamily="Arial">3 hours ago  •  🌐</text>
      <text x="200" y="172" fontSize="9.5" fill="#e4e6eb" fontFamily="Arial">Just discovered GeoCities is shutting down. A whole era of</text>
      <text x="200" y="187" fontSize="9.5" fill="#e4e6eb" fontFamily="Arial">the internet is disappearing. Anyone else feeling nostalgic?</text>
      {/* Photo post */}
      <rect x="200" y="196" width="380" height="70" rx="4" fill="#3a3b3c"/>
      <text x="390" y="236" fontSize="28" textAnchor="middle" fill="#555">📷</text>
      {/* Like bar */}
      <rect x="200" y="274" width="380" height="1" fill="#3a3b3c"/>
      <text x="200" y="290" fontSize="9" fill="#b0b3b8" fontFamily="Arial">👍 1,247  ❤️ 89  😂 23     💬 456 Comments  Share</text>
      {/* Post 2 */}
      <rect x="190" y="308" width="400" height="100" rx="8" fill="#242526" stroke="#3a3b3c" strokeWidth="0.5"/>
      <circle cx="210" cy="328" r="14" fill="#1877f2"/>
      <text x="210" y="333" fontSize="12" textAnchor="middle" fill="white">f</text>
      <text x="232" y="325" fontSize="10" fill="#e4e6eb" fontFamily="Arial" fontWeight="bold">Facebook</text>
      <text x="232" y="339" fontSize="8.5" fill="#b0b3b8" fontFamily="Arial">Sponsored</text>
      <text x="200" y="358" fontSize="9" fill="#e4e6eb" fontFamily="Arial">Find old classmates. Connect with people you know.</text>
      <rect x="200" y="368" width="100" height="22" rx="4" fill="#1877f2"/>
      <text x="250" y="383" fontSize="9" fill="white" textAnchor="middle" fontFamily="Arial" fontWeight="bold">Sign Up Free</text>
      {/* Right sidebar */}
      <rect x="602" y="52" width="188" height="400" fill="transparent"/>
      <text x="614" y="72" fontSize="10" fill="#e4e6eb" fontFamily="Arial" fontWeight="bold">People You May Know</text>
      {['Sarah M.','James R.','Priya K.','Tom A.'].map((name, i) => (
        <g key={i} transform={`translate(610, ${85+i*55})`}>
          <circle cx="20" cy="20" r="18" fill="#3a3b3c"/>
          <text x="20" y="25" fontSize="16" textAnchor="middle">🙂</text>
          <text x="46" y="16" fontSize="9" fill="#e4e6eb" fontFamily="Arial" fontWeight="bold">{name}</text>
          <text x="46" y="28" fontSize="8" fill="#b0b3b8" fontFamily="Arial">3 mutual friends</text>
          <rect x="46" y="32" width="60" height="14" rx="4" fill="#3a3b3c"/>
          <text x="76" y="43" fontSize="8" fill="#e4e6eb" textAnchor="middle" fontFamily="Arial">Add Friend</text>
        </g>
      ))}
    </svg>
  );
}

type SceneFn = () => React.JSX.Element;

const HERO_SCENES: Record<string, SceneFn> = {
  'geocities': GeoCitiesScene,
  'myspace': MySpaceScene,
  'napster': NapsterScene,
  'flash': FlashScene,
  'youtube': YouTubeScene,
  'newgrounds': NewgroundsScene,
  'wikipedia': WikipediaScene,
  '4chan': FourChanScene,
  'reddit': RedditScene,
  'facebook': FacebookScene,
};
