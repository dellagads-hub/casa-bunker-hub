import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', withGlow = false, className = '' }) => {
  const sizeMap = {
    sm: 'w-10 h-10 sm:w-12 sm:h-12',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    xl: 'w-44 h-44 sm:w-52 sm:h-52',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Soft Ambient Glow (Optional) */}
      {withGlow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle, rgba(186, 119, 56, 0.45) 0%, rgba(40, 66, 51, 0.2) 70%, transparent 100%)',
          }}
        />
      )}

      {/* Official Casa Búnker Vector Emblem matching reference */}
      <svg
        viewBox="0 0 500 500"
        className={`${sizeMap[size]} relative z-10 transition-transform duration-300 hover:scale-105`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="logo-drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#284233" floodOpacity="0.18" />
          </filter>
          {/* Path for curved text "BAR Y CAFÉ" */}
          <path
            id="bar-cafe-arc"
            d="M 120 380 A 185 185 0 0 0 380 380"
            fill="none"
          />
        </defs>

        {/* Outer Circular Ring (Forest Green #284233) with Soft Cream Fill (#F4ECE1) */}
        <circle
          cx="250"
          cy="250"
          r="234"
          fill="#F5EFE6"
          stroke="#284233"
          strokeWidth="20"
          filter="url(#logo-drop-shadow)"
        />

        {/* Inner Thin Concentric Border */}
        <circle
          cx="250"
          cy="250"
          r="214"
          fill="none"
          stroke="#284233"
          strokeWidth="3.5"
          opacity="0.95"
        />

        {/* --- MONOGRAM 'bk' & BEER TAP EMBLEM --- */}
        <g transform="translate(155, 60)">
          {/* Stylized 'b' (Dark Forest Green #284233) */}
          <path
            d="M 6 15 
               H 40 
               V 78 
               C 56 60, 84 62, 98 78 
               C 114 96, 114 124, 98 142 
               C 82 160, 48 160, 6 160 
               Z 
               M 40 128 
               C 62 128, 76 126, 76 110 
               C 76 94, 62 92, 40 92 
               Z"
            fill="#284233"
          />

          {/* Beer Tap Handle in the middle (Caramel Ochre #BA7738) */}
          <g transform="translate(93, 2)">
            {/* Wooden Handle */}
            <rect
              x="0"
              y="0"
              width="22"
              height="52"
              rx="9"
              fill="#BA7738"
              stroke="#8E5419"
              strokeWidth="1.5"
            />
            {/* Wooden Grain Highlight */}
            <path
              d="M 5 8 H 17 V 44 H 5 Z"
              fill="#D99B5B"
              opacity="0.35"
            />
            {/* Tap Mechanism Collar */}
            <circle
              cx="11"
              cy="62"
              r="6.5"
              fill="#BA7738"
              stroke="#8E5419"
              strokeWidth="1.5"
            />
            {/* Tap Spout / Pivot */}
            <rect x="8.5" y="65" width="5" height="18" fill="#BA7738" />
            <path d="M 11 83 L 14 100 L 8 100 Z" fill="#BA7738" />
          </g>

          {/* Stylized 'k' (Caramel Ochre #BA7738) */}
          <path
            d="M 115 65 
               H 168 
               L 128 108 
               L 178 158 
               H 136 
               L 106 122 
               V 158 
               H 98 
               V 112 
               Z"
            fill="#BA7738"
          />
        </g>

        {/* --- BRAND TEXT: "CASA BUNKER" --- */}
        <text
          x="250"
          y="298"
          textAnchor="middle"
          fill="#284233"
          fontSize="46"
          fontFamily="'Playfair Display', serif"
          fontWeight="800"
          letterSpacing="3"
        >
          CASA BUNKER
        </text>

        {/* --- HOP & COFFEE SEAL WITH FLANKING ACCENT LINES --- */}
        <g transform="translate(0, 8)">
          {/* Left Warm Ochre Accent Lines */}
          <line
            x1="80"
            y1="328"
            x2="195"
            y2="328"
            stroke="#BA7738"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="341"
            x2="192"
            y2="341"
            stroke="#BA7738"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="140"
            y1="353"
            x2="188"
            y2="353"
            stroke="#BA7738"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Warm Ochre Accent Lines */}
          <line
            x1="305"
            y1="328"
            x2="420"
            y2="328"
            stroke="#BA7738"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line
            x1="308"
            y1="341"
            x2="390"
            y2="341"
            stroke="#BA7738"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="312"
            y1="353"
            x2="360"
            y2="353"
            stroke="#BA7738"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Center Round Hop & Coffee Badge */}
          <circle
            cx="250"
            cy="340"
            r="42"
            fill="#F5EFE6"
            stroke="#284233"
            strokeWidth="2.5"
          />
          <circle
            cx="250"
            cy="340"
            r="38"
            fill="none"
            stroke="#284233"
            strokeWidth="1"
            strokeDasharray="3 2.5"
          />

          {/* Hop Cone (Left) & Coffee Beans (Right) Illustration */}
          <g transform="translate(220, 318)">
            {/* Hop Cone Left */}
            <g transform="translate(4, 3) scale(0.68)">
              <path
                d="M 18 38 C 7 28, 7 14, 18 4 C 29 14, 29 28, 18 38 Z"
                fill="#284233"
                opacity="0.9"
              />
              <path
                d="M 10 28 C 4 20, 4 10, 10 4 C 16 10, 16 20, 10 28 Z"
                fill="#284233"
                opacity="0.75"
              />
              <path
                d="M 26 28 C 20 20, 20 10, 26 4 C 32 10, 32 20, 26 28 Z"
                fill="#284233"
                opacity="0.75"
              />
            </g>

            {/* Coffee Beans Right */}
            <g transform="translate(38, 6) rotate(22) scale(0.85)">
              <ellipse cx="12" cy="15" rx="8" ry="12" fill="#284233" />
              <path
                d="M 12 4 C 8 10, 15 19, 12 26"
                stroke="#F5EFE6"
                strokeWidth="1.8"
                fill="none"
              />
            </g>
          </g>
        </g>

        {/* --- BOTTOM CURVED TEXT: "BAR Y CAFÉ" --- */}
        <text
          fill="#284233"
          fontSize="24"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          letterSpacing="7"
        >
          <textPath
            href="#bar-cafe-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            BAR Y CAFÉ
          </textPath>
        </text>
      </svg>
    </div>
  );
};
