/**
 * CapitalComAd.tsx — 9-beat Capital.com Instagram/Facebook ad
 * Shows Stop Loss, Take Profit, Price Alerts from the Capital.com mobile app.
 *
 * Uses plain overlapping Sequence instead of TransitionSeries (which caused
 * a Remotion bundler null-props crash). Each beat's internal wrap() handles
 * its own fade-in (frames 0-10) and fade-out (exitAt → dur).
 *
 * Beat timing (30fps):
 *   Beat 1:  Intro         from=0   dur=100 wrap(100,88) exits at 88
 *   Beat 2:  Stop Loss     from=88  dur=100 exits at 88 → next at 176
 *   Beat 3:  Take Profit   from=176 dur=100 exits at 88 → next at 264
 *   Beat 4:  Alerts        from=264 dur=100 exits at 88 → next at 352
 *   Beat 5:  Guaranteed    from=352 dur=90  wrap(90,78) exits at 78 → 430
 *   Beat 6:  All In One    from=430 dur=110 wrap(110,96) exits at 96 → 526
 *   Beat 7:  Social Proof  from=526 dur=90  exits at 78 → 604
 *   Beat 8:  CTA           from=604 dur=160 wrap(160,148) exits at 148 → 752
 *   Beat 9:  Brand End     from=752 dur=90
 *   Total: 842 frames ≈ 28.1s @ 30fps
 */

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  CapBeat1Intro,
  CapBeat2StopLoss,
  CapBeat3TakeProfit,
  CapBeat4Alerts,
  CapBeat5Guaranteed,
  CapBeat6AllInOne,
  CapBeat7Proof,
  CapBeat8CTA,
  CapBeat9Brand,
} from "./scenes/CapitalComBeats";

// ─── Background constants ─────────────────────────────────────────────────────
const BG = "#060c15";

// ─── Beat manifest ────────────────────────────────────────────────────────────
// Each beat starts at the previous beat's exitAt frame (absolute).
// This creates a natural cross-dissolve: outgoing beat fades out while
// incoming beat fades in — no TransitionSeries needed.

const BEATS = [
  { Component: CapBeat1Intro,      from: 0,   dur: 100 },
  { Component: CapBeat2StopLoss,   from: 88,  dur: 100 },
  { Component: CapBeat3TakeProfit, from: 176, dur: 100 },
  { Component: CapBeat4Alerts,     from: 264, dur: 100 },
  { Component: CapBeat5Guaranteed, from: 352, dur: 90  },
  { Component: CapBeat6AllInOne,   from: 430, dur: 110 },
  { Component: CapBeat7Proof,      from: 526, dur: 90  },
  { Component: CapBeat8CTA,        from: 604, dur: 160 },
  { Component: CapBeat9Brand,      from: 752, dur: 90  },
] as const;

export const CapitalComAd = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Subtle Capital.com brand background */}
      {/* Green dot grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.018,
          backgroundImage:
            "radial-gradient(circle, rgba(0,184,153,0.8) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Top-center ambient green glow */}
      <div
        style={{
          position: "absolute",
          top: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 700,
          background:
            "radial-gradient(circle, rgba(0,184,153,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* All beats as plain Sequences — no TransitionSeries */}
      {BEATS.map(({ Component, from, dur }, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Component />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
