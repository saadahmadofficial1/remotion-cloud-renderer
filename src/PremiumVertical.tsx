/**
 * PremiumVertical.tsx — Premium 9:16 vertical finance video
 *
 * Format:   1080 × 1920 px @ 30fps (Instagram Reels / TikTok / Stories)
 * Duration: ~870 frames ≈ 29 seconds
 * Brand:    Capital.com — "Set Your Limits"
 *
 * Architecture:
 *   • PremiumBackground — persistent layer: ambient orbs, noise particles, grain
 *   • 10 beat components via plain overlapping Sequence (no TransitionSeries)
 *   • Each beat manages its own fade-in (0→10) and fade-out (exitAt→dur)
 *     via sceneOp(), so cross-fades happen naturally during sequence overlaps
 *
 * Scene manifest (absolute frames @ 30fps):
 *   Beat 1:  Hook          from=0   dur=90  exitAt=78  → next at 78
 *   Beat 2:  Problem       from=78  dur=90  exitAt=78  → next at 156
 *   Beat 3:  Stop Loss     from=156 dur=90  exitAt=78  → next at 234
 *   Beat 4:  Take Profit   from=234 dur=90  exitAt=78  → next at 312
 *   Beat 5:  Alerts        from=312 dur=90  exitAt=78  → next at 390
 *   Beat 6:  Guaranteed    from=390 dur=90  exitAt=78  → next at 468
 *   Beat 7:  App Showcase  from=468 dur=110 exitAt=96  → next at 564
 *   Beat 8:  Social Proof  from=564 dur=90  exitAt=78  → next at 642
 *   Beat 9:  CTA           from=642 dur=150 exitAt=138 → next at 780
 *   Beat 10: Brand Close   from=780 dur=90
 *   Total:   870 frames ≈ 29s
 */

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { PremiumBackground } from "./scenes/PremiumBeats";
import {
  PBeat1Hook,
  PBeat2Problem,
  PBeat3StopLoss,
  PBeat4TakeProfit,
  PBeat5Alerts,
  PBeat6Guaranteed,
  PBeat7App,
  PBeat8Proof,
  PBeat9CTA,
  PBeat10Brand,
} from "./scenes/PremiumBeats";

// ─── Beat manifest ─────────────────────────────────────────────────────────────
// `from`  = absolute frame at which this beat's Sequence starts
// `dur`   = total duration passed to sceneOp(frame, dur, exitAt) inside the beat
// Beats start at the previous beat's sceneOp `exitAt` frame to create
// a natural cross-dissolve: outgoing fades out while incoming fades in.

const BEATS = [
  { Component: PBeat1Hook,       from: 0,   dur: 90  },
  { Component: PBeat2Problem,    from: 78,  dur: 90  },
  { Component: PBeat3StopLoss,   from: 156, dur: 90  },
  { Component: PBeat4TakeProfit, from: 234, dur: 90  },
  { Component: PBeat5Alerts,     from: 312, dur: 90  },
  { Component: PBeat6Guaranteed, from: 390, dur: 90  },
  { Component: PBeat7App,        from: 468, dur: 110 },
  { Component: PBeat8Proof,      from: 564, dur: 90  },
  { Component: PBeat9CTA,        from: 642, dur: 150 },
  { Component: PBeat10Brand,     from: 780, dur: 90  },
] as const;

export const PremiumVertical = () => {
  return (
    <AbsoluteFill style={{ background: "#05050f", overflow: "hidden" }}>
      {/* Persistent animated background — never stops moving */}
      <PremiumBackground />

      {/* All 10 beats as plain overlapping Sequences */}
      {BEATS.map(({ Component, from, dur }, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Component />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
