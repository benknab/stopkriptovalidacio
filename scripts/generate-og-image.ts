import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

function stringToUint8Array(str: string): Uint8Array {
	return new TextEncoder().encode(str);
}

// Brand color from styles.css: oklch(54.6% 0.245 262.881)
// Converted to hex for SVG compatibility
const BRAND = "#4a5de8";
const BRAND_DARK = "#3448c9";

// Create SVG with the OG image design - text only, brand colors
const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND}"/>
      <stop offset="100%" style="stop-color:${BRAND_DARK}"/>
    </linearGradient>
  </defs>

  <!-- Background with brand gradient -->
  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- Main title -->
  <text x="600" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="80" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Stop Kriptovalidáció
  </text>

  <!-- Subtitle -->
  <text x="600" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="rgba(255,255,255,0.85)" text-anchor="middle">
    Magyar Kriptovaluta Validáció Törvény Idővonal
  </text>

  <!-- URL -->
  <text x="600" y="520" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="rgba(255,255,255,0.6)" text-anchor="middle">
    stopkriptovalidacio.hu
  </text>
</svg>
`;

async function generateOgImage(): Promise<void> {
	const outputPath = "static/og-image.png";

	await sharp(stringToUint8Array(svg)).png().toFile(outputPath);

	console.log(`OG image generated: ${outputPath}`);
}

generateOgImage().catch(console.error);
