/**
 * PremiumBeats.tsx — 10 cinematic beats for 9:16 vertical video (1080×1920)
 *
 * Layout strategy:
 *   ALL text blocks use position:absolute with explicit top/left/right values.
 *   This prevents the Trail component (motion blur) from collapsing flex layouts.
 *
 *   Layout zones for 1080×1920:
 *     top:     100–500px  (labels, small content)
 *     center:  550–1100px (HERO text — biggest, boldest)
 *     bottom:  1200–1750px (subtitles, badges, descriptions)
 *
 * All text is driven by video.config.json — NO brand names hardcoded.
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Trail } from "@remotion/motion-blur";
import { noise2D } from "@remotion/noise";
import { FONT_DISPLAY, FONT_MONO } from "../fonts";
import config from "../../video.config.json";

// ─── Color tokens from config ──────────────────────────────────────────────────
const cfg = (config as any).colors || {};
const GREEN    = cfg.green  || "#00b899";
const RED      = cfg.red    || "#e05252";
const WHITE    = cfg.white  || "#ffffff";
const SILVER   = cfg.silver || "#c8cdd6";
const BG       = cfg.bg     || "#05050f";
const DIM      = "rgba(255,255,255,0.30)";
const DIM2     = "rgba(255,255,255,0.12)";
const BORDER   = "rgba(255,255,255,0.08)";
const GREEN_LO = `${GREEN}1f`;
const RED_LO   = `${RED}1a`;

// ─── Feature data from config ──────────────────────────────────────────────────
const features = (config as any).features || [];
const feat = (id: string) => features.find((f: any) => f.id === id) || {};

// ─── Shared animation helpers ──────────────────────────────────────────────────

const fi = (f: number, start = 0, dur = 12) =>
  interpolate(f - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

const su = (f: number, start = 0, dur = 14, dist = 40) =>
  interpolate(f - start, [0, dur], [dist, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

const sceneOp = (f: number, total: number, exitAt: number) =>
  interpolate(f, [0, 10, exitAt, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

/** Shared base style for absolute text blocks */
const ABS_TEXT = {
  position: "absolute" as const,
  left: 60,
  right: 60,
  textAlign: "center" as const,
};

// ─── Premium Background ────────────────────────────────────────────────────────
export const PremiumBackground = () => {
  const frame = useCurrentFrame();

  const orbGX = noise2D("orb-g-x", frame / 240, 0) * 200;
  const orbGY = noise2D("orb-g-y", frame / 280, 0) * 200;
  const orbRX = noise2D("orb-r-x", frame / 300, 0) * 150;
  const orbRY = noise2D("orb-r-y", frame / 260, 0) * 150;
  const orbGPulse = 0.55 + noise2D("orb-g-p", frame / 200, 0) * 0.15;
  const orbRPulse = 0.45 + noise2D("orb-r-p", frame / 180, 0) * 0.12;

  const particles = Array.from({ length: 16 }, (_, i) => ({
    x: (i % 4) * 270 + 135 + noise2D(`px${i}`, frame / 200, 0) * 120,
    y: Math.floor(i / 4) * 480 + 240 + noise2D(`py${i}`, frame / 240, 0) * 140,
    opacity: 0.12 + noise2D(`po${i}`, frame / 150, 0) * 0.18,
    size: 2.5 + noise2D(`ps${i}`, frame / 180, 0) * 2,
  }));

  const grainOp = 0.03 + noise2D("grain", frame / 4, 0) * 0.02;

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      {/* Green ambient orb — top-right */}
      <div style={{
        position: "absolute", top: -200 + orbGY, right: -120 + orbGX,
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,184,153,${orbGPulse}) 0%, transparent 70%)`,
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      {/* Red ambient orb — bottom-left */}
      <div style={{
        position: "absolute", bottom: -200 + orbRY, left: -100 + orbRX,
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(224,82,82,${orbRPulse}) 0%, transparent 70%)`,
        filter: "blur(80px)", pointerEvents: "none",
      }} />
      {/* Top vignette */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 300,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
        pointerEvents: "none",
      }} />
      {/* Bottom vignette */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 400,
        background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        pointerEvents: "none",
      }} />
      {/* Floating particles */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1080 1920">
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size}
            fill={i % 3 === 0 ? GREEN : WHITE} opacity={p.opacity} />
        ))}
      </svg>
      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: grainOp, mixBlendMode: "screen",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 1: HOOK — "EVERY TRADE. IS A RISK."
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 90, 78);

  const s1 = spring({ frame, fps, config: { stiffness: 700, damping: 32 } });
  const s2Op = fi(frame, 14);
  const s2Y = su(frame, 14, 12, 50);
  const qOp = fi(frame, 36, 14);
  const qY = su(frame, 36, 14, 30);
  const lineOp = fi(frame, 44, 20);

  // Get hook text from config or fallback
  const hookParts = ((config as any).hook || "EVERY TRADE IS A RISK.").split(".");
  const line1 = (hookParts[0] || "EVERY TRADE").trim();
  const line2 = (hookParts[1] || "").trim();
  const subhook = (config as any).subhook || "Are you protected?";

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Line 1 — center of screen */}
      <div style={{ ...ABS_TEXT, top: 600 }}>
        <Trail layers={6} lagInFrames={2} trailOpacity={0.15}>
          <div style={{
            transform: `scale(${s1})`,
            fontSize: 120, fontWeight: 900, color: WHITE,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.045em",
            lineHeight: 0.92, textTransform: "uppercase",
          }}>
            {line1}{line1 && "."}
          </div>
        </Trail>
      </div>

      {/* Line 2 — below line 1, with gap */}
      {line2 && (
        <div style={{ ...ABS_TEXT, top: 820 }}>
          <div style={{
            opacity: s2Op, transform: `translateY(${s2Y}px)`,
            fontSize: 120, fontWeight: 900,
            color: "transparent", WebkitTextStroke: `3px ${RED}`,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.045em",
            lineHeight: 0.92, textTransform: "uppercase",
          }}>
            {line2}.
          </div>
        </div>
      )}

      {/* Sub-hook — lower */}
      <div style={{ ...ABS_TEXT, top: 1060 }}>
        <div style={{
          opacity: qOp, transform: `translateY(${qY}px)`,
          fontSize: 26, fontWeight: 400, color: SILVER,
          fontFamily: FONT_MONO, letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}>
          {subhook.toUpperCase()}
        </div>
      </div>

      {/* Green gradient divider */}
      <div style={{
        ...ABS_TEXT, top: 1160,
        height: 1, opacity: lineOp,
        background: `linear-gradient(to right, transparent, ${GREEN}, transparent)`,
      }} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 2: PROBLEM — Market crash
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat2Problem = () => {
  const frame = useCurrentFrame();
  const op = sceneOp(frame, 90, 78);

  const chartProg = interpolate(frame - 5, [0, 55], [0, 1], { extrapolateRight: "clamp" });
  const rawPts: [number, number][] = [
    [0, 200], [70, 170], [140, 155], [210, 145], [280, 155],
    [350, 230], [420, 330], [490, 370], [560, 345],
    [640, 310], [720, 280], [800, 255], [900, 240],
  ];
  const vis = Math.max(2, Math.floor(rawPts.length * chartProg));
  const pts = rawPts.slice(0, vis);
  const beforeD = pts.slice(0, Math.min(pts.length, 5)).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const crashD = pts.length > 4 ? pts.slice(4, Math.min(pts.length, 9)).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") : "";
  const afterD = pts.length > 8 ? pts.slice(8).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") : "";

  const numOp = fi(frame, 20, 12);
  const numY = su(frame, 20, 12, 50);
  const textOp = fi(frame, 50, 12);
  const textY = su(frame, 50, 12, 30);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Loss number — top area */}
      <div style={{ ...ABS_TEXT, top: 340, opacity: numOp, transform: `translateY(${numY}px)` }}>
        <div style={{
          fontSize: 130, fontWeight: 900, color: RED,
          fontFamily: FONT_MONO, letterSpacing: "-0.03em", lineHeight: 1,
        }}>
          −8.44%
        </div>
        <div style={{
          fontSize: 20, color: DIM, fontFamily: FONT_MONO,
          letterSpacing: "0.18em", marginTop: 10,
        }}>
          IN UNDER 60 SECONDS
        </div>
      </div>

      {/* Crash chart — middle */}
      <div style={{ position: "absolute", top: 650, left: 30, right: 30 }}>
        <svg width="100%" height="450" viewBox="0 0 960 450" style={{ overflow: "visible" }}>
          <defs>
            <filter id="cg">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {beforeD && <path d={beforeD} fill="none" stroke={SILVER} strokeWidth={3} strokeLinecap="round" opacity={0.35} />}
          {crashD && <path d={crashD} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" filter="url(#cg)" />}
          {afterD && <path d={afterD} fill="none" stroke={SILVER} strokeWidth={3} strokeLinecap="round" opacity={0.35} />}
          {pts.length >= 6 && <circle cx={pts[Math.min(pts.length - 1, 7)][0]} cy={pts[Math.min(pts.length - 1, 7)][1]} r={8} fill={RED} />}
        </svg>
      </div>

      {/* Bottom text */}
      <div style={{ ...ABS_TEXT, top: 1350, opacity: textOp, transform: `translateY(${textY}px)` }}>
        <div style={{
          fontSize: 42, fontWeight: 700, color: WHITE,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.02em",
        }}>
          Markets move fast.
        </div>
        <div style={{
          fontSize: 28, color: SILVER, fontFamily: FONT_DISPLAY,
          marginTop: 14, fontWeight: 300, opacity: 0.7,
        }}>
          Don't get caught without a limit.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 3: STOP LOSS
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat3StopLoss = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 90, 78);
  const f = feat("stop-loss");

  const labelOp = fi(frame, 0, 10);
  const ts = spring({ frame: frame - 6, fps, config: { stiffness: 600, damping: 28 } });
  const subOp = fi(frame, 30, 14);
  const subY = su(frame, 30, 14, 40);
  const lineW = interpolate(frame - 38, [0, 28], [0, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const descOp = fi(frame, 48, 14);
  const descY = su(frame, 48, 14, 30);
  const badgeScale = spring({ frame: frame - 58, fps, config: { stiffness: 350, damping: 22 } });
  const badgeOp = fi(frame, 58, 12);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Label — top */}
      <div style={{ ...ABS_TEXT, top: 480, opacity: labelOp }}>
        <div style={{
          fontSize: 18, color: RED, fontFamily: FONT_MONO,
          letterSpacing: "0.3em", fontWeight: 600, textTransform: "uppercase",
        }}>
          {f.label || "RISK CONTROL 01"}
        </div>
      </div>

      {/* STOP — hero text line 1 */}
      <div style={{ ...ABS_TEXT, top: 580 }}>
        <Trail layers={5} lagInFrames={2} trailOpacity={0.14}>
          <div style={{
            transform: `scale(${ts})`,
            fontSize: 155, fontWeight: 900, color: WHITE,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.045em",
            lineHeight: 0.88, textTransform: "uppercase",
          }}>
            STOP
          </div>
        </Trail>
      </div>

      {/* LOSS — hero text line 2 (outlined) */}
      <div style={{ ...ABS_TEXT, top: 735 }}>
        <Trail layers={5} lagInFrames={2} trailOpacity={0.14}>
          <div style={{
            transform: `scale(${ts})`,
            fontSize: 155, fontWeight: 900,
            color: "transparent", WebkitTextStroke: `4px ${RED}`,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.045em",
            lineHeight: 0.88, textTransform: "uppercase",
          }}>
            LOSS
          </div>
        </Trail>
      </div>

      {/* Red divider line */}
      <div style={{
        position: "absolute", top: 920, left: 60, right: 60,
        height: 2, background: `linear-gradient(to right, transparent, ${RED}, transparent)`,
        width: lineW, margin: "0 auto", opacity: 0.8,
      }} />

      {/* Subtitle */}
      <div style={{ ...ABS_TEXT, top: 980, opacity: subOp, transform: `translateY(${subY}px)` }}>
        <div style={{
          fontSize: 34, fontWeight: 300, color: SILVER,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.01em",
        }}>
          {f.subtitle || "Never lose more than you choose."}
        </div>
      </div>

      {/* Description */}
      <div style={{ ...ABS_TEXT, top: 1060, opacity: descOp, transform: `translateY(${descY}px)` }}>
        <div style={{
          fontSize: 22, fontWeight: 400, color: DIM,
          fontFamily: FONT_MONO, letterSpacing: "0.04em",
        }}>
          {f.description || "Set your floor. Walk away."}
        </div>
      </div>

      {/* Badge */}
      <div style={{
        position: "absolute", top: 1170, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: badgeOp, transform: `scale(${badgeScale})`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: RED_LO, border: `1px solid ${RED}33`,
          borderRadius: 100, padding: "14px 28px",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: RED }} />
          <span style={{ fontSize: 20, fontWeight: 600, color: RED, fontFamily: FONT_DISPLAY, letterSpacing: "0.04em" }}>
            {f.badge || "AUTOMATIC CLOSE"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 4: TAKE PROFIT
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat4TakeProfit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 90, 78);
  const f = feat("take-profit");

  const labelOp = fi(frame, 0, 10);
  const ts = spring({ frame: frame - 6, fps, config: { stiffness: 600, damping: 28 } });
  const subOp = fi(frame, 30, 14);
  const subY = su(frame, 30, 14, 40);
  const lineW = interpolate(frame - 38, [0, 28], [0, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeScale = spring({ frame: frame - 55, fps, config: { stiffness: 350, damping: 22 } });
  const badgeOp = fi(frame, 55, 12);

  // Rising chart
  const chartProg = interpolate(frame - 5, [0, 50], [0, 1], { extrapolateRight: "clamp" });
  const chartPts: [number, number][] = [[0, 200], [100, 170], [200, 135], [300, 100], [400, 68], [500, 38]];
  const vis = Math.max(2, Math.floor(chartPts.length * chartProg));
  const cD = chartPts.slice(0, vis).map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const hitTP = vis >= chartPts.length;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Small rising chart — top accent */}
      <div style={{ position: "absolute", top: 280, right: 40, opacity: fi(frame, 5, 18) }}>
        <svg width={440} height={240} viewBox="0 0 500 240" style={{ overflow: "visible" }}>
          <defs><filter id="tpg"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <line x1={0} y1={38} x2={500} y2={38} stroke={GREEN} strokeWidth={1.5} strokeDasharray="12 6" opacity={0.4} />
          <text x={4} y={30} fill={GREEN} fontSize={16} fontFamily={FONT_MONO} opacity={0.6}>TAKE PROFIT</text>
          {cD && <path d={cD} fill="none" stroke={GREEN} strokeWidth={4} strokeLinecap="round" filter="url(#tpg)" opacity={0.9} />}
          {hitTP && <><circle cx={500} cy={38} r={12} fill={GREEN} opacity={0.9} /><circle cx={500} cy={38} r={22} fill={GREEN} opacity={0.2} /></>}
        </svg>
      </div>

      {/* Label */}
      <div style={{ ...ABS_TEXT, top: 570, opacity: labelOp }}>
        <div style={{ fontSize: 18, color: GREEN, fontFamily: FONT_MONO, letterSpacing: "0.3em", fontWeight: 600 }}>
          {f.label || "PROFIT LOCK 02"}
        </div>
      </div>

      {/* TAKE */}
      <div style={{ ...ABS_TEXT, top: 650 }}>
        <Trail layers={5} lagInFrames={2} trailOpacity={0.14}>
          <div style={{
            transform: `scale(${ts})`, fontSize: 145, fontWeight: 900, color: WHITE,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.045em", lineHeight: 0.88, textTransform: "uppercase",
          }}>TAKE</div>
        </Trail>
      </div>

      {/* PROFIT — outlined green */}
      <div style={{ ...ABS_TEXT, top: 800 }}>
        <Trail layers={5} lagInFrames={2} trailOpacity={0.14}>
          <div style={{
            transform: `scale(${ts})`, fontSize: 145, fontWeight: 900,
            color: "transparent", WebkitTextStroke: `4px ${GREEN}`,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.045em", lineHeight: 0.88, textTransform: "uppercase",
          }}>PROFIT</div>
        </Trail>
      </div>

      {/* Green line */}
      <div style={{
        position: "absolute", top: 975, left: 60, right: 60,
        height: 2, width: lineW, margin: "0 auto",
        background: `linear-gradient(to right, transparent, ${GREEN}, transparent)`, opacity: 0.7,
      }} />

      {/* Subtitle */}
      <div style={{ ...ABS_TEXT, top: 1040, opacity: subOp, transform: `translateY(${subY}px)` }}>
        <div style={{ fontSize: 34, fontWeight: 300, color: SILVER, fontFamily: FONT_DISPLAY }}>
          {f.subtitle || "Lock in gains. Automatically."}
        </div>
      </div>

      {/* Badge */}
      <div style={{
        position: "absolute", top: 1170, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: badgeOp, transform: `scale(${badgeScale})`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: GREEN_LO, border: `1px solid ${GREEN}33`,
          borderRadius: 100, padding: "14px 28px",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN }} />
          <span style={{ fontSize: 20, fontWeight: 600, color: GREEN, fontFamily: FONT_DISPLAY, letterSpacing: "0.04em" }}>
            {f.badge || "AUTO CLOSE AT TARGET"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 5: PRICE ALERTS
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat5Alerts = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 90, 78);
  const f = feat("alerts");

  const ts = spring({ frame: frame - 6, fps, config: { stiffness: 600, damping: 28 } });
  const subOp = fi(frame, 30, 14);
  const subY = su(frame, 30, 14, 40);

  const n1Scale = spring({ frame: frame - 15, fps, config: { stiffness: 380, damping: 22 } });
  const n1Op = fi(frame, 15, 12);
  const n2Scale = spring({ frame: frame - 35, fps, config: { stiffness: 380, damping: 22 } });
  const n2Op = fi(frame, 35, 12);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Notification 1 — top area */}
      <div style={{
        position: "absolute", top: 260, left: 50, right: 50,
        opacity: n1Op, transform: `scale(${Math.max(0, n1Scale)})`,
        background: "rgba(30,40,60,0.9)", backdropFilter: "blur(20px)",
        border: `1px solid ${BORDER}`, borderRadius: 18, padding: "20px 24px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: WHITE, fontFamily: FONT_DISPLAY }}>Alert Triggered</div>
          <div style={{ fontSize: 15, color: SILVER, fontFamily: FONT_MONO, marginTop: 4 }}>BTC/USD reached $67,000</div>
        </div>
      </div>

      {/* Notification 2 */}
      <div style={{
        position: "absolute", top: 400, left: 50, right: 50,
        opacity: n2Op, transform: `scale(${Math.max(0, n2Scale)})`,
        background: "rgba(30,40,60,0.9)", backdropFilter: "blur(20px)",
        border: `1px solid ${BORDER}`, borderRadius: 18, padding: "20px 24px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: WHITE, fontFamily: FONT_DISPLAY }}>Stop Loss approaching</div>
          <div style={{ fontSize: 15, color: SILVER, fontFamily: FONT_MONO, marginTop: 4 }}>EUR/USD is 12 pips from your stop</div>
        </div>
      </div>

      {/* Label */}
      <div style={{ ...ABS_TEXT, top: 700 }}>
        <div style={{ fontSize: 18, color: WHITE, fontFamily: FONT_MONO, letterSpacing: "0.3em", opacity: 0.5 }}>
          {f.label || "INTELLIGENCE 03"}
        </div>
      </div>

      {/* PRICE ALERTS */}
      <div style={{ ...ABS_TEXT, top: 790 }}>
        <Trail layers={5} lagInFrames={2} trailOpacity={0.12}>
          <div style={{
            transform: `scale(${ts})`, fontSize: 120, fontWeight: 900, color: WHITE,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.88, textTransform: "uppercase",
          }}>PRICE</div>
        </Trail>
      </div>
      <div style={{ ...ABS_TEXT, top: 920 }}>
        <Trail layers={5} lagInFrames={2} trailOpacity={0.12}>
          <div style={{
            transform: `scale(${ts})`, fontSize: 120, fontWeight: 900,
            color: "transparent", WebkitTextStroke: `3px ${WHITE}`,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.88, textTransform: "uppercase",
          }}>ALERTS</div>
        </Trail>
      </div>

      {/* Subtitle */}
      <div style={{ ...ABS_TEXT, top: 1110, opacity: subOp, transform: `translateY(${subY}px)` }}>
        <div style={{ fontSize: 30, fontWeight: 300, color: SILVER, fontFamily: FONT_DISPLAY }}>
          {f.subtitle || "Know before it's too late."}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 6: GUARANTEED STOP
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat6Guaranteed = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 90, 78);
  const f = feat("guaranteed-stop");

  const stampScale = spring({ frame: frame - 5, fps, config: { stiffness: 500, damping: 25 } });
  const t1Scale = spring({ frame, fps, config: { stiffness: 800, damping: 34 } });
  const t2Op = fi(frame, 16);
  const t2Y = su(frame, 16, 14, 60);
  const lineW = interpolate(frame - 30, [0, 24], [0, 960], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = fi(frame, 38, 14);
  const subY = su(frame, 38, 14, 40);
  const tagOp = fi(frame, 52, 14);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* GUARANTEED stamp — top */}
      <div style={{
        position: "absolute", top: 360, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `scale(${stampScale})`, opacity: fi(frame, 0, 14),
      }}>
        <div style={{
          border: `5px solid ${GREEN}`, borderRadius: 12, padding: "10px 30px",
        }}>
          <div style={{
            fontSize: 40, fontWeight: 900, color: GREEN,
            fontFamily: FONT_DISPLAY, letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            {f.label || "GUARANTEED"}
          </div>
        </div>
      </div>

      {/* STOP — massive center text */}
      <div style={{ ...ABS_TEXT, top: 620 }}>
        <Trail layers={7} lagInFrames={2} trailOpacity={0.12}>
          <div style={{
            transform: `scale(${t1Scale})`,
            fontSize: 180, fontWeight: 900, color: WHITE,
            fontFamily: FONT_DISPLAY, letterSpacing: "-0.05em", lineHeight: 0.82, textTransform: "uppercase",
          }}>STOP</div>
        </Trail>
      </div>

      {/* LOSS — outlined red */}
      <div style={{ ...ABS_TEXT, top: 810, opacity: t2Op, transform: `translateY(${t2Y}px)` }}>
        <div style={{
          fontSize: 180, fontWeight: 900,
          color: "transparent", WebkitTextStroke: `5px ${RED}`,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.05em", lineHeight: 0.82, textTransform: "uppercase",
        }}>LOSS</div>
      </div>

      {/* Red gradient line */}
      <div style={{
        position: "absolute", top: 1050, left: 60, right: 60,
        height: 2.5, width: lineW, margin: "0 auto",
        background: `linear-gradient(to right, transparent, ${RED}, transparent)`,
      }} />

      {/* Subtitle */}
      <div style={{ ...ABS_TEXT, top: 1120, opacity: subOp, transform: `translateY(${subY}px)` }}>
        <div style={{ fontSize: 30, fontWeight: 300, color: SILVER, fontFamily: FONT_DISPLAY }}>
          {f.subtitle || "Closes at the exact price you set."}
        </div>
      </div>

      {/* Tag */}
      <div style={{ ...ABS_TEXT, top: 1200, opacity: tagOp }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: RED, fontFamily: FONT_MONO, letterSpacing: "0.06em" }}>
          {f.description || "NO SLIPPAGE. EVER."}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 7: APP SHOWCASE — phone mockup with chart
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat7App = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 110, 96);

  const phoneScale = spring({ frame: frame - 6, fps, config: { stiffness: 200, damping: 24 } });
  const phoneOp = fi(frame, 6, 20);
  const textOp = fi(frame, 28, 14);
  const textY = su(frame, 28, 14, 40);

  const chartProg = interpolate(frame - 15, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const chartPts: [number, number][] = [[0, 80], [50, 68], [100, 72], [150, 55], [200, 42], [250, 30], [300, 22]];
  const vis = Math.max(2, Math.floor(chartPts.length * chartProg));
  const cPts = chartPts.slice(0, vis);
  const cD = cPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const price = interpolate(frame - 15, [0, 80], [67800, 68460], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Phone mockup — centered top half */}
      <div style={{
        position: "absolute", top: 180, left: "50%",
        transform: `translateX(-50%) scale(${phoneScale})`,
        opacity: phoneOp, width: 380, height: 680,
        background: "#0d1421", border: `2px solid ${GREEN}33`,
        borderRadius: 44, overflow: "hidden",
        boxShadow: `0 40px 120px rgba(0,184,153,0.15), 0 0 0 1px ${BORDER}`,
      }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 6px" }}>
          <span style={{ fontSize: 15, color: WHITE, fontFamily: FONT_MONO, fontWeight: 600 }}>9:41</span>
          <div style={{ width: 80, height: 18, background: "#0d1421", border: `1px solid ${BORDER}`, borderRadius: 12 }} />
          <div style={{ display: "flex", gap: 4 }}>
            {[3, 4, 5].map((h, i) => (<div key={i} style={{ width: 4, height: h + 8, background: WHITE, borderRadius: 2, opacity: 0.7 }} />))}
          </div>
        </div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: WHITE, fontFamily: FONT_DISPLAY }}>BTC/USD</span>
          </div>
          <span style={{ fontSize: 13, color: DIM, fontFamily: FONT_MONO }}>1H</span>
        </div>
        {/* Price */}
        <div style={{ padding: "12px 20px 6px" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: WHITE, fontFamily: FONT_MONO, letterSpacing: "-0.02em" }}>
            {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 14, color: GREEN, fontFamily: FONT_MONO, marginTop: 2 }}>+$660.00 (+0.97%)</div>
        </div>
        {/* Chart */}
        <div style={{ padding: "0 20px 10px" }}>
          <svg width="340" height="100" viewBox="0 0 300 100" style={{ overflow: "visible" }}>
            <line x1={0} y1={22} x2={300} y2={22} stroke={GREEN} strokeWidth={1} strokeDasharray="8 5" opacity={0.4} />
            {cD && <path d={cD} fill="none" stroke={GREEN} strokeWidth={3} strokeLinecap="round" />}
            <line x1={0} y1={88} x2={300} y2={88} stroke={RED} strokeWidth={1.5} strokeDasharray="8 5" opacity={0.6} />
            {cPts.length > 1 && <circle cx={cPts[cPts.length - 1][0]} cy={cPts[cPts.length - 1][1]} r={5} fill={GREEN} />}
          </svg>
        </div>
        {/* SL / TP row */}
        <div style={{ display: "flex", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ flex: 1, padding: "12px 18px", borderRight: `1px solid ${BORDER}`, background: `${RED}11` }}>
            <div style={{ fontSize: 11, color: RED, fontFamily: FONT_MONO, letterSpacing: "0.1em", marginBottom: 6 }}>STOP LOSS</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: RED, fontFamily: FONT_MONO }}>64,800</div>
          </div>
          <div style={{ flex: 1, padding: "12px 18px" }}>
            <div style={{ fontSize: 11, color: GREEN, fontFamily: FONT_MONO, letterSpacing: "0.1em", marginBottom: 6 }}>TAKE PROFIT</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: GREEN, fontFamily: FONT_MONO }}>69,500</div>
          </div>
        </div>
        {/* Buy/Sell */}
        <div style={{ display: "flex", gap: 10, padding: "12px 16px" }}>
          <div style={{ flex: 1, background: GREEN, borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: WHITE, fontFamily: FONT_DISPLAY }}>BUY</span>
          </div>
          <div style={{ flex: 1, background: RED, borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: WHITE, fontFamily: FONT_DISPLAY }}>SELL</span>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div style={{ ...ABS_TEXT, top: 1100, opacity: textOp, transform: `translateY(${textY}px)` }}>
        <div style={{ fontSize: 16, color: DIM, fontFamily: FONT_MONO, letterSpacing: "0.22em", marginBottom: 18 }}>
          {((config as any).brand || "").toUpperCase()} APP
        </div>
        <div style={{
          fontSize: 52, fontWeight: 900, color: WHITE,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.03em", lineHeight: 0.92,
        }}>
          Set limits
        </div>
        <div style={{
          fontSize: 52, fontWeight: 900, marginTop: 4,
          color: "transparent", WebkitTextStroke: `2px ${GREEN}`,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.03em", lineHeight: 0.92,
        }}>
          in seconds.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 8: SOCIAL PROOF
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat8Proof = () => {
  const frame = useCurrentFrame();
  const op = sceneOp(frame, 90, 78);

  const sp = (config as any).social_proof || {};
  const targetCount = sp.count || 1200000;
  const badges = sp.badges || ["FCA Regulated", "Segregated Funds", "Guaranteed Stop"];

  const eyeOp = fi(frame, 0, 10);
  const numOp = fi(frame, 8, 14);
  const numY = su(frame, 8, 14, 60);
  const count = Math.round(targetCount * interpolate(frame - 10, [0, 55], [0, 1], { extrapolateRight: "clamp" }));
  const labelOp = fi(frame, 30, 14);
  const labelY = su(frame, 30, 14, 40);
  const badgeOp = fi(frame, 46, 14);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Eyebrow */}
      <div style={{ ...ABS_TEXT, top: 500, opacity: eyeOp }}>
        <div style={{ fontSize: 18, color: DIM, fontFamily: FONT_MONO, letterSpacing: "0.28em" }}>
          TRUSTED WORLDWIDE
        </div>
      </div>

      {/* Counter */}
      <div style={{ ...ABS_TEXT, top: 600, opacity: numOp, transform: `translateY(${numY}px)` }}>
        <div style={{
          fontSize: 130, fontWeight: 900, color: WHITE,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.85,
        }}>
          {count.toLocaleString("en-US")}+
        </div>
      </div>

      {/* Label */}
      <div style={{ ...ABS_TEXT, top: 820, opacity: labelOp, transform: `translateY(${labelY}px)` }}>
        <div style={{ fontSize: 36, fontWeight: 300, color: SILVER, fontFamily: FONT_DISPLAY }}>
          {sp.label || "traders protected"}
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: WHITE, fontFamily: FONT_DISPLAY, marginTop: 8 }}>
          {(config as any).brand || "Your Brand"}
        </div>
      </div>

      {/* Trust badges */}
      <div style={{
        position: "absolute", top: 1060, left: 60, right: 60,
        opacity: badgeOp, display: "flex", flexDirection: "column", gap: 14,
      }}>
        {badges.map((b: string, i: number) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            background: DIM2, border: `1px solid ${BORDER}`,
            borderRadius: 12, padding: "14px 22px", backdropFilter: "blur(10px)",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? WHITE : i === 1 ? GREEN : RED, flexShrink: 0 }} />
            <span style={{ fontSize: 20, color: SILVER, fontFamily: FONT_DISPLAY, fontWeight: 500 }}>{b}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 9: CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat9CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = sceneOp(frame, 150, 138);

  const line1Op = fi(frame, 5, 18);
  const line1Scale = spring({ frame: frame - 5, fps, config: { stiffness: 280, damping: 26 } });
  const line2Op = fi(frame, 22, 14);
  const line2Y = su(frame, 22, 14, 50);
  const subOp = fi(frame, 40, 14);
  const subY = su(frame, 40, 14, 40);
  const btnScale = spring({ frame: frame - 58, fps, config: { stiffness: 340, damping: 22 } });
  const btnOp = fi(frame, 58, 16);
  const ringS = 1 + interpolate(frame % 48, [0, 48], [0, 0.55]);
  const ringO = interpolate(frame % 48, [0, 24, 48], [0.4, 0.05, 0]);
  const shimX = interpolate(frame - 62, [0, 70], [-200, 500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* "Protect Your" */}
      <div style={{ ...ABS_TEXT, top: 500, opacity: line1Op, transform: `scale(${line1Scale})` }}>
        <div style={{
          fontSize: 100, fontWeight: 900, color: WHITE,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.88,
        }}>
          Protect
          <br />
          Your
        </div>
      </div>

      {/* "Capital." — outlined green */}
      <div style={{ ...ABS_TEXT, top: 740, opacity: line2Op, transform: `translateY(${line2Y}px)` }}>
        <div style={{
          fontSize: 100, fontWeight: 900,
          color: "transparent", WebkitTextStroke: `3px ${GREEN}`,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.04em", lineHeight: 0.88,
        }}>
          Capital.
        </div>
      </div>

      {/* Sub-line */}
      <div style={{ ...ABS_TEXT, top: 920, opacity: subOp, transform: `translateY(${subY}px)` }}>
        <div style={{
          fontSize: 24, color: DIM, fontFamily: FONT_DISPLAY, fontWeight: 300,
        }}>
          {(config as any).cta_sub || "Your money at stake. Your limits. Your choice."}
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        position: "absolute", top: 1080, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: btnOp, transform: `scale(${btnScale})`,
      }}>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute", inset: -14, borderRadius: 100,
            border: `2px solid ${GREEN}80`, opacity: ringO, transform: `scale(${ringS})`,
          }} />
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            background: GREEN, borderRadius: 100, padding: "26px 60px",
            overflow: "hidden", position: "relative",
            boxShadow: `0 20px 60px ${GREEN}66, 0 4px 20px ${GREEN}33`,
          }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: WHITE, fontFamily: FONT_DISPLAY, letterSpacing: "0.02em" }}>
              {(config as any).cta || "Get Started Now"}
            </span>
            <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <path d="M4 11H18M13 5L18 11L13 17" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: 100,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              transform: `translateX(${shimX}px)`,
            }} />
          </div>
        </div>
      </div>

      {/* URL */}
      <div style={{ ...ABS_TEXT, top: 1240, opacity: fi(frame, 72, 16) }}>
        <div style={{ fontSize: 20, color: DIM, fontFamily: FONT_MONO, letterSpacing: "0.18em" }}>
          {(config as any).ctaUrl || "yourbrand.com"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Beat 10: BRAND CLOSE
// ═══════════════════════════════════════════════════════════════════════════════
export const PBeat10Brand = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [65, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = inOp * outOp;

  const brandScale = spring({ frame: frame - 8, fps, config: { stiffness: 200, damping: 26 } });
  const lineW = interpolate(frame - 20, [0, 20], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = fi(frame, 26, 14);
  const tagY = su(frame, 26, 14, 30);
  const urlOp = fi(frame, 44, 14);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      {/* Brand name */}
      <div style={{ ...ABS_TEXT, top: 720, transform: `scale(${brandScale})` }}>
        <div style={{
          fontSize: 90, fontWeight: 900, color: WHITE,
          fontFamily: FONT_DISPLAY, letterSpacing: "-0.03em",
        }}>
          {(config as any).brand || "Your Brand"}
        </div>
      </div>

      {/* Green underline */}
      <div style={{
        position: "absolute", top: 860, left: "50%",
        transform: "translateX(-50%)",
        width: lineW, height: 3,
        background: GREEN, boxShadow: `0 0 20px ${GREEN}`,
      }} />

      {/* Tagline */}
      <div style={{ ...ABS_TEXT, top: 920, opacity: tagOp, transform: `translateY(${tagY}px)` }}>
        <div style={{
          fontSize: 24, fontWeight: 300, color: SILVER,
          fontFamily: FONT_DISPLAY, letterSpacing: "0.02em", opacity: 0.7,
        }}>
          {(config as any).tagline || "Trade smarter. Trade safer."}
        </div>
      </div>

      {/* URL */}
      <div style={{ ...ABS_TEXT, top: 1020, opacity: urlOp }}>
        <div style={{
          fontSize: 20, color: DIM, fontFamily: FONT_MONO, letterSpacing: "0.18em",
        }}>
          {(config as any).ctaUrl || "yourbrand.com"}
        </div>
      </div>

      {/* Regulatory */}
      <div style={{
        ...ABS_TEXT, top: 1550, opacity: fi(frame, 50, 16) * 0.4,
      }}>
        <div style={{
          fontSize: 14, color: DIM, fontFamily: FONT_MONO, lineHeight: 1.5,
        }}>
          Trading CFDs involves risk. Capital at risk.
        </div>
      </div>
    </AbsoluteFill>
  );
};
