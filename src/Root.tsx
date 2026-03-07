import React from "react";
import { Composition } from "remotion";
import { FinanceVideo } from "./FinanceVideo";
import { CapitalComAd } from "./CapitalComAd";
import { PremiumVertical } from "./PremiumVertical";
import { AwardWinningVertical } from "./AwardWinningVertical";
import { AwardWinningSquare } from "./AwardWinningSquare";

// ─── Duration calculations ────────────────────────────────────────────────────
// ProVertical / ProSquare / ProLandscape: 5 scenes × 180 frames = 900 frames @ 30fps (30s)
// PremiumVertical: 870 frames ≈ 29s (old Capital.com preset — still works)
// FinanceVideo / CapitalComAd: legacy landscape formats

export const RemotionRoot = () => (
  <>
    {/* ══════════════════════════════════════════════════════════
        NEW PRO SYSTEM — driven by video.config.json (5-scene schema)
        Use /generate <topic> to populate then /render to re-render
        ══════════════════════════════════════════════════════════ */}

    {/* 9:16 VERTICAL — Instagram Reels / TikTok / Stories */}
    <Composition
      id="ProVertical"
      component={AwardWinningVertical}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* 1:1 SQUARE — Instagram Feed / LinkedIn */}
    <Composition
      id="ProSquare"
      component={AwardWinningSquare}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1080}
    />

    {/* 16:9 LANDSCAPE — YouTube pre-roll / Facebook / LinkedIn video */}
    {/* Uses same AwardWinningVertical component — Remotion scales it to 1920×1080 */}
    <Composition
      id="ProLandscape"
      component={AwardWinningVertical}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />

    {/* ══════════════════════════════════════════════════════════
        LEGACY — Original Capital.com-style preset (old schema)
        These still work — use /market uae or /market global
        ══════════════════════════════════════════════════════════ */}

    {/* 9:16 VERTICAL — Capital.com premium preset */}
    <Composition
      id="PremiumVertical"
      component={PremiumVertical}
      durationInFrames={870}
      fps={30}
      width={1080}
      height={1920}
    />

    {/* 16:9 LANDSCAPE — Generic social media */}
    <Composition
      id="FinanceVideo"
      component={FinanceVideo}
      durationInFrames={880}
      fps={30}
      width={1920}
      height={1080}
    />

    {/* 16:9 LANDSCAPE — Capital.com specific */}
    <Composition
      id="CapitalComAd"
      component={CapitalComAd}
      durationInFrames={842}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
