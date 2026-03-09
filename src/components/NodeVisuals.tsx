'use client';
import React, { useState } from 'react';
import { getNodeTagline } from '@/data/nodeVisuals';

const TS: React.CSSProperties = { userSelect: 'none', pointerEvents: 'none' };

// ── ArtifactIcon ─────────────────────────────────────────────────────────────
// All shapes centered at (0,0). `r` = node circle radius in canvas coords.

export function ArtifactIcon({
  slug, color, r, title,
}: {
  slug: string; color: string; r: number; title?: string;
}) {
  const h = r * 0.62;

  switch (slug) {

    // ── Core platforms ────────────────────────────────────────────────────────

    case 'youtube':
      return (<>
        <rect x={-h*1.3} y={-h*0.9} width={h*2.6} height={h*1.8} rx={h*0.28}
          fill={color} fillOpacity={0.18} stroke={color} strokeOpacity={0.5} strokeWidth={h*0.1}/>
        <path d={`M${-h*0.28} ${-h*0.52} L${h*0.68} 0 L${-h*0.28} ${h*0.52}Z`} fill={color}/>
      </>);

    case 'facebook':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*1.08}
        fill={color} fontWeight="800" fontFamily="ui-sans-serif,sans-serif" style={TS}>f</text>;

    case 'wikipedia':
      return <text x={0} y={r*0.35} textAnchor="middle" fontSize={r*0.97}
        fill={color} fontWeight="700" fontFamily="ui-serif,serif" style={TS}>W</text>;

    case 'google':
      return (<>
        <circle cx={0} cy={0} r={h*0.88} fill="none" stroke={color} strokeWidth={h*0.3}
          strokeDasharray={`${h*3.5} ${h*1.5}`} strokeDashoffset={h*0.5}/>
        <line x1={h*0.02} y1={0} x2={h*0.9} y2={0} stroke={color} strokeWidth={h*0.3} strokeLinecap="round"/>
      </>);

    case '4chan':
      return <text x={0} y={r*0.37} textAnchor="middle" fontSize={r*1.08}
        fill={color} fontWeight="900" fontFamily="ui-monospace,monospace" style={TS}>4</text>;

    case 'napster':
      return <path
        d={`M${h*0.15} ${h*0.9} L${h*0.15} ${-h*0.4} L${h*0.85} ${-h*0.85} L${h*0.85} ${h*0.45}
            M${h*0.15} ${h*0.9} Q${-h*0.3} ${h*1.05} ${-h*0.3} ${h*0.68} Q${-h*0.3} ${h*0.32} ${h*0.15} ${h*0.42}`}
        fill="none" stroke={color} strokeWidth={h*0.24} strokeLinecap="round"/>;

    case 'flash':
    case 'macromedia-flash':
    case 'adobe-flash':
    case 'shockwave':
      return <path
        d={`M${h*0.18} ${-h*1.05} L${-h*0.38} ${h*0.08} L${h*0.08} ${h*0.08}
            L${-h*0.18} ${h*1.05} L${h*0.38} ${-h*0.08} L${-h*0.08} ${-h*0.08}Z`}
        fill={color}/>;

    case 'geocities':
      return <path
        d={`M0 ${-h*1.05} L${h*0.88} ${-h*0.18} L${h*0.62} ${-h*0.18} L${h*0.62} ${h*0.88}
            L${-h*0.62} ${h*0.88} L${-h*0.62} ${-h*0.18} L${-h*0.88} ${-h*0.18}Z`}
        fill="none" stroke={color} strokeWidth={h*0.22} strokeLinecap="round" strokeLinejoin="round"/>;

    case 'myspace':
      return (<>
        <circle cx={-h*0.38} cy={-h*0.32} r={h*0.48} fill={color} fillOpacity={0.85}/>
        <path d={`M${-h*0.98} ${h*0.95} Q${-h*0.98} ${h*0.18} ${-h*0.38} ${h*0.18} Q${h*0.22} ${h*0.18} ${h*0.22} ${h*0.95}Z`}
          fill={color} fillOpacity={0.85}/>
        <circle cx={h*0.52} cy={-h*0.05} r={h*0.38} fill={color} fillOpacity={0.52}/>
        <path d={`M${h*0.2} ${h*0.95} Q${h*0.2} ${h*0.38} ${h*0.52} ${h*0.38} Q${h*0.84} ${h*0.38} ${h*0.84} ${h*0.95}Z`}
          fill={color} fillOpacity={0.52}/>
      </>);

    case 'reddit':
      return (<>
        <circle cx={0} cy={-h*0.28} r={h*0.75} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={h*0.14}/>
        <circle cx={-h*0.3} cy={-h*0.18} r={h*0.2} fill={color}/>
        <circle cx={h*0.3} cy={-h*0.18} r={h*0.2} fill={color}/>
        <path d={`M${-h*0.38} ${h*0.22} Q0 ${h*0.72} ${h*0.38} ${h*0.22}`}
          fill="none" stroke={color} strokeWidth={h*0.22} strokeLinecap="round"/>
        <circle cx={h*0.72} cy={-h*0.75} r={h*0.2} fill={color}/>
        <line x1={h*0.72} y1={-h*0.55} x2={h*0.72} y2={-h*1.05} stroke={color} strokeWidth={h*0.15} strokeLinecap="round"/>
      </>);

    case 'instagram':
      return (<>
        <rect x={-h*0.92} y={-h*0.92} width={h*1.84} height={h*1.84} rx={h*0.46}
          fill="none" stroke={color} strokeWidth={h*0.17}/>
        <circle cx={0} cy={0} r={h*0.52} fill="none" stroke={color} strokeWidth={h*0.17}/>
        <circle cx={h*0.64} cy={-h*0.64} r={h*0.15} fill={color}/>
      </>);

    case 'twitter':
    case 'x':
      return <path d={`M${-h*0.8} ${-h*0.9} L${h*0.9} ${h*0.9} M${h*0.8} ${-h*0.9} L${-h*0.9} ${h*0.9}`}
        stroke={color} strokeWidth={h*0.3} strokeLinecap="round"/>;

    case 'discord':
      return (<>
        <path d={`M${-h*0.82} ${-h*0.05} Q${-h*0.82} ${-h*0.98} 0 ${-h*0.98} Q${h*0.82} ${-h*0.98} ${h*0.82} ${-h*0.05}`}
          fill="none" stroke={color} strokeWidth={h*0.2}/>
        <ellipse cx={-h*0.88} cy={h*0.2} rx={h*0.28} ry={h*0.44} fill={color} fillOpacity={0.85}/>
        <ellipse cx={h*0.88} cy={h*0.2} rx={h*0.28} ry={h*0.44} fill={color} fillOpacity={0.85}/>
      </>);

    case 'tumblr':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*1.05}
        fill={color} fontWeight="800" fontFamily="ui-serif,serif" style={TS}>t</text>;

    case 'newgrounds':
      return <path
        d={`M0 ${-h*1.02} L${h*0.42} ${-h*0.15} L${h*1.02} ${-h*0.38}
            L${h*0.62} ${h*0.38} L${h*1.02} ${h*1.02} L0 ${h*0.52}
            L${-h*1.02} ${h*1.02} L${-h*0.62} ${h*0.38}
            L${-h*1.02} ${-h*0.38} L${-h*0.42} ${-h*0.15}Z`}
        fill={color} fillOpacity={0.9}/>;

    case 'icq':
      return (<>
        <circle cx={0} cy={0} r={h*0.55} fill={color} fillOpacity={0.95}/>
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = deg * Math.PI / 180;
          return <circle key={deg} cx={Math.cos(rad)*h*1.02} cy={Math.sin(rad)*h*1.02}
            r={h*0.2} fill={color} fillOpacity={0.7}/>;
        })}
      </>);

    case 'something-awful':
      return <text x={0} y={r*0.35} textAnchor="middle" fontSize={r*0.78}
        fill={color} fontWeight="700" fontFamily="ui-sans-serif,sans-serif" style={TS}>SA</text>;

    case 'bbs':
      return (<>
        <rect x={-h*0.92} y={-h*0.78} width={h*1.84} height={h*1.56} rx={h*0.15}
          fill="none" stroke={color} strokeWidth={h*0.15}/>
        <path d={`M${-h*0.56} ${-h*0.32} L${-h*0.14} ${h*0.1} L${-h*0.56} ${h*0.52}`}
          fill="none" stroke={color} strokeWidth={h*0.22} strokeLinecap="round" strokeLinejoin="round"/>
        <line x1={-h*0.14} y1={h*0.52} x2={h*0.56} y2={h*0.52} stroke={color} strokeWidth={h*0.22} strokeLinecap="round"/>
      </>);

    case 'blogs':
    case 'blogger':
    case 'livejournal':
    case 'typepad':
    case 'medium':
    case 'substack':
      return (<>
        <rect x={-h*0.78} y={-h*0.98} width={h*1.56} height={h*1.96} rx={h*0.15}
          fill="none" stroke={color} strokeWidth={h*0.15}/>
        <line x1={-h*0.46} y1={-h*0.46} x2={h*0.46} y2={-h*0.46} stroke={color} strokeWidth={h*0.15} strokeLinecap="round"/>
        <line x1={-h*0.46} y1={0} x2={h*0.46} y2={0} stroke={color} strokeWidth={h*0.15} strokeLinecap="round"/>
        <line x1={-h*0.46} y1={h*0.46} x2={h*0.16} y2={h*0.46} stroke={color} strokeWidth={h*0.15} strokeLinecap="round"/>
      </>);

    // ── New icons ─────────────────────────────────────────────────────────────

    case 'world-wide-web':
    case 'internet':
      return (<>
        <circle cx={0} cy={0} r={h*0.88} fill="none" stroke={color} strokeWidth={h*0.15}/>
        <ellipse cx={0} cy={0} rx={h*0.5} ry={h*0.88} fill="none" stroke={color} strokeWidth={h*0.1}/>
        <line x1={-h*0.88} y1={0} x2={h*0.88} y2={0} stroke={color} strokeWidth={h*0.1}/>
        <line x1={-h*0.62} y1={-h*0.62} x2={h*0.62} y2={-h*0.62} stroke={color} strokeWidth={h*0.08}/>
        <line x1={-h*0.62} y1={h*0.62} x2={h*0.62} y2={h*0.62} stroke={color} strokeWidth={h*0.08}/>
      </>);

    case 'netscape':
    case 'netscape-navigator':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*1.12}
        fill={color} fontWeight="800" fontFamily="ui-sans-serif,sans-serif" style={TS}>N</text>;

    case 'internet-explorer':
    case 'mosaic':
      return (<>
        <circle cx={0} cy={0} r={h*0.85} fill="none" stroke={color} strokeWidth={h*0.18}/>
        <line x1={-h*0.6} y1={-h*0.5} x2={h*0.6} y2={h*0.5} stroke={color} strokeWidth={h*0.18}/>
      </>);

    case 'yahoo':
      return <text x={0} y={r*0.35} textAnchor="middle" fontSize={r*0.88}
        fill={color} fontWeight="800" fontFamily="ui-sans-serif,sans-serif" style={TS}>Y!</text>;

    case 'altavista':
    case 'ask-jeeves':
    case 'excite':
    case 'lycos':
      return (<>
        <circle cx={-h*0.18} cy={-h*0.12} r={h*0.62} fill="none" stroke={color} strokeWidth={h*0.2}/>
        <line x1={h*0.3} y1={h*0.3} x2={h*0.88} y2={h*0.88} stroke={color} strokeWidth={h*0.24} strokeLinecap="round"/>
      </>);

    case 'irc':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*1.0}
        fill={color} fontWeight="700" fontFamily="ui-monospace,monospace" style={TS}>#</text>;

    case 'aim':
    case 'aol-instant-messenger':
    case 'msn-messenger':
    case 'windows-live-messenger':
      return (<>
        <rect x={-h*0.88} y={-h*0.75} width={h*1.76} height={h*1.2} rx={h*0.32}
          fill="none" stroke={color} strokeWidth={h*0.18}/>
        <path d={`M${-h*0.28} ${h*0.45} L${-h*0.52} ${h*0.92} L${h*0.08} ${h*0.45}`} fill={color}/>
      </>);

    case 'aol':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.82}
        fill={color} fontWeight="800" fontFamily="ui-sans-serif,sans-serif" style={TS}>AOL</text>;

    case 'hotmail':
    case 'gmail':
    case 'yahoo-mail':
      return (<>
        <rect x={-h*0.92} y={-h*0.68} width={h*1.84} height={h*1.36} rx={h*0.12}
          fill="none" stroke={color} strokeWidth={h*0.15}/>
        <path d={`M${-h*0.92} ${-h*0.68} L0 ${h*0.22} L${h*0.92} ${-h*0.68}`}
          fill="none" stroke={color} strokeWidth={h*0.15} strokeLinejoin="round"/>
      </>);

    case 'winamp':
      return (<>
        {([-h*0.6, -h*0.2, h*0.2, h*0.6] as number[]).map((x, i) => {
          const hs = [0.7, 1.0, 0.82, 0.55];
          const bh = h * hs[i];
          return <rect key={i} x={x - h*0.13} y={-bh} width={h*0.26} height={bh * 1.7}
            rx={h*0.08} fill={color} fillOpacity={0.9}/>;
        })}
      </>);

    case 'limewire':
    case 'bittorrent':
    case 'kazaa':
    case 'emule':
    case 'gnutella':
      return (<>
        <path d={`M0 ${-h*0.88} L0 ${h*0.45}`} stroke={color} strokeWidth={h*0.24} strokeLinecap="round"/>
        <path d={`M${-h*0.5} ${-h*0.08} L0 ${h*0.68} L${h*0.5} ${-h*0.08}`}
          stroke={color} strokeWidth={h*0.24} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      </>);

    case 'internet-archive':
    case 'wayback-machine':
      return (<>
        <path d={`M${-h*1.0} ${-h*0.05} L0 ${-h*0.88} L${h*1.0} ${-h*0.05}`}
          fill={color} fillOpacity={0.75} stroke={color} strokeWidth={h*0.1} strokeLinejoin="round"/>
        <rect x={-h*0.82} y={-h*0.05} width={h*1.64} height={h*1.0} rx={h*0.06}
          fill={color} fillOpacity={0.25} stroke={color} strokeWidth={h*0.12}/>
        {[-h*0.42, h*0.42].map((x, i) => (
          <rect key={i} x={x - h*0.18} y={h*0.22} width={h*0.36} height={h*0.68}
            rx={h*0.05} fill="none" stroke={color} strokeWidth={h*0.12}/>
        ))}
      </>);

    case 'html':
    case 'css':
    case 'javascript':
      return (<>
        <path d={`M${-h*0.48} ${-h*0.8} L${-h*0.88} 0 L${-h*0.48} ${h*0.8}`}
          fill="none" stroke={color} strokeWidth={h*0.22} strokeLinecap="round" strokeLinejoin="round"/>
        <path d={`M${h*0.48} ${-h*0.8} L${h*0.88} 0 L${h*0.48} ${h*0.8}`}
          fill="none" stroke={color} strokeWidth={h*0.22} strokeLinecap="round" strokeLinejoin="round"/>
      </>);

    case 'memes':
    case 'rage-comics':
    case 'i-can-has-cheezburger':
    case 'lolcats':
      return (<>
        <circle cx={-h*0.35} cy={-h*0.2} r={h*0.2} fill={color}/>
        <circle cx={h*0.35} cy={-h*0.2} r={h*0.2} fill={color}/>
        <path d={`M${-h*0.48} ${h*0.4} Q0 ${h*0.92} ${h*0.48} ${h*0.4}`}
          fill="none" stroke={color} strokeWidth={h*0.22} strokeLinecap="round"/>
      </>);

    case 'amazon':
    case 'amazon-com':
      return (<>
        <text x={-h*0.08} y={r*0.28} textAnchor="middle" fontSize={r*0.82}
          fill={color} fontWeight="700" fontFamily="ui-sans-serif,sans-serif" style={TS}>a</text>
        <path d={`M${-h*0.52} ${h*0.8} Q0 ${h*1.08} ${h*0.6} ${h*0.62}`}
          fill="none" stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
        <path d={`M${h*0.38} ${h*0.35} L${h*0.62} ${h*0.62} L${h*0.35} ${h*0.88}`}
          fill="none" stroke={color} strokeWidth={h*0.18} strokeLinecap="round" strokeLinejoin="round"/>
      </>);

    case 'ebay':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.72}
        fill={color} fontWeight="700" fontFamily="ui-sans-serif,sans-serif" style={TS}>eBay</text>;

    case 'craigslist':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.82}
        fill={color} fontWeight="700" fontFamily="ui-monospace,monospace" style={TS}>cl</text>;

    case 'paypal':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.95}
        fill={color} fontWeight="800" fontFamily="ui-sans-serif,sans-serif" style={TS}>P</text>;

    case 'flickr':
      return (<>
        <circle cx={-h*0.44} cy={0} r={h*0.52} fill={color} fillOpacity={0.88}/>
        <circle cx={h*0.44} cy={0} r={h*0.52} fill={color} fillOpacity={0.5}/>
      </>);

    case 'wordpress':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.88}
        fill={color} fontWeight="800" fontFamily="ui-sans-serif,sans-serif" style={TS}>W</text>;

    case 'digg':
      return (<>
        <circle cx={-h*0.28} cy={-h*0.25} r={h*0.52} fill="none" stroke={color} strokeWidth={h*0.2}/>
        <line x1={h*0.18} y1={h*0.15} x2={h*0.18} y2={h*0.88}
          stroke={color} strokeWidth={h*0.24} strokeLinecap="round"/>
        <path d={`M${-h*0.18} ${h*0.88} Q${h*0.18} ${h*1.1} ${h*0.52} ${h*0.88}`}
          fill="none" stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
      </>);

    case 'slashdot':
    case 'hacker-news':
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.95}
        fill={color} fontWeight="700" fontFamily="ui-monospace,monospace" style={TS}>/.</text>;

    case 'soundcloud':
      return (<>
        {([-h*0.72, -h*0.46, -h*0.2, h*0.06, h*0.32, h*0.58, h*0.82] as number[]).map((x, i) => {
          const hs = [0.48, 0.72, 0.92, 1.0, 0.82, 0.62, 0.42];
          const bh = h * hs[i];
          return <rect key={i} x={x} y={-bh} width={h*0.18} height={bh * 2}
            rx={h*0.06} fill={color} fillOpacity={0.9}/>;
        })}
      </>);

    case 'deviantart':
      return (<>
        <path d={`M${-h*0.34} ${-h*1.0} L${-h*0.82} ${-h*0.05} L${-h*0.34} ${-h*0.05}
                   L${h*0.34} ${h*1.0} L${h*0.82} ${h*0.05} L${h*0.34} ${h*0.05}Z`}
          fill={color} fillOpacity={0.9}/>
      </>);

    case 'friendster':
    case 'linkedin':
      return (<>
        <circle cx={0} cy={-h*0.52} r={h*0.4} fill={color} fillOpacity={0.9}/>
        <path d={`M${-h*0.78} ${h*0.88} Q${-h*0.78} ${h*0.18} 0 ${h*0.18} Q${h*0.78} ${h*0.18} ${h*0.78} ${h*0.88}Z`}
          fill={color} fillOpacity={0.9}/>
      </>);

    case 'snapchat':
      return (<>
        <circle cx={0} cy={-h*0.18} r={h*0.72} fill={color} fillOpacity={0.9}/>
        <rect x={-h*0.72} y={-h*0.18} width={h*1.44} height={h*0.9} fill={color} fillOpacity={0.9}/>
        <path d={`M${-h*0.72} ${h*0.72} Q${-h*0.36} ${h*0.38} 0 ${h*0.72} Q${h*0.36} ${h*0.38} ${h*0.72} ${h*0.72}`}
          fill="#04040c" fillOpacity={0.9}/>
        <circle cx={-h*0.26} cy={-h*0.18} r={h*0.2} fill="#04040c" fillOpacity={0.85}/>
        <circle cx={h*0.26} cy={-h*0.18} r={h*0.2} fill="#04040c" fillOpacity={0.85}/>
      </>);

    case 'tiktok':
      return (<>
        <path d={`M${h*0.35} ${-h*1.0} L${h*0.35} ${h*0.32}`}
          stroke={color} strokeWidth={h*0.24} strokeLinecap="round"/>
        <circle cx={h*0.05} cy={h*0.55} r={h*0.38} fill="none" stroke={color} strokeWidth={h*0.2}/>
        <path d={`M${h*0.35} ${-h*0.5} L${h*0.85} ${-h*0.8} L${h*0.85} ${-h*0.42}`}
          stroke={color} strokeWidth={h*0.18} fill="none" strokeLinejoin="round"/>
      </>);

    case 'spotify':
      return (<>
        <circle cx={0} cy={0} r={h*0.9} fill="none" stroke={color} strokeWidth={h*0.18}/>
        <path d={`M${-h*0.58} ${-h*0.25} Q0 ${-h*0.52} ${h*0.58} ${-h*0.25}`}
          fill="none" stroke={color} strokeWidth={h*0.16} strokeLinecap="round"/>
        <path d={`M${-h*0.48} ${h*0.08} Q0 ${-h*0.16} ${h*0.48} ${h*0.08}`}
          fill="none" stroke={color} strokeWidth={h*0.16} strokeLinecap="round"/>
        <path d={`M${-h*0.35} ${h*0.4} Q0 ${h*0.22} ${h*0.35} ${h*0.4}`}
          fill="none" stroke={color} strokeWidth={h*0.14} strokeLinecap="round"/>
      </>);

    case 'vine':
      return (<>
        <path d={`M${-h*0.3} ${-h*0.92} Q${-h*0.68} ${h*0.18} ${h*0.18} ${h*0.65} Q${h*0.65} ${h*0.95} ${h*0.92} ${h*0.55}`}
          fill="none" stroke={color} strokeWidth={h*0.26} strokeLinecap="round"/>
      </>);

    case 'last-fm':
    case 'last.fm':
      return <text x={0} y={r*0.35} textAnchor="middle" fontSize={r*0.68}
        fill={color} fontWeight="700" fontFamily="ui-sans-serif,sans-serif" style={TS}>last.fm</text>;

    case 'ytmnd':
      return <text x={0} y={r*0.35} textAnchor="middle" fontSize={r*0.68}
        fill={color} fontWeight="700" fontFamily="ui-monospace,monospace" style={TS}>YTMND</text>;

    case 'webrings':
      return (<>
        <circle cx={-h*0.42} cy={0} r={h*0.56} fill="none" stroke={color} strokeWidth={h*0.2}/>
        <circle cx={h*0.42} cy={0} r={h*0.56} fill="none" stroke={color} strokeWidth={h*0.2}/>
      </>);

    case 'homestar-runner':
      return (<>
        <circle cx={0} cy={-h*0.2} r={h*0.72} fill={color} fillOpacity={0.85}/>
        <path d={`M${-h*0.52} ${h*0.5} L${-h*0.52} ${h*0.95} M${h*0.52} ${h*0.5} L${h*0.52} ${h*0.95}`}
          stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
      </>);

    case 'albino-blacksheep':
    case 'ebaumsworld':
      return (<>
        <circle cx={0} cy={h*0.08} r={h*0.78} fill={color} fillOpacity={0.22}
          stroke={color} strokeWidth={h*0.18}/>
        <circle cx={-h*0.28} cy={h*0.08} r={h*0.2} fill={color}/>
        <circle cx={h*0.28} cy={h*0.08} r={h*0.2} fill={color}/>
      </>);

    case 'github':
      return (<>
        <circle cx={0} cy={-h*0.1} r={h*0.8} fill="none" stroke={color} strokeWidth={h*0.18}/>
        <path d={`M${-h*0.35} ${h*0.55} Q${-h*0.35} ${h*0.92} 0 ${h*0.78} Q${h*0.35} ${h*0.92} ${h*0.35} ${h*0.55}`}
          fill={color} fillOpacity={0.75}/>
      </>);

    case 'stackoverflow':
    case 'sourceforge':
      return (<>
        {[0, 1, 2].map((i) => (
          <line key={i} x1={-h*0.6} y1={-h*0.4 + i*h*0.4} x2={h*0.6} y2={-h*0.4 + i*h*0.4}
            stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
        ))}
      </>);

    case 'twitch':
      return (<>
        <path d={`M${-h*0.7} ${-h*0.9} L${-h*0.7} ${h*0.22} L${-h*0.22} ${h*0.22}
                   L${-h*0.22} ${h*0.7} L${h*0.22} ${h*0.22} L${h*0.7} ${h*0.22} L${h*0.7} ${-h*0.9}Z`}
          fill="none" stroke={color} strokeWidth={h*0.2} strokeLinejoin="round"/>
        <line x1={-h*0.22} y1={-h*0.55} x2={-h*0.22} y2={-h*0.08}
          stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
        <line x1={h*0.22} y1={-h*0.55} x2={h*0.22} y2={-h*0.08}
          stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
      </>);

    case 'pinterest':
      return (<>
        <circle cx={0} cy={-h*0.15} r={h*0.75} fill="none" stroke={color} strokeWidth={h*0.18}/>
        <line x1={h*0.38} y1={h*0.52} x2={h*0.38} y2={h*1.05}
          stroke={color} strokeWidth={h*0.2} strokeLinecap="round"/>
      </>);

    case 'wikileaks':
    case 'know-your-meme':
      return (<>
        <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.88}
          fill={color} fontWeight="700" fontFamily="ui-sans-serif,sans-serif" style={TS}>?</text>
      </>);

    // ── Fallback ──────────────────────────────────────────────────────────────

    default:
      if (!title) return null;
      return <text x={0} y={r*0.38} textAnchor="middle" fontSize={r*0.95}
        fill={color} fillOpacity={0.85} fontWeight="700"
        fontFamily="ui-sans-serif,sans-serif" style={TS}>
        {title[0]?.toUpperCase() ?? '?'}
      </text>;
  }
}

// ── ThumbnailArea ─────────────────────────────────────────────────────────────
// SVG <image> element clipped to a rounded rect, with icon fallback on error.
// Used inside ArtifactCard to fill the left accent strip.

function ThumbnailArea({
  slug, color, title, thumbnailPath, x, y, w, h, rx,
}: {
  slug: string; color: string; title: string; thumbnailPath: string;
  x: number; y: number; w: number; h: number; rx: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const clipId = `tc-${slug}`;
  const iconR  = Math.min(w, h) * 0.4;

  if (imgFailed) {
    return (
      <>
        {/* Accent fill fallback */}
        <rect x={x} y={y} width={w} height={h} rx={rx} fill={color} fillOpacity={0.35}/>
        <g transform={`translate(${x + w / 2},${y + h / 2})`}>
          <ArtifactIcon slug={slug} color="white" r={iconR} title={title}/>
        </g>
      </>
    );
  }

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={w} height={h} rx={rx}/>
        </clipPath>
      </defs>
      {/* Dark tint base so text over it stays readable */}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="#000" fillOpacity={0.15}/>
      <image
        href={thumbnailPath}
        x={x} y={y} width={w} height={h}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
        onError={() => setImgFailed(true)}
      />
      {/* Subtle overlay so the card border reads cleanly against the image */}
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill={color} fillOpacity={0.08}
        stroke={color} strokeOpacity={0.25} strokeWidth={0.6}
      />
    </>
  );
}

// ── ArtifactCard ─────────────────────────────────────────────────────────────
// Rich card rendered for thumbnail-type nodes at close/closest zoom.
// Centered at (0,0) in canvas coords.
//
// When thumbnailPath is provided the card shows a 2-column layout:
//   left  = real screenshot image (clipped)
//   right = title + tagline text
//
// When thumbnailPath is null it falls back to the icon+text layout.

export function ArtifactCard({
  slug, color, title, isSelected, isHovered, isConnected, thumbnailPath,
}: {
  slug: string; color: string; title: string;
  isSelected: boolean; isHovered: boolean; isConnected: boolean;
  thumbnailPath?: string | null;
}) {
  const tagline     = getNodeTagline(slug);
  const BW          = isSelected ? 58 : 50;
  const BH          = isSelected ? 19 : 16;
  const IR          = BH - 4;          // icon circle radius
  const iconX       = -BW + IR + 5;    // icon center x
  const textX       = iconX + IR + 9;  // text start x
  const hasTag      = !!tagline;
  const displayTitle = title.length > 14 ? title.slice(0, 13) + '…' : title;
  const displayTag   = tagline.length > 20 ? tagline.slice(0, 19) + '…' : tagline;

  // Thumbnail area dimensions (left accent strip)
  const thumbW = IR * 2 + 7;
  const thumbX = -BW;
  const thumbY = -BH;
  const thumbH = BH * 2;

  return (<>
    {/* Outer pulse ring (selected) */}
    {isSelected && (
      <circle r={BW + 22} fill="none" stroke={color} strokeOpacity={0.07} strokeWidth={0.6}/>
    )}

    {/* Glow halo */}
    {(isSelected || isHovered) && (
      <rect
        x={-BW - 9} y={-BH - 9} width={(BW + 9) * 2} height={(BH + 9) * 2} rx={BH + 9}
        fill={color} fillOpacity={isSelected ? 0.12 : 0.06}
        stroke={color} strokeOpacity={isSelected ? 0.32 : 0.14} strokeWidth={0.6}
      />
    )}

    {/* Connected indicator */}
    {isConnected && !isSelected && !isHovered && (
      <rect
        x={-BW - 5} y={-BH - 5} width={(BW + 5) * 2} height={(BH + 5) * 2} rx={BH + 5}
        fill="none" stroke={color} strokeOpacity={0.2} strokeWidth={0.5}
      />
    )}

    {/* Card body */}
    <rect
      x={-BW} y={-BH} width={BW * 2} height={BH * 2} rx={6}
      fill={color}
      fillOpacity={isSelected ? 0.22 : isHovered ? 0.16 : isConnected ? 0.1 : 0.07}
      stroke={color}
      strokeOpacity={isSelected ? 0.95 : isHovered ? 0.65 : isConnected ? 0.38 : 0.22}
      strokeWidth={isSelected ? 1.8 : 1.0}
    />

    {/* Left accent strip — thumbnail image OR icon fallback */}
    {thumbnailPath ? (
      <ThumbnailArea
        slug={slug} color={color} title={title}
        thumbnailPath={thumbnailPath}
        x={thumbX} y={thumbY} w={thumbW} h={thumbH} rx={6}
      />
    ) : (
      <>
        {/* Solid accent strip */}
        <rect
          x={-BW} y={-BH} width={thumbW} height={thumbH}
          rx={6}
          fill={color} fillOpacity={isSelected ? 0.4 : 0.24}
        />
        {/* Kill right-side rounded corners of the accent strip */}
        <rect
          x={-BW + IR + 2} y={-BH} width={8} height={thumbH}
          fill={color} fillOpacity={isSelected ? 0.4 : 0.24}
        />
        {/* Icon */}
        <g transform={`translate(${iconX}, 0)`}>
          <ArtifactIcon slug={slug} color="white" r={IR * 0.82} title={title}/>
        </g>
      </>
    )}

    {/* Divider */}
    <line
      x1={textX - 5} y1={-BH + 4} x2={textX - 5} y2={BH - 4}
      stroke={color} strokeOpacity={0.22} strokeWidth={0.6}
    />

    {/* Title */}
    <text
      x={textX} y={hasTag ? -4 : 1}
      fontSize={isSelected ? 9.5 : 9}
      fill="white" fillOpacity={isSelected ? 0.97 : 0.88}
      fontWeight={isSelected ? 700 : 600}
      fontFamily="ui-sans-serif, sans-serif"
      dominantBaseline="middle"
      style={TS}
    >
      {displayTitle}
    </text>

    {/* Tagline */}
    {hasTag && (
      <text
        x={textX} y={7}
        fontSize={isSelected ? 7.5 : 7}
        fill={color} fillOpacity={isSelected ? 0.88 : 0.65}
        fontFamily="ui-sans-serif, sans-serif"
        dominantBaseline="middle"
        style={TS}
      >
        {displayTag}
      </text>
    )}
  </>);
}

// ── SelectedThumbnailHero ─────────────────────────────────────────────────────
// A larger, standalone thumbnail panel shown above the card when a node is
// selected and a real thumbnail is available. Gives the selected node much
// more visual weight — feels like a real place from internet history.

export function SelectedThumbnailHero({
  slug, color, thumbnailPath,
}: {
  slug: string; color: string; thumbnailPath: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const clipId = `hero-${slug}`;
  const W = 80, H = 52;

  if (imgFailed) return null;

  return (
    <g transform={`translate(0,${-(H / 2) - 24})`}>
      <defs>
        <clipPath id={clipId}>
          <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={5}/>
        </clipPath>
      </defs>
      <rect x={-W / 2 - 3} y={-H / 2 - 3} width={W + 6} height={H + 6} rx={7}
        fill={color} fillOpacity={0.18}
        stroke={color} strokeOpacity={0.55} strokeWidth={1}
      />
      <image
        href={thumbnailPath}
        x={-W / 2} y={-H / 2} width={W} height={H}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
        onError={() => setImgFailed(true)}
      />
      {/* Subtle vignette to blend into the node */}
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={5}
        fill="url(#atlas-grid)" fillOpacity={0.04}
        stroke={color} strokeOpacity={0.32} strokeWidth={0.7}
      />
    </g>
  );
}

// ── BadgeNode ─────────────────────────────────────────────────────────────────
// Compact pill for badge-type nodes and icon nodes at medium zoom.
// Centered at (0,0) in canvas coords.

export function BadgeNode({
  slug, color, title, isSelected, isHovered, isConnected,
}: {
  slug: string; color: string; title: string;
  isSelected: boolean; isHovered: boolean; isConnected: boolean;
}) {
  const BW = 36;
  const BH = 11;
  const IR = 8;
  const displayTitle = title.length > 13 ? title.slice(0, 12) + '…' : title;

  return (<>
    {isSelected && (
      <circle r={BW + 16} fill="none" stroke={color} strokeOpacity={0.09} strokeWidth={0.6}/>
    )}
    {(isSelected || isHovered || isConnected) && (
      <rect x={-BW - 6} y={-BH - 6} width={(BW + 6)*2} height={(BH + 6)*2} rx={BH + 6}
        fill={color} fillOpacity={isSelected ? 0.12 : 0.06}
        stroke={color} strokeOpacity={isSelected ? 0.38 : 0.16} strokeWidth={0.6}
      />
    )}
    <rect x={-BW} y={-BH} width={BW*2} height={BH*2} rx={BH}
      fill={color}
      fillOpacity={isSelected ? 0.26 : isHovered ? 0.18 : isConnected ? 0.12 : 0.09}
      stroke={color}
      strokeOpacity={isSelected ? 0.92 : isHovered ? 0.62 : 0.28}
      strokeWidth={isSelected ? 1.6 : 1}
    />
    <circle cx={-BW + IR + 3} cy={0} r={IR} fill={color} fillOpacity={0.28}/>
    <g transform={`translate(${-BW + IR + 3},0)`}>
      <ArtifactIcon slug={slug} color="white" r={IR * 0.82} title={title}/>
    </g>
    <text
      x={-BW + IR * 2 + 9} y={1}
      fontSize={8.5}
      fill="white" fillOpacity={isSelected ? 0.95 : 0.82}
      fontWeight={isSelected ? 700 : 600}
      fontFamily="ui-sans-serif,sans-serif"
      dominantBaseline="middle"
      style={TS}
    >
      {displayTitle}
    </text>
  </>);
}
