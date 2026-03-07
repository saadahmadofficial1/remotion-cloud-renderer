/**
 * SocialBeats.tsx — 10 rapid-fire beats for Instagram/Facebook ad
 * Each beat = ~2-3 seconds (60-90 frames). Pure Capital.com aesthetic.
 * Black background, white/silver/red palette. No teal.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Trail } from "@remotion/motion-blur";
import config from "../../video.config.json";
import { FONT_DISPLAY, FONT_MONO } from "../fonts";

const W = "#ffffff";
const S = "#e0e0e0";   // silver
const R = "#ff3a52";   // red
const D = "rgba(255,255,255,0.22)";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const fadeIn  = (frame: number, start = 0, dur = 12) =>
  interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const slideUp = (frame: number, start = 0, dur = 14) =>
  interpolate(frame - start, [0, dur], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const slideLeft = (frame: number, start = 0, dur = 14) =>
  interpolate(frame - start, [0, dur], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const sceneWrap = (frame: number, totalDuration: number, exitStart: number): number =>
  interpolate(frame, [0, 10, exitStart, totalDuration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

// ─── Beat 1: HOOK — "EVERY TRADE. IS A RISK." ────────────────────────────────
export const Beat1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);

  const s1 = spring({ frame, fps, config: { stiffness: 700, damping: 30 } });
  const s2X = slideLeft(frame, 16);
  const s2Op = fadeIn(frame, 16);
  const qOp  = fadeIn(frame, 38, 16);
  const qY   = slideUp(frame, 38, 16);

  return (
    <AbsoluteFill
      style={{
        opacity: wrap,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* "EVERY TRADE." */}
      <Trail layers={5} lagInFrames={2} trailOpacity={0.18}>
        <div
          style={{
            transform: `scale(${s1})`,
            fontSize: 134,
            fontWeight: 900,
            color: W,
            fontFamily: FONT_DISPLAY,
            letterSpacing: "-0.045em",
            lineHeight: 0.85,
            textTransform: "uppercase",
          }}
        >
          EVERY TRADE.
        </div>
      </Trail>

      {/* "IS A RISK." — slides in red */}
      <div
        style={{
          opacity: s2Op,
          transform: `translateX(${s2X}px)`,
          fontSize: 134,
          fontWeight: 900,
          color: R,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.045em",
          lineHeight: 0.88,
          textTransform: "uppercase",
        }}
      >
        IS A RISK.
      </div>

      {/* Question */}
      <div
        style={{
          opacity: qOp,
          transform: `translateY(${qY}px)`,
          marginTop: 36,
          fontSize: 22,
          color: S,
          fontFamily: FONT_MONO,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
        }}
      >
        ARE YOU PROTECTED?
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 2: PROBLEM — Market crash visual ────────────────────────────────────
export const Beat2Problem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);

  const chartProgress = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });
  const numOp = fadeIn(frame, 20);
  const numY  = slideUp(frame, 20);
  const textOp = fadeIn(frame, 38);
  const textY  = slideUp(frame, 38);

  // Crash chart: rises then drops sharply
  const rawPts = [
    [0, 260], [80, 230], [160, 210], [220, 195], [280, 200],
    [320, 300], [360, 400], [420, 460], [500, 510], [580, 490],
    [660, 460], [740, 430], [820, 400], [900, 370],
  ];
  const vis = Math.max(2, Math.floor(rawPts.length * chartProgress));
  const pts = rawPts.slice(0, vis);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  // Split into "before crash" (0-3) silver, "crash" (3-7) red, "after" silver
  const beforeD = rawPts.slice(0, Math.min(pts.length, 4)).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const crashD  = rawPts.slice(3, Math.min(pts.length, 9)).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const afterD  = pts.length > 8 ? rawPts.slice(8, pts.length).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") : "";

  return (
    <AbsoluteFill style={{ opacity: wrap }}>
      {/* Full-width chart */}
      <div style={{ position: "absolute", bottom: 180, left: 80, right: 80 }}>
        <svg width="100%" height={560} viewBox="0 0 960 560" style={{ overflow: "visible" }}>
          {beforeD && <path d={beforeD} fill="none" stroke={S} strokeWidth={3} strokeLinecap="round" opacity={0.4} />}
          {pts.length > 3 && crashD && (
            <path d={crashD} fill="none" stroke={R} strokeWidth={4} strokeLinecap="round" />
          )}
          {afterD && (
            <path d={afterD} fill="none" stroke={S} strokeWidth={3} strokeLinecap="round" opacity={0.4} />
          )}
          {/* Drop end dot */}
          {pts.length > 6 && (
            <circle cx={pts[Math.min(pts.length - 1, 7)][0]} cy={pts[Math.min(pts.length - 1, 7)][1]} r={6} fill={R} />
          )}
        </svg>
      </div>

      {/* Big loss number */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: numOp,
          transform: `translateY(${numY}px)`,
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 900, color: R, fontFamily: FONT_MONO, letterSpacing: "-0.02em" }}>
          −8.44%
        </div>
        <div style={{ fontSize: 18, color: D, fontFamily: FONT_MONO, letterSpacing: "0.1em", marginTop: 4 }}>
          IN UNDER 60 SECONDS
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOp,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: W, fontFamily: FONT_DISPLAY, letterSpacing: "-0.01em" }}>
          Markets move fast.
        </div>
        <div style={{ fontSize: 20, color: S, fontFamily: FONT_DISPLAY, marginTop: 8, opacity: 0.6 }}>
          Don't get caught without a limit.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 3: STOP LOSS ────────────────────────────────────────────────────────
export const Beat3StopLoss = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);
  const labelOp  = fadeIn(frame, 0, 10);
  const labelY   = slideUp(frame, 0, 10);
  const titleScale = spring({ frame: frame - 8, fps, config: { stiffness: 600, damping: 28 } });
  const subOp    = fadeIn(frame, 28);
  const subY     = slideUp(frame, 28);
  const lineW    = interpolate(frame - 35, [0, 30], [0, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Label */}
      <div style={{ opacity: labelOp, transform: `translateY(${labelY}px)`, fontSize: 13, color: R, fontFamily: FONT_MONO, letterSpacing: "0.3em", marginBottom: 20 }}>
        RISK TOOL 01
      </div>

      {/* BIG TITLE */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 150,
          fontWeight: 900,
          color: W,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        STOP
        <br />
        <span style={{ color: "transparent", WebkitTextStroke: `3px ${W}` }}>LOSS</span>
      </div>

      {/* Red divider line */}
      <div style={{ width: lineW, height: 2, background: R, marginTop: 28, opacity: 0.7 }} />

      {/* Subtitle */}
      <div
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          marginTop: 22,
          fontSize: 24,
          color: S,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "0.01em",
          textAlign: "center",
          fontWeight: 300,
        }}
      >
        Never lose more than you choose.
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 4: TAKE PROFIT ──────────────────────────────────────────────────────
export const Beat4TakeProfit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);
  const labelOp   = fadeIn(frame, 0, 10);
  const labelY    = slideUp(frame, 0, 10);
  const titleScale = spring({ frame: frame - 8, fps, config: { stiffness: 600, damping: 28 } });
  const subOp     = fadeIn(frame, 28);
  const subY      = slideUp(frame, 28);

  // Rising line that hits a target
  const chartProg = interpolate(frame - 5, [0, 50], [0, 1], { extrapolateRight: "clamp" });
  const rawPts = [[0, 160], [80, 140], [160, 115], [240, 90], [320, 65], [400, 38]];
  const vis = Math.max(2, Math.floor(rawPts.length * chartProg));
  const pts = rawPts.slice(0, vis);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const tpY = 38;
  const hitTarget = pts.length >= rawPts.length;

  return (
    <AbsoluteFill style={{ opacity: wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Small chart showing line hitting target */}
      <div style={{ position: "absolute", top: 80, right: 140 }}>
        <svg width={420} height={200} viewBox="0 0 420 200" style={{ overflow: "visible" }}>
          {/* Target line */}
          <line x1={0} y1={tpY} x2={420} y2={tpY} stroke={W} strokeWidth={1.5} strokeDasharray="10 6" opacity={0.3} />
          <text x={4} y={tpY - 6} fill={W} fontSize={11} fontFamily={FONT_MONO} opacity={0.4}>TAKE PROFIT</text>
          {/* Rising line */}
          {d && <path d={d} fill="none" stroke={W} strokeWidth={3} strokeLinecap="round" opacity={0.8} />}
          {/* Target hit flash */}
          {hitTarget && (
            <circle cx={rawPts[rawPts.length - 1][0]} cy={tpY} r={10} fill={W} opacity={0.9} />
          )}
        </svg>
      </div>

      {/* Label */}
      <div style={{ opacity: labelOp, transform: `translateY(${labelY}px)`, fontSize: 13, color: S, fontFamily: FONT_MONO, letterSpacing: "0.3em", marginBottom: 20, opacity: 0.5 }}>
        RISK TOOL 02
      </div>

      {/* BIG TITLE */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 130,
          fontWeight: 900,
          color: W,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        TAKE
        <br />
        <span style={{ color: "transparent", WebkitTextStroke: `3px ${W}` }}>PROFIT</span>
      </div>

      {/* White line */}
      <div style={{ width: 400, height: 1, background: W, marginTop: 26, opacity: 0.25 }} />

      {/* Subtitle */}
      <div
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          marginTop: 22,
          fontSize: 24,
          color: S,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "0.01em",
          textAlign: "center",
          fontWeight: 300,
        }}
      >
        Lock in gains. Automatically.
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 5: PRICE ALERTS ─────────────────────────────────────────────────────
export const Beat5Alerts = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);
  const labelOp   = fadeIn(frame, 0, 10);
  const titleScale = spring({ frame: frame - 8, fps, config: { stiffness: 600, damping: 28 } });
  const subOp     = fadeIn(frame, 28);
  const subY      = slideUp(frame, 28);

  // Notification card pops in
  const notifScale = spring({ frame: frame - 22, fps, config: { stiffness: 450, damping: 22 } });
  const notifOp    = fadeIn(frame, 22, 10);

  return (
    <AbsoluteFill style={{ opacity: wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Notification pop — top right */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 140,
          opacity: notifOp,
          transform: `scale(${Math.max(0, notifScale)})`,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: "16px 22px",
          minWidth: 280,
          display: "flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: W, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, color: W, fontFamily: FONT_MONO, fontWeight: 600 }}>BTC/USD hit $67,000</div>
          <div style={{ fontSize: 11, color: D, fontFamily: FONT_MONO, marginTop: 3 }}>Your alert triggered · Just now</div>
        </div>
      </div>

      {/* Label */}
      <div style={{ opacity: labelOp, fontSize: 13, color: S, fontFamily: FONT_MONO, letterSpacing: "0.3em", marginBottom: 20, opacity: 0.5 }}>
        RISK TOOL 03
      </div>

      {/* BIG TITLE */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 120,
          fontWeight: 900,
          color: W,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        PRICE
        <br />
        <span style={{ color: "transparent", WebkitTextStroke: `3px ${W}` }}>ALERTS</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          marginTop: 28,
          fontSize: 24,
          color: S,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "0.01em",
          textAlign: "center",
          fontWeight: 300,
        }}
      >
        Know before it's too late.
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 6: GUARANTEED STOP ──────────────────────────────────────────────────
export const Beat6Guaranteed = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);
  const t1Scale = spring({ frame, fps, config: { stiffness: 800, damping: 32 } });
  const t2Op  = fadeIn(frame, 18);
  const t2X   = slideLeft(frame, 18, 16);
  const subOp = fadeIn(frame, 36);
  const subY  = slideUp(frame, 36);
  const lineW = interpolate(frame - 12, [0, 28], [0, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* "GUARANTEED" — solid white slam */}
      <div
        style={{
          transform: `scale(${t1Scale})`,
          fontSize: 108,
          fontWeight: 900,
          color: W,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
          textTransform: "uppercase",
        }}
      >
        GUARANTEED
      </div>

      {/* "STOP" — outlined slides in */}
      <div
        style={{
          opacity: t2Op,
          transform: `translateX(${t2X}px)`,
          fontSize: 160,
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: `4px ${R}`,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.04em",
          lineHeight: 0.82,
          textTransform: "uppercase",
        }}
      >
        STOP
      </div>

      {/* Red line */}
      <div style={{ width: lineW, height: 2, background: R, marginTop: 20, opacity: 0.8 }} />

      {/* Subtitle */}
      <div
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 22, color: S, fontFamily: FONT_DISPLAY, fontWeight: 300 }}>
          Your position closes at the exact price you set.
        </div>
        <div style={{ fontSize: 20, color: R, fontFamily: FONT_MONO, marginTop: 8, fontWeight: 700 }}>
          No slippage. Ever.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 7: PLATFORM DEMO ────────────────────────────────────────────────────
export const Beat7Demo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 110, 96);
  const uiScale = spring({ frame: frame - 5, fps, config: { stiffness: 220, damping: 24 } });
  const uiOp  = fadeIn(frame, 5, 20);
  const textOp = fadeIn(frame, 30);
  const textY  = slideUp(frame, 30);

  // Chart line
  const chartProg = interpolate(frame - 10, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const chartPts = [[0, 110], [60, 90], [120, 100], [180, 75], [240, 55], [300, 40], [340, 30]];
  const vis = Math.max(2, Math.floor(chartPts.length * chartProg));
  const cPts = chartPts.slice(0, vis);
  const cD = cPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  const price = interpolate(frame - 10, [0, 80], [67800, 68240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: wrap }}>
      {/* Centered UI panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
        }}
      >
        {/* Left text */}
        <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, maxWidth: 400 }}>
          <div style={{ fontSize: 14, color: S, fontFamily: FONT_MONO, letterSpacing: "0.2em", marginBottom: 18, opacity: 0.5 }}>
            CAPITAL.COM PLATFORM
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: W,
              fontFamily: FONT_DISPLAY,
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
            }}
          >
            Set your
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${W}` }}>
              limits in
            </span>
            <br />
            seconds.
          </div>
        </div>

        {/* Right: UI panel */}
        <div
          style={{
            opacity: uiOp,
            transform: `scale(${uiScale})`,
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            overflow: "hidden",
            width: 460,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: W, opacity: 0.6 }} />
              <span style={{ fontSize: 13, color: W, fontFamily: FONT_MONO, fontWeight: 600, opacity: 0.85 }}>BTC/USD</span>
            </div>
            <span style={{ fontSize: 10, color: D, fontFamily: FONT_MONO }}>LIVE · 1H</span>
          </div>

          {/* Price */}
          <div style={{ padding: "12px 18px 4px" }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: W, fontFamily: FONT_MONO, letterSpacing: "-0.02em" }}>
              {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: 12, color: S, fontFamily: FONT_MONO, marginTop: 3, opacity: 0.5 }}>▲ +$440.00 (+0.65%)</div>
          </div>

          {/* Chart with SL/TP lines */}
          <div style={{ padding: "0 18px 10px" }}>
            <svg width="100%" height={130} viewBox="0 0 360 130" style={{ overflow: "visible" }}>
              {/* Take Profit line */}
              <line x1={0} y1={28} x2={360} y2={28} stroke={W} strokeWidth={1} strokeDasharray="8 5" opacity={0.3} />
              <text x={4} y={22} fill={W} fontSize={9} fontFamily={FONT_MONO} opacity={0.4}>TP</text>
              {/* Chart */}
              {cD && <path d={cD} fill="none" stroke={W} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />}
              {/* Stop Loss line */}
              <line x1={0} y1={112} x2={360} y2={112} stroke={R} strokeWidth={1.5} strokeDasharray="8 5" opacity={0.6} />
              <text x={4} y={125} fill={R} fontSize={9} fontFamily={FONT_MONO} opacity={0.6}>SL</text>
              {/* Current dot */}
              {cPts.length > 1 && (
                <circle cx={cPts[cPts.length - 1][0]} cy={cPts[cPts.length - 1][1]} r={4} fill={W} opacity={0.85} />
              )}
            </svg>
          </div>

          {/* SL / TP row */}
          <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ flex: 1, padding: "12px 16px", borderRight: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,58,82,0.06)" }}>
              <div style={{ fontSize: 9, color: R, fontFamily: FONT_MONO, letterSpacing: "0.1em", marginBottom: 5 }}>STOP LOSS</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: R, fontFamily: FONT_MONO }}>64,500.00</div>
            </div>
            <div style={{ flex: 1, padding: "12px 16px" }}>
              <div style={{ fontSize: 9, color: S, fontFamily: FONT_MONO, letterSpacing: "0.1em", marginBottom: 5, opacity: 0.6 }}>TAKE PROFIT</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: W, fontFamily: FONT_MONO }}>71,000.00</div>
            </div>
          </div>

          {/* Button */}
          <div style={{ margin: "10px 14px 14px", padding: "12px", textAlign: "center", background: W, borderRadius: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#000", fontFamily: FONT_DISPLAY, letterSpacing: "0.06em" }}>
              SET LIMITS NOW
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 8: SOCIAL PROOF ─────────────────────────────────────────────────────
export const Beat8Proof = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 90, 78);
  const numOp  = fadeIn(frame, 0, 12);
  const numY   = slideUp(frame, 0, 12);
  const countProgress = interpolate(frame - 5, [0, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const traderCount = Math.round(1200000 * countProgress).toLocaleString();

  const subOp = fadeIn(frame, 25);
  const subY  = slideUp(frame, 25);
  const badgeOp = fadeIn(frame, 40);

  const badges = ["FCA Regulated", "Segregated Funds", "Guaranteed Stop"];

  return (
    <AbsoluteFill
      style={{
        opacity: wrap,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Small eyebrow */}
      <div style={{ fontSize: 12, color: S, fontFamily: FONT_MONO, letterSpacing: "0.28em", marginBottom: 24, opacity: 0.45 }}>
        TRUSTED WORLDWIDE
      </div>

      {/* Big count */}
      <div
        style={{
          opacity: numOp,
          transform: `translateY(${numY}px)`,
          fontSize: 120,
          fontWeight: 900,
          color: W,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.04em",
          lineHeight: 0.85,
        }}
      >
        {traderCount}+
      </div>

      {/* "traders" */}
      <div
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          marginTop: 14,
          fontSize: 36,
          color: S,
          fontFamily: FONT_DISPLAY,
          fontWeight: 300,
          letterSpacing: "0.02em",
        }}
      >
        traders choose Capital.com
      </div>

      {/* Badges */}
      <div
        style={{
          opacity: badgeOp,
          display: "flex",
          gap: 14,
          marginTop: 36,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {badges.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "10px 18px",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: W, opacity: 0.5 }} />
            <span style={{ fontSize: 13, color: S, fontFamily: FONT_DISPLAY, fontWeight: 500, opacity: 0.65 }}>{b}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 9: CTA ──────────────────────────────────────────────────────────────
export const Beat9CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wrap = sceneWrap(frame, 160, 148);
  const line1Scale = spring({ frame: frame - 5, fps, config: { stiffness: 280, damping: 26 } });
  const line1Op = fadeIn(frame, 5, 18);
  const line2Op = fadeIn(frame, 22);
  const line2Y  = slideUp(frame, 22);
  const subOp   = fadeIn(frame, 38);
  const subY    = slideUp(frame, 38);
  const btnScale = spring({ frame: frame - 52, fps, config: { stiffness: 380, damping: 22 } });
  const btnOp  = fadeIn(frame, 52, 14);

  // Pulsing ring
  const ringScale  = 1 + interpolate(frame % 50, [0, 50], [0, 0.5]);
  const ringOp     = interpolate(frame % 50, [0, 25, 50], [0.3, 0.05, 0]);

  // Shimmer
  const shimmer = interpolate(frame - 56, [0, 60], [-160, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity: wrap,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* "Protect Your" */}
      <div style={{ opacity: line1Op, transform: `scale(${line1Scale})`, fontSize: 104, fontWeight: 900, color: W, fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.85 }}>
        Protect Your
      </div>

      {/* "Capital." — outlined */}
      <div style={{ opacity: line2Op, transform: `translateY(${line2Y}px)`, fontSize: 104, fontWeight: 900, color: "transparent", WebkitTextStroke: `3px ${W}`, fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.9, marginBottom: 8 }}>
        Capital.
      </div>

      {/* Subline */}
      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontSize: 22, color: D, fontFamily: FONT_DISPLAY, marginTop: 22, marginBottom: 48, textAlign: "center" }}>
        {config.tagline} · Start free today.
      </div>

      {/* CTA button */}
      <div style={{ position: "relative", opacity: btnOp, transform: `scale(${btnScale})` }}>
        {/* Pulsing ring */}
        <div style={{ position: "absolute", inset: -10, borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.3)", opacity: ringOp, transform: `scale(${ringScale})` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: W, borderRadius: 100, padding: "22px 60px", overflow: "hidden", position: "relative" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#000", fontFamily: FONT_DISPLAY, letterSpacing: "0.02em" }}>
            {config.cta}
          </span>
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path d="M4 10 H16 M11 5 L16 10 L11 15" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.12), transparent)", transform: `translateX(${shimmer}px)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 10: BRAND END ───────────────────────────────────────────────────────
export const Beat10Brand = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeInOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOutOp = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wrap = fadeInOp * fadeOutOp;

  const brandScale = spring({ frame: frame - 8, fps, config: { stiffness: 220, damping: 26 } });
  const tagOp = fadeIn(frame, 28);
  const tagY  = slideUp(frame, 28);
  const urlOp = fadeIn(frame, 44);

  return (
    <AbsoluteFill
      style={{
        opacity: wrap,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Brand name */}
      <div
        style={{
          transform: `scale(${brandScale})`,
          fontSize: 100,
          fontWeight: 900,
          color: W,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.03em",
        }}
      >
        {config.brand}
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
          fontSize: 24,
          color: S,
          fontFamily: FONT_DISPLAY,
          fontWeight: 300,
          letterSpacing: "0.04em",
          marginTop: 14,
          opacity: 0.6,
        }}
      >
        {config.tagline}
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOp,
          marginTop: 30,
          fontSize: 14,
          color: D,
          fontFamily: FONT_MONO,
          letterSpacing: "0.18em",
        }}
      >
        {config.ctaUrl}
      </div>
    </AbsoluteFill>
  );
};
