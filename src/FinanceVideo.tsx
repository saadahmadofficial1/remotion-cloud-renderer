/**
 * FinanceVideo.tsx — 10-beat social media ad (16:9 landscape)
 *
 * Uses plain overlapping Sequence components instead of TransitionSeries.
 * TransitionSeries caused a Remotion bundler null-props crash — this approach
 * is 100% reliable. Each beat's internal sceneWrap() handles its own fade-in
 * (frames 0-10) and fade-out (exitAt → dur), so cross-fades happen naturally
 * when two sequences overlap at each beat's exitAt point.
 *
 * Beat timing (30fps):
 *   Beat 1:  Hook          from=0   dur=90  (exits at 78, next starts at 78)
 *   Beat 2:  Problem       from=78  dur=90  (exits at 78, next at 156)
 *   Beat 3:  Stop Loss     from=156 dur=90  (exits at 78, next at 234)
 *   Beat 4:  Take Profit   from=234 dur=90  (exits at 78, next at 312)
 *   Beat 5:  Alerts        from=312 dur=90  (exits at 78, next at 390)
 *   Beat 6:  Guaranteed    from=390 dur=90  (exits at 78, next at 468)
 *   Beat 7:  Demo          from=468 dur=110 (exits at 96, next at 564)
 *   Beat 8:  Proof         from=564 dur=90  (exits at 78, next at 642)
 *   Beat 9:  CTA           from=642 dur=160 (exits at 148, next at 790)
 *   Beat 10: Brand         from=790 dur=90
 *   Total: 880 frames ≈ 29.3s @ 30fps
 */

import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { AnimatedBackground } from "./scenes/AnimatedBackground";
import {
  Beat1Hook,
  Beat2Problem,
  Beat3StopLoss,
  Beat4TakeProfit,
  Beat5Alerts,
  Beat6Guaranteed,
  Beat7Demo,
  Beat8Proof,
  Beat9CTA,
  Beat10Brand,
} from "./scenes/SocialBeats";

// ─── Beat manifest ────────────────────────────────────────────────────────────
// `from`  = absolute frame at which this beat becomes active
// `dur`   = total duration of this beat (matches sceneWrap totalDuration)
// Each beat starts at the previous beat's sceneWrap exitAt frame, creating
// a natural dissolve: outgoing beats fades out while incoming fades in.

const BEATS = [
  { Component: Beat1Hook,       from: 0,   dur: 90  },
  { Component: Beat2Problem,    from: 78,  dur: 90  },
  { Component: Beat3StopLoss,   from: 156, dur: 90  },
  { Component: Beat4TakeProfit, from: 234, dur: 90  },
  { Component: Beat5Alerts,     from: 312, dur: 90  },
  { Component: Beat6Guaranteed, from: 390, dur: 90  },
  { Component: Beat7Demo,       from: 468, dur: 110 },
  { Component: Beat8Proof,      from: 564, dur: 90  },
  { Component: Beat9CTA,        from: 642, dur: 160 },
  { Component: Beat10Brand,     from: 790, dur: 90  },
] as const;

export const FinanceVideo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      {/* Persistent animated bg — Perlin-noise particles + candlestick chart */}
      <AnimatedBackground frame={frame} />

      {/* All beats as plain Sequences — each manages its own opacity */}
      {BEATS.map(({ Component, from, dur }, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Component />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
