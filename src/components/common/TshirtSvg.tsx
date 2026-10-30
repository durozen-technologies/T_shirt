import React from 'react';

interface TshirtSvgProps {
  type?: 'round-neck' | 'polo' | 'oversized' | 'hoodie' | 'jersey';
  colorHex?: string;
  className?: string;
  logoDataUrl?: string;
  logoPlacement?: string; // 'Left Chest (Pocket Size)', 'Full Front Graphic', 'Back Large Print', etc.
  logoScale?: number;
  showBackView?: boolean;
}

export const TshirtSvg: React.FC<TshirtSvgProps> = ({
  type = 'round-neck',
  colorHex = '#1e293b',
  className = 'w-full h-full',
  logoDataUrl,
  logoPlacement = 'Left Chest (Pocket Size)',
  logoScale = 1,
  showBackView = false,
}) => {
  // Determine if garment is dark to pick proper seam contrast
  const isDarkColor = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.55;
  };

  const isDark = isDarkColor(colorHex);
  const seamStroke = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.15)';
  const shadowFill = isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.06)';
  const highlightFill = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.3)';
  const ribColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  // Determine logo placement coordinates on standard 400x440 viewport
  const getLogoTransform = () => {
    if (showBackView) {
      if (logoPlacement?.includes('Back') || logoPlacement?.includes('Full Back')) {
        return { x: 140, y: 130, width: 120 * logoScale, height: 120 * logoScale };
      }
      return { x: 160, y: 90, width: 80 * logoScale, height: 40 * logoScale };
    }

    if (logoPlacement?.includes('Left Chest') || logoPlacement?.includes('Pocket')) {
      return { x: 220, y: 125, width: 44 * logoScale, height: 44 * logoScale };
    }
    if (logoPlacement?.includes('Right Sleeve')) {
      return { x: 305, y: 140, width: 36 * logoScale, height: 36 * logoScale };
    }
    if (logoPlacement?.includes('Left Sleeve')) {
      return { x: 60, y: 140, width: 36 * logoScale, height: 36 * logoScale };
    }
    // Full front default
    return { x: 135, y: 140, width: 130 * logoScale, height: 130 * logoScale };
  };

  const logoCoords = getLogoTransform();

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 440"
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-shading-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity={isDark ? '0.1' : '0.2'} />
            <stop offset="50%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity={isDark ? '0.35' : '0.12'} />
          </linearGradient>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity={isDark ? '0.4' : '0.15'} />
          </filter>
        </defs>

        {/* Garment Base Outline Depending on Type */}
        {type === 'polo' ? (
          <g filter="url(#soft-shadow)">
            {/* Sleeves */}
            <path
              d="M 105,75 L 35,130 L 70,175 L 115,145 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            <path
              d="M 295,75 L 365,130 L 330,175 L 285,145 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            {/* Sleeve Ribs */}
            <path d="M 35,130 L 70,175 L 63,182 L 28,137 Z" fill={ribColor} />
            <path d="M 365,130 L 330,175 L 337,182 L 372,137 Z" fill={ribColor} />

            {/* Main Torso */}
            <path
              d="M 105,75 L 115,145 L 118,370 Q 200,380 282,370 L 285,145 L 295,75 Q 245,65 200,80 Q 155,65 105,75 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />

            {/* Shading overlay */}
            <path
              d="M 105,75 L 115,145 L 118,370 Q 200,380 282,370 L 285,145 L 295,75 Q 245,65 200,80 Q 155,65 105,75 Z"
              fill={`url(#grad-shading-${type})`}
            />

            {!showBackView ? (
              <>
                {/* Polo Placket */}
                <rect x="188" y="76" width="24" height="96" fill={colorHex} stroke={seamStroke} strokeWidth="1" />
                <line x1="188" y1="76" x2="188" y2="172" stroke={seamStroke} strokeWidth="1.2" />
                <line x1="212" y1="76" x2="212" y2="172" stroke={seamStroke} strokeWidth="1.2" />
                {/* Buttons */}
                <circle cx="200" cy="98" r="3.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
                <circle cx="200" cy="126" r="3.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
                <circle cx="200" cy="154" r="3.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
                {/* Polo Collars */}
                <path
                  d="M 155,65 Q 185,75 200,82 L 182,120 L 140,70 Z"
                  fill={colorHex}
                  stroke={seamStroke}
                  strokeWidth="1.5"
                  filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.15))"
                />
                <path
                  d="M 245,65 Q 215,75 200,82 L 218,120 L 260,70 Z"
                  fill={colorHex}
                  stroke={seamStroke}
                  strokeWidth="1.5"
                  filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.15))"
                />
              </>
            ) : (
              /* Back Collar */
              <path
                d="M 155,65 Q 200,80 245,65 L 240,78 Q 200,92 160,78 Z"
                fill={ribColor}
                stroke={seamStroke}
                strokeWidth="1"
              />
            )}
          </g>
        ) : type === 'oversized' ? (
          <g filter="url(#soft-shadow)">
            {/* Boxy Drop Shoulder Sleeves */}
            <path
              d="M 90,78 L 15,160 L 60,205 L 122,165 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            <path
              d="M 310,78 L 385,160 L 340,205 L 278,165 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />

            {/* Wide Boxy Torso */}
            <path
              d="M 90,78 L 122,165 L 110,380 L 290,380 L 278,165 L 310,78 Q 250,70 200,72 Q 150,70 90,78 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />

            <path
              d="M 90,78 L 122,165 L 110,380 L 290,380 L 278,165 L 310,78 Q 250,70 200,72 Q 150,70 90,78 Z"
              fill={`url(#grad-shading-${type})`}
            />

            {/* Thick Streetwear Collar Rib */}
            <path
              d={
                showBackView
                  ? 'M 160,72 Q 200,82 240,72 L 238,79 Q 200,89 162,79 Z'
                  : 'M 155,72 Q 200,108 245,72 L 240,66 Q 200,98 160,66 Z'
              }
              fill={ribColor}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
          </g>
        ) : type === 'hoodie' ? (
          <g filter="url(#soft-shadow)">
            {/* Heavy Sleeves with Ribbed Cuffs */}
            <path
              d="M 100,85 L 25,180 L 65,215 L 120,165 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            <path
              d="M 300,85 L 375,180 L 335,215 L 280,165 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            {/* Cuffs */}
            <rect x="23" y="178" width="44" height="38" rx="4" transform="rotate(25 45 197)" fill={ribColor} />
            <rect x="333" y="178" width="44" height="38" rx="4" transform="rotate(-25 355 197)" fill={ribColor} />

            {/* Torso */}
            <path
              d="M 100,85 L 120,165 L 115,365 L 285,365 L 280,165 L 300,85 Q 240,80 200,90 Q 160,80 100,85 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            {/* Bottom Hem Band */}
            <rect x="113" y="365" width="174" height="24" rx="2" fill={ribColor} stroke={seamStroke} strokeWidth="1" />

            {/* Kangaroo Pocket */}
            {!showBackView && (
              <path
                d="M 145,260 L 255,260 L 270,345 L 130,345 Z"
                fill={colorHex}
                stroke={seamStroke}
                strokeWidth="1.5"
                filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.1))"
              />
            )}

            {/* Double Hood */}
            <path
              d="M 140,85 Q 120,30 200,25 Q 280,30 260,85 Q 200,105 140,85 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="2"
            />
            {/* Drawstrings */}
            {!showBackView && (
              <>
                <path d="M 185,95 Q 183,140 180,175" stroke="#cbd5e1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 215,95 Q 217,140 220,170" stroke="#cbd5e1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="180" cy="177" r="2" fill="#64748b" />
                <circle cx="220" cy="172" r="2" fill="#64748b" />
              </>
            )}
          </g>
        ) : type === 'jersey' ? (
          <g filter="url(#soft-shadow)">
            {/* Raglan Athletic Sleeves with sporty color paneling */}
            <path
              d="M 130,68 L 30,120 L 68,170 L 118,138 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            <path
              d="M 270,68 L 370,120 L 332,170 L 282,138 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            {/* Contrast Sport Trim */}
            <path d="M 30,120 L 45,95 L 85,150 L 68,170 Z" fill={highlightFill} />
            <path d="M 370,120 L 355,95 L 315,150 L 332,170 Z" fill={highlightFill} />

            {/* Torso */}
            <path
              d="M 130,68 L 118,138 L 122,370 Q 200,380 278,370 L 282,138 L 270,68 Q 200,85 130,68 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            {/* Side Mesh Panels */}
            <path d="M 118,138 L 122,370 L 132,370 L 126,144 Z" fill={shadowFill} />
            <path d="M 282,138 L 278,370 L 268,370 L 274,144 Z" fill={shadowFill} />

            {/* Athletic V-Neck */}
            <path
              d={
                showBackView
                  ? 'M 160,68 Q 200,78 240,68 L 238,74 Q 200,84 162,74 Z'
                  : 'M 160,68 L 200,102 L 240,68 L 235,63 L 200,94 L 165,63 Z'
              }
              fill={ribColor}
              stroke={seamStroke}
              strokeWidth="1.2"
            />
          </g>
        ) : (
          /* Standard Round Neck T-shirt */
          <g filter="url(#soft-shadow)">
            {/* Left & Right Sleeves */}
            <path
              d="M 110,72 L 32,122 L 72,172 L 120,138 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
            <path
              d="M 290,72 L 368,122 L 328,172 L 280,138 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />

            {/* Torso */}
            <path
              d="M 110,72 L 120,138 L 122,370 Q 200,378 278,370 L 280,138 L 290,72 Q 240,62 200,74 Q 160,62 110,72 Z"
              fill={colorHex}
              stroke={seamStroke}
              strokeWidth="1.5"
            />

            {/* Dynamic Texture/Lighting */}
            <path
              d="M 110,72 L 120,138 L 122,370 Q 200,378 278,370 L 280,138 L 290,72 Q 240,62 200,74 Q 160,62 110,72 Z"
              fill={`url(#grad-shading-${type})`}
            />

            {/* Crewneck Rib Band */}
            <path
              d={
                showBackView
                  ? 'M 160,65 Q 200,78 240,65 L 237,72 Q 200,84 163,72 Z'
                  : 'M 155,66 Q 200,104 245,66 L 240,60 Q 200,94 160,60 Z'
              }
              fill={ribColor}
              stroke={seamStroke}
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* Brand / Custom Logo Overlay */}
        {logoDataUrl ? (
          <image
            href={logoDataUrl}
            x={logoCoords.x}
            y={logoCoords.y}
            width={logoCoords.width}
            height={logoCoords.height}
            preserveAspectRatio="xMidYMid meet"
            className="transition-all duration-200"
          />
        ) : (
          /* Default subtle watermark vector emblem showing customization zone */
          <g
            transform={`translate(${logoCoords.x}, ${logoCoords.y})`}
            className="opacity-75"
          >
            <rect
              x="0"
              y="0"
              width={logoCoords.width}
              height={logoCoords.height}
              rx="6"
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <text
              x={logoCoords.width / 2}
              y={logoCoords.height / 2 + 4}
              fontSize={logoCoords.width > 80 ? '11' : '8'}
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
              textAnchor="middle"
              fill={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
            >
              {showBackView ? 'BACK PRINT' : logoPlacement.includes('Left') ? 'CHEST' : 'BRAND LOGO'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
