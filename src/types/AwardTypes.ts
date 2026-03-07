// ── Types for the 5-scene Elite Scriptwriter JSON structure ──────────────────

export type ActionableScene = {
  id: number;
  voiceover_text: string;
  visual_description: string;
  motion_graphics_instruction: string;
  background_style: string;
  transition: string;
};

export type SceneColors = {
  bg: string;
  primary: string;
  secondary: string;
};

export type AwardWinningConfig = {
  topic: string;
  concept: string;
  brand: string;
  colors: SceneColors;
  scenes: ActionableScene[];
  // Old-schema compat fields (PremiumVertical still uses these)
  hook?: string;
  subhook?: string;
  cta?: string;
  ctaUrl?: string;
};

// Props interface used by every AwardScene component
export type SceneProps = {
  scene: ActionableScene;
  colors: SceneColors;
  brand: string;
};

// ── Default fallback (shown only if video.config.json is missing) ─────────────
export const defaultAwardConfig: AwardWinningConfig = {
  topic: "Bitcoin 200k",
  concept: "A cinematic trading platform video about Bitcoin's rise.",
  brand: "Apex Finance",
  colors: {
    bg: "#05050f",
    primary: "#00ffd0",
    secondary: "#ffffff",
  },
  scenes: [
    {
      id: 1,
      voiceover_text: "BITCOIN WAS ONCE JUST AN IDEA.",
      visual_description:
        "A single glowing Bitcoin coin slowly appears in a dark digital space.",
      motion_graphics_instruction: "Particles forming the Bitcoin symbol.",
      background_style: "Dark cinematic technology background.",
      transition: "Soft glow expansion.",
    },
    {
      id: 2,
      voiceover_text: "TODAY IT MOVES BILLIONS.",
      visual_description:
        "3D world map with glowing network lines connecting major cities.",
      motion_graphics_instruction:
        "Light pulses traveling across the map representing transactions.",
      background_style: "Futuristic digital grid background.",
      transition: "Camera zoom toward a rising chart.",
    },
    {
      id: 3,
      voiceover_text: "THE MOMENTUM IS UNSTOPPABLE.",
      visual_description: "Animated candlestick chart rising dramatically upward.",
      motion_graphics_instruction: "Floating price labels increasing rapidly.",
      background_style: "Minimal dark trading interface background.",
      transition: "Quick upward motion blur.",
    },
    {
      id: 4,
      voiceover_text: "200K IS NOT IMPOSSIBLE.",
      visual_description: "3D Bitcoin rotating while a glowing number appears.",
      motion_graphics_instruction:
        "Numbers rapidly counting upward until reaching 200000.",
      background_style: "Futuristic dark gradient environment.",
      transition: "Bright flash transition.",
    },
    {
      id: 5,
      voiceover_text: "START TRADING NOW.",
      visual_description:
        "Brand logo entering with glowing light sweep.",
      motion_graphics_instruction: "Light rays expanding outward from behind the logo.",
      background_style: "Minimal plain background.",
      transition: "Fade to black.",
    },
  ],
};
