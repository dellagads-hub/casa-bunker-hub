import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', withGlow = false, className = '' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Soft Ambient Glow (Optional) */}
      {withGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none transition-opacity duration-500"
          style={{ background: 'radial-gradient(circle, rgba(186, 119, 56, 0.4) 0%, rgba(40, 66, 51, 0.2) 70%, transparent 100%)' }}
        />
      )}

      {/* Official Casa Bunker Round Emblem */}
      <svg
        viewBox="0 0 500 500"
        className={`${sizeMap[size]} relative z-10 transition-transform duration-300 hover:scale-105`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle drop shadow */}
          <filter id="bunker-logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#284233" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Circular Ring (Forest Green #284233) */}
        <circle cx="250" cy="250" r="236" fill="#F2E7D8" stroke="#284233" strokeWidth="22" filter="url(#bunker-logo-shadow)" />

        {/* Inner Thin Concentric Border */}
        <circle cx="250" cy="250" r="215" fill="none" stroke="#284233" strokeWidth="3.5" opacity="0.9" />

        {/* MONOGRAM 'bk' & BEER TAP EMBLEM */}
        <g transform="translate(155, 60)">
          {/* Letter 'b' (Dark Forest Green #284233) */}
          <path
            d="M 0 20 L 38 20 L 38 82 C 55 62 82 62 100 78 C 118 94 118 122 100 142 C 82 162 48 162 0 162 Z M 38 132 C 58 132 78 132 78 112 C 78 92 58 92 38 92 Z"
            fill="#284233"
          />

          {/* Beer Tap Handle (Wood & Ochre #BA7738) */}
          <g transform="translate(93, 2)">
            {/* Wooden Handle Body */}
            <rect x="0" y="0" width="22" height="52" rx="10" fill="#BA7738" stroke="#8E5419" strokeWidth="1.5" />
            <path d="M 4 8 L 18 8 L 18 44 L 4 44 Z" fill="#D39252" opacity="0.3" />
            {/* Metal Connection & Tap Spout */}
            <circle cx="11" cy="62" r="7" fill="#BA7738" stroke="#8E5419" strokeWidth="1.5" />
            <rect x="8" y="65" width="6" height="18" fill="#BA7738" />
            <path d="M 11 83 L 14 102 L 8 102 Z" fill="#BA7738" />
          </g>

          {/* Letter 'k' (Caramel Ochre #BA7738) */}
          <path
            d="M 115 68 L 175 68 L 132 112 L 186 162 L 144 162 L 110 126 Z"
            fill="#BA7738"
          />
        </g>

        {/* BRAND TEXT: "CASA BUNKER" (Forest Green #284233) */}
        <text
          x="250"
          y="302"
          textAnchor="middle"
          fill="#284233"
          fontSize="48"
          fontFamily="'Playfair Display', 'Cinzel', serif"
          fontWeight="800"
          letterSpacing="4"
        >
          CASA BUNKER
        </text>

        {/* HOP & COFFEE SEAL WITH FLANKING ACCENT LINES */}
        <g transform="translate(0, 10)">
          {/* Left Warm Ochre Accent Lines */}
          <line x1="80" y1="328" x2="195" y2="328" stroke="#BA7738" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="110" y1="342" x2="190" y2="342" stroke="#BA7738" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="140" y1="355" x2="185" y2="355" stroke="#BA7738" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Warm Ochre Accent Lines */}
          <line x1="305" y1="328" x2="420" y2="328" stroke="#BA7738" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="310" y1="342" x2="390" y2="342" stroke="#BA7738" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="315" y1="355" x2="360" y2="355" stroke="#BA7738" strokeWidth="2.5" strokeLinecap="round" />

          {/* Center Round Hop & Coffee Badge */}
          <circle cx="250" cy="342" r="44" fill="#F2E7D8" stroke="#284233" strokeWidth="2.5" />
          <circle cx="250" cy="342" r="40" fill="none" stroke="#284233" strokeWidth="1" strokeDasharray="3 3" />

          {/* Hop Cone (Left) & Coffee Beans (Right) Illustration */}
          <g transform="translate(218, 318)">
            {/* Hop Cone Left */}
            <g transform="translate(5, 5) scale(0.65)">
              <path d="M 20 40 C 8 30, 8 16, 20 6 C 32 16, 32 30, 20 40 Z" fill="#284233" opacity="0.9" />
              <path d="M 12 30 C 5 22, 5 12, 12 6 C 18 12, 18 22, 12 30 Z" fill="#284233" opacity="0.75" />
              <path d="M 28 30 C 22 22, 22 12, 28 6 C 35 12, 35 22, 28 30 Z" fill="#284233" opacity="0.75" />
            </g>

            {/* Coffee Beans Right */}
            <g transform="translate(42, 8) rotate(25) scale(0.85)">
              <ellipse cx="12" cy="16" rx="9" ry="13" fill="#284233" />
              <path d="M 12 4 C 8 10, 15 20, 12 28" stroke="#F2E7D8" strokeWidth="2" fill="none" />
            </g>
          </g>
        </g>

        {/* BOTTOM SUBTITLE TEXT: "BAR Y CAFÉ" (Forest Green #284233) */}
        <text
          x="250"
          y="435"
          textAnchor="middle"
          fill="#284233"
          fontSize="26"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="700"
          letterSpacing="8"
        >
          BAR Y CAFÉ
        </text>
      </svg>
    </div>
  );
};

