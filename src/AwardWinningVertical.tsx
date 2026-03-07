// ── Award Winning Vertical ────────────────────────────────────────────────────
// 1080×1920 (9:16) — 900 frames @ 30fps = 30 seconds
// 5 Scenes × 180 frames (6s each) — fully driven by video.config.json
//
// CRITICAL: This composition reads from video.config.json at bundle time.
// When /generate saves a new config, the next render picks it up automatically.

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1 } from "./scenes/AwardScene1";
import { Scene2 } from "./scenes/AwardScene2";
import { Scene3 } from "./scenes/AwardScene3";
import { Scene4 } from "./scenes/AwardScene4";
import { Scene5 } from "./scenes/AwardScene5";
import { CinematicBackground } from "./scenes/CinematicBackground";
import { defaultAwardConfig, AwardWinningConfig, ActionableScene, SceneColors } from "./types/AwardTypes";

// ── Read video.config.json ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rawConfig = require("../video.config.json");

function resolveConfig(): { scenes: ActionableScene[]; colors: SceneColors; brand: string } {
    const cfg = rawConfig as Partial<AwardWinningConfig>;

    const colors: SceneColors = {
        bg:        cfg.colors?.bg        || defaultAwardConfig.colors.bg,
        primary:   cfg.colors?.primary   || defaultAwardConfig.colors.primary,
        secondary: cfg.colors?.secondary || defaultAwardConfig.colors.secondary,
    };

    // scenes[] from new schema — fall back to defaultAwardConfig scenes
    const rawScenes = Array.isArray(cfg.scenes) && cfg.scenes.length === 5
        ? cfg.scenes
        : defaultAwardConfig.scenes;

    // Ensure every scene has the required fields
    const scenes: ActionableScene[] = rawScenes.map((s, i) => ({
        id:                          s.id                          ?? i + 1,
        voiceover_text:              s.voiceover_text              ?? defaultAwardConfig.scenes[i]?.voiceover_text       ?? "",
        visual_description:          s.visual_description          ?? defaultAwardConfig.scenes[i]?.visual_description   ?? "",
        motion_graphics_instruction: s.motion_graphics_instruction ?? defaultAwardConfig.scenes[i]?.motion_graphics_instruction ?? "",
        background_style:            s.background_style            ?? defaultAwardConfig.scenes[i]?.background_style     ?? "",
        transition:                  s.transition                  ?? "",
    }));

    const brand = (cfg.brand || defaultAwardConfig.brand).trim();

    return { scenes, colors, brand };
}

export const AwardWinningVertical = () => {
    const { scenes, colors, brand } = resolveConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: colors.bg }}>

            {/* Global animated background — persists across all scenes */}
            <CinematicBackground colors={colors} />

            {/* Scene 1: Hook (0–6s) */}
            <Sequence from={0} durationInFrames={180}>
                <Scene1 scene={scenes[0]} colors={colors} brand={brand} />
            </Sequence>

            {/* Scene 2: Market / Data (6–12s) */}
            <Sequence from={180} durationInFrames={180}>
                <Scene2 scene={scenes[1]} colors={colors} brand={brand} />
            </Sequence>

            {/* Scene 3: Feature 1 / Action (12–18s) */}
            <Sequence from={360} durationInFrames={180}>
                <Scene3 scene={scenes[2]} colors={colors} brand={brand} />
            </Sequence>

            {/* Scene 4: Feature 2 / Stats (18–24s) */}
            <Sequence from={540} durationInFrames={180}>
                <Scene4 scene={scenes[3]} colors={colors} brand={brand} />
            </Sequence>

            {/* Scene 5: Brand / CTA (24–30s) */}
            <Sequence from={720} durationInFrames={180}>
                <Scene5 scene={scenes[4]} colors={colors} brand={brand} />
            </Sequence>

        </AbsoluteFill>
    );
};
