/**
 * fonts.ts — centralized font loading for all Remotion videos
 *
 * Plus Jakarta Sans = Gilroy equivalent (Capital.com uses Gilroy)
 *   - Weights: 300 (light), 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)
 *   - Used for all display/body text
 *
 * Space Grotesk = techy monospace-adjacent for data/numbers
 *   - Used for prices, stats, code-style labels
 *
 * loadFont() must be called at module level (not inside components).
 * Import { FONT_DISPLAY, FONT_MONO } in your scene files.
 */

import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

// ─── Load fonts at module level ───────────────────────────────────────────────
const { fontFamily: _displayFont } = loadJakarta("normal", {
  weights: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});

const { fontFamily: _monoFont } = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// ─── Exports ──────────────────────────────────────────────────────────────────
export const FONT_DISPLAY = _displayFont; // 'Plus Jakarta Sans'
export const FONT_MONO    = _monoFont;    // 'Space Grotesk'
