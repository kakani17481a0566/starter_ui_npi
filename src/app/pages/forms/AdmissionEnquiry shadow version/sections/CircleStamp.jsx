// CircleStamp.jsx
import  { useId } from "react";

/**
 * CircleStamp – a customizable circular stamp SVG.
 *
 * Props
 * -----
 * size: number               // rendered px size (width/height). Default: 240
 * color: string              // stroke/text color. Default: '#1554c1'
 * topText: string            // curved text on the top arc
 * bottomText: string         // curved text on the bottom arc
 * showInnerCircle: boolean   // show the inner ring. Default: true
 * outerStroke: number        // outer ring stroke width (viewBox units). Default: 18
 * ringStroke: number         // inner/middle ring stroke width. Default: 10
 * textSize: number           // font size for both arcs. Default: 42
 * letterSpacing: number      // letter spacing for both arcs. Default: 1.5
 * fontWeight: number|string  // weight for arc text. Default: 700
 * fontFamily: string         // font family for arc text
 * centerText: string|null    // optional text in the middle
 * centerTextSize: number     // font size for center text. Default: 24
 * rough: boolean             // add subtle ink roughness. Default: false
 * title: string              // accessible label for the SVG <title>
 */
export default function CircleStamp({
  size = 240,
  color = "#1554c1",
  topText = "★ MY School ITALY ★",
  bottomText = "★ MINDSPACE ★",
  showInnerCircle = true,
  outerStroke = 18,
  ringStroke = 10,
  textSize = 42,
  letterSpacing = 1.5,
  fontWeight = 700,
  fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Noto Sans", "Liberation Sans", sans-serif',
  centerText = null,
  centerTextSize = 24,
  rough = false,
  title = "Circular stamp",
}) {
  // Unique IDs so multiple stamps on one page don't collide
  const uid = useId();
  const arcTopId = `textArcTop-${uid}`;
  const arcBottomId = `textArcBottom-${uid}`;
  const roughFilterId = `ink-${uid}`;

  // Stamp geometry (in a 600x600 viewBox)
  const VB = { w: 600, h: 600, cx: 300, cy: 300 };
  const outerR = 250;       // outer ring radius
  const midR = 230;         // middle ring radius
  const innerR = 120;       // inner ring radius
  const textR = 210;        // radius on which the curved text sits

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${uid}-title`}
      focusable="false"
    >
      <title id={`${uid}-title`}>{title}</title>

      <defs>
        {/* Text arcs */}
        <path id={arcTopId} d={`M${VB.cx},${VB.cy} m -${textR},0 a ${textR},${textR} 0 0 1 ${textR * 2},0`} />
        <path id={arcBottomId} d={`M${VB.cx},${VB.cy} m -${textR},0 a ${textR},${textR} 0 0 0 ${textR * 2},0`} />

        {rough && (
          <filter id={roughFilterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        )}
      </defs>

      {/* Rings */}
      <circle
        cx={VB.cx}
        cy={VB.cy}
        r={outerR}
        fill="none"
        stroke={color}
        strokeWidth={outerStroke}
        strokeLinecap="round"
        filter={rough ? `url(#${roughFilterId})` : undefined}
      />
      <circle cx={VB.cx} cy={VB.cy} r={midR} fill="none" stroke={color} strokeWidth={ringStroke} />
      {showInnerCircle && (
        <circle cx={VB.cx} cy={VB.cy} r={innerR} fill="none" stroke={color} strokeWidth={ringStroke} />
      )}

      {/* Curved text */}
      <text
        fill={color}
        fontSize={textSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        fontFamily={fontFamily}
      >
        <textPath href={`#${arcTopId}`} startOffset="50%" textAnchor="middle">
          {topText}
        </textPath>
      </text>

      <text
        fill={color}
        fontSize={textSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        fontFamily={fontFamily}
      >
        <textPath href={`#${arcBottomId}`} startOffset="50%" textAnchor="middle">
          {bottomText}
        </textPath>
      </text>

      {/* Center text (optional) */}
      {centerText && (
        <text
          x={VB.cx}
          y={VB.cy + centerTextSize / 3}
          fill={color}
          fontSize={centerTextSize}
          fontWeight={700}
          letterSpacing="1"
          textAnchor="middle"
          fontFamily={fontFamily}
        >
          {centerText}
        </text>
      )}
    </svg>
  );
}
