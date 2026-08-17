/**
 * A fixed, non-interactive film-grain overlay for subtle texture across the
 * whole viewport. The noise is an inline SVG data URI, so there is no network
 * request. Sits above content but never intercepts pointer events.
 */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`,
  );

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "140px 140px" }}
    />
  );
}
