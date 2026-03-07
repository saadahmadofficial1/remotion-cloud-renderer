/**
 * CapitalComBeats.tsx
 * Capital.com-style Instagram/Facebook ad — 29 seconds
 * Shows realistic Capital.com mobile app UI for Stop Loss, Take Profit, Alerts.
 *
 * Brand colors from official Capital.com identity:
 *   App dark navy: #0d1421
 *   Brand green:   #00b899
 *   Loss red:      #e05252
 *   White:         #ffffff
 *   Font:          Plus Jakarta Sans (Gilroy equivalent via @remotion/google-fonts)
 *                  Space Grotesk (for numbers/data display)
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Trail } from "@remotion/motion-blur";
import React from "react";
import config from "../../video.config.json";
import { FONT_DISPLAY, FONT_MONO } from "../fonts";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const APP_BG     = "#0d1421";   // Capital.com dark navy
const APP_BG2    = "#141d2b";   // slightly lighter nav bg
const CARD_BG    = "#1a2438";   // card/sheet background
const GREEN      = "#00b899";   // Capital.com brand green
const GREEN_DIM  = "rgba(0,184,153,0.15)";
const RED        = "#e05252";
const RED_DIM    = "rgba(224,82,82,0.15)";
const WHITE      = "#ffffff";
const DIM        = "rgba(255,255,255,0.45)";
const DIM2       = "rgba(255,255,255,0.20)";
const BORDER     = "rgba(255,255,255,0.07)";
const GREEN_BORDER = "rgba(0,184,153,0.25)";
const FONT       = FONT_DISPLAY;
const MONO       = FONT_MONO;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fi = (frame: number, start = 0, dur = 14) =>
  interpolate(frame - start, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const su = (frame: number, start = 0, dur = 14) =>
  interpolate(frame - start, [0, dur], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const sl = (frame: number, start = 0, dur = 14) =>
  interpolate(frame - start, [0, dur], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const wrap = (frame: number, total: number, exitAt: number) =>
  interpolate(frame, [0, 10, exitAt, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

// ─── Phone Mockup Shell ───────────────────────────────────────────────────────
const Phone = ({ children, frame, delay = 0, fps = 30 }: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  fps?: number;
}) => {
  const sc = spring({ frame: frame - delay, fps, config: { stiffness: 200, damping: 26 } });
  const op = fi(frame, delay, 18);
  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${sc})`,
        width: 320,
        height: 670,
        background: APP_BG,
        borderRadius: 48,
        border: "8px solid #1c2840",
        overflow: "hidden",
        position: "relative",
        boxShadow: `0 60px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 1px rgba(255,255,255,0.04)`,
        flexShrink: 0,
      }}
    >
      {/* Dynamic island / notch */}
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, background: "#000", borderRadius: 12, zIndex: 20 }} />

      {/* Status bar */}
      <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", position: "relative", zIndex: 10 }}>
        <span style={{ fontSize: 11, color: WHITE, fontFamily: FONT, fontWeight: 600 }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {/* Signal bars */}
          {[5, 8, 11, 14].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: WHITE, borderRadius: 1.5, opacity: i < 3 ? 1 : 0.3 }} />
          ))}
          <div style={{ width: 22, height: 11, border: `1.5px solid rgba(255,255,255,0.6)`, borderRadius: 3, position: "relative", marginLeft: 4 }}>
            <div style={{ position: "absolute", left: 2, top: 2, bottom: 2, width: "70%", background: GREEN, borderRadius: 1 }} />
            <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 3, height: 6, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* App content */}
      <div style={{ position: "absolute", inset: 0, top: 44 }}>
        {children}
      </div>
    </div>
  );
};

// ─── App Navigation Bar ───────────────────────────────────────────────────────
const AppNav = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: APP_BG2, borderBottom: `1px solid ${BORDER}` }}>
    <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <path d="M10 2 L4 8 L10 14" stroke={WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      </svg>
    </div>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, fontFamily: FONT }}>{title}</div>
      {subtitle && <div style={{ fontSize: 10, color: DIM, fontFamily: MONO }}>{subtitle}</div>}
    </div>
    <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <circle cx="3" cy="8" r="1.5" fill={WHITE} opacity={0.5} />
        <circle cx="8" cy="8" r="1.5" fill={WHITE} opacity={0.5} />
        <circle cx="13" cy="8" r="1.5" fill={WHITE} opacity={0.5} />
      </svg>
    </div>
  </div>
);

// ─── Mini chart for app screens ───────────────────────────────────────────────
const MiniChart = ({ frame, showSL = false, showTP = false, showAlert = false, color = GREEN }: {
  frame: number;
  showSL?: boolean;
  showTP?: boolean;
  showAlert?: boolean;
  color?: string;
}) => {
  const pts = [
    [0, 120], [30, 105], [60, 115], [90, 88], [120, 70],
    [150, 82], [180, 60], [210, 42], [240, 55], [270, 38], [300, 22],
  ];
  const prog = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });
  const vis  = Math.max(2, Math.floor(pts.length * prog));
  const vPts = pts.slice(0, vis);
  const d    = vPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const areaD = vPts.length > 1
    ? `${d} L ${vPts[vPts.length - 1][0]} 140 L 0 140 Z`
    : "";

  const SL_Y = 100;
  const TP_Y = 20;
  const AL_Y = 58;

  return (
    <svg width="100%" height={140} viewBox="0 0 300 140" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="capChartGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {areaD && <path d={areaD} fill="url(#capChartGrad)" />}
      {d && <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />}
      {/* Stop Loss line */}
      {showSL && (
        <>
          <line x1={0} y1={SL_Y} x2={300} y2={SL_Y} stroke={RED} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.8} />
          <rect x={230} y={SL_Y - 9} width={68} height={18} rx={4} fill={RED_DIM} />
          <text x={264} y={SL_Y + 4} fill={RED} fontSize={9} fontFamily={MONO} textAnchor="middle" fontWeight={600}>SL 1.0780</text>
        </>
      )}
      {/* Take Profit line */}
      {showTP && (
        <>
          <line x1={0} y1={TP_Y} x2={300} y2={TP_Y} stroke={GREEN} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.8} />
          <rect x={230} y={TP_Y - 9} width={68} height={18} rx={4} fill={GREEN_DIM} />
          <text x={264} y={TP_Y + 4} fill={GREEN} fontSize={9} fontFamily={MONO} textAnchor="middle" fontWeight={600}>TP 1.0950</text>
        </>
      )}
      {/* Price Alert line */}
      {showAlert && (
        <>
          <line x1={0} y1={AL_Y} x2={300} y2={AL_Y} stroke="rgba(255,255,255,0.4)" strokeWidth={1} strokeDasharray="4 4" />
          <rect x={216} y={AL_Y - 9} width={82} height={18} rx={4} fill="rgba(255,255,255,0.06)" />
          <text x={257} y={AL_Y + 4} fill="rgba(255,255,255,0.6)" fontSize={9} fontFamily={MONO} textAnchor="middle">Alert 1.0850</text>
        </>
      )}
      {/* Current price dot */}
      {vPts.length > 1 && (
        <circle
          cx={vPts[vPts.length - 1][0]}
          cy={vPts[vPts.length - 1][1]}
          r={4} fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      )}
    </svg>
  );
};

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
const TabBar = () => (
  <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 18px", background: APP_BG2, borderTop: `1px solid ${BORDER}` }}>
    {["Markets", "Portfolio", "Trade", "Alerts", "More"].map((tab, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <div style={{ width: 20, height: 20, background: i === 2 ? GREEN : "transparent", borderRadius: i === 2 ? 4 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 1.5, background: i === 2 ? WHITE : "rgba(255,255,255,0.25)" }} />
        </div>
        <span style={{ fontSize: 8, color: i === 2 ? GREEN : DIM, fontFamily: FONT }}>{tab}</span>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 1: Hook — Logo + Chart with SL/TP visible
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 100, 88);

  const logoScale = spring({ frame, fps, config: { stiffness: 280, damping: 28 } });
  const logoOp = fi(frame, 0, 16);
  const textOp = fi(frame, 18);
  const textY  = su(frame, 18);
  const subOp  = fi(frame, 36);
  const subY   = su(frame, 36);

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Left: Brand + Copy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 620 }}>
        {/* Capital.com logo mark */}
        <div style={{ opacity: logoOp, transform: `scale(${logoScale})`, display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 4, border: "3px solid white" }} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: WHITE, fontFamily: FONT, letterSpacing: "-0.01em" }}>Capital.com</span>
        </div>

        <div style={{ opacity: textOp, transform: `translateY(${textY}px)` }}>
          <div style={{ fontSize: 18, color: GREEN, fontFamily: MONO, letterSpacing: "0.2em", marginBottom: 18 }}>RISK MANAGEMENT</div>
          <div style={{ fontSize: 88, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.88 }}>
            Set Your
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: `2.5px ${WHITE}` }}>Limits.</span>
          </div>
        </div>

        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, marginTop: 24, fontSize: 22, color: DIM, fontFamily: FONT, fontWeight: 300 }}>
          Full risk-management suite.<br />Built into the app you already use.
        </div>
      </div>

      {/* Right: Phone showing chart with SL/TP */}
      <Phone frame={frame} delay={8} fps={fps}>
        <AppNav title="EUR / USD" subtitle="FOREX · LIVE" />
        {/* Price header */}
        <div style={{ padding: "12px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: WHITE, fontFamily: MONO }}>1.08547</div>
            <div style={{ fontSize: 12, color: GREEN, fontFamily: MONO, marginTop: 2 }}>▲ +0.21% · +0.00228</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["1H","4H","1D"].map((t, i) => (
              <div key={i} style={{ padding: "4px 8px", borderRadius: 6, background: i === 2 ? GREEN : "rgba(255,255,255,0.06)", fontSize: 9, color: i === 2 ? WHITE : DIM, fontFamily: MONO }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* Chart */}
        <div style={{ padding: "0 12px" }}>
          <MiniChart frame={frame} showSL showTP color={GREEN} />
        </div>
        {/* Risk labels */}
        <div style={{ display: "flex", gap: 8, padding: "8px 14px" }}>
          <div style={{ flex: 1, background: RED_DIM, borderRadius: 8, padding: "7px 10px", border: `1px solid rgba(224,82,82,0.25)` }}>
            <div style={{ fontSize: 8, color: RED, fontFamily: MONO, marginBottom: 2 }}>STOP LOSS</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: MONO }}>1.0780</div>
          </div>
          <div style={{ flex: 1, background: GREEN_DIM, borderRadius: 8, padding: "7px 10px", border: `1px solid ${GREEN_BORDER}` }}>
            <div style={{ fontSize: 8, color: GREEN, fontFamily: MONO, marginBottom: 2 }}>TAKE PROFIT</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, fontFamily: MONO }}>1.0950</div>
          </div>
        </div>
        {/* Buy/Sell buttons */}
        <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${BORDER}`, marginTop: "auto" }}>
          <div style={{ flex: 1, padding: "13px", textAlign: "center", background: RED_DIM }}>
            <div style={{ fontSize: 10, color: DIM, fontFamily: MONO, marginBottom: 3 }}>SELL</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: RED, fontFamily: MONO }}>1.08534</div>
          </div>
          <div style={{ flex: 1, padding: "13px", textAlign: "center", background: GREEN_DIM }}>
            <div style={{ fontSize: 10, color: DIM, fontFamily: MONO, marginBottom: 3 }}>BUY</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: GREEN, fontFamily: MONO }}>1.08561</div>
          </div>
        </div>
        <TabBar />
      </Phone>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 2: STOP LOSS — Phone showing SL setup sheet
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat2StopLoss = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 100, 88);

  const textOp = fi(frame, 0, 12);
  const textY  = su(frame, 0, 12);
  const descOp = fi(frame, 20);
  const descY  = su(frame, 20);

  // Bottom sheet slides up
  const sheetY = interpolate(frame - 12, [0, 22], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheetOp = fi(frame, 12, 16);

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Left */}
      <div style={{ maxWidth: 580 }}>
        <div style={{ fontSize: 13, color: RED, fontFamily: MONO, letterSpacing: "0.22em", marginBottom: 20, opacity: 0.8 }}>
          RISK TOOL 01 / 04
        </div>
        <Trail layers={4} lagInFrames={2} trailOpacity={0.22}>
          <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, fontSize: 100, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85 }}>
            STOP
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: `3px ${RED}` }}>LOSS</span>
          </div>
        </Trail>
        <div style={{ opacity: descOp, transform: `translateY(${descY}px)`, marginTop: 28, fontSize: 22, color: DIM, fontFamily: FONT, fontWeight: 300, lineHeight: 1.5 }}>
          Set the exact price where your
          <br />trade closes automatically.
          <br />
          <span style={{ color: RED, fontWeight: 600 }}>Never lose more than you decide.</span>
        </div>
      </div>

      {/* Right: Phone with SL setup */}
      <Phone frame={frame} delay={5} fps={fps}>
        <AppNav title="Stop Loss" subtitle="EUR / USD" />
        {/* Compact chart */}
        <div style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>
          <MiniChart frame={frame} showSL color={RED} />
        </div>
        {/* Bottom sheet */}
        <div
          style={{
            transform: `translateY(${sheetY}px)`,
            opacity: sheetOp,
            background: CARD_BG,
            borderRadius: "20px 20px 0 0",
            padding: "16px",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          {/* Drag handle */}
          <div style={{ width: 36, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 14px" }} />

          <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, fontFamily: FONT, marginBottom: 4 }}>Set Stop Loss</div>
          <div style={{ fontSize: 11, color: DIM, fontFamily: FONT, marginBottom: 14 }}>Close trade if price falls to:</div>

          {/* Price input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: APP_BG, borderRadius: 10, padding: "10px 14px", border: `1.5px solid rgba(224,82,82,0.4)`, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(224,82,82,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: RED, fontFamily: MONO, flexShrink: 0 }}>−</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 800, color: WHITE, fontFamily: MONO }}>1.08000</div>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(224,82,82,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: RED, fontFamily: MONO, flexShrink: 0 }}>+</div>
          </div>

          {/* Loss display */}
          <div style={{ display: "flex", justifyContent: "space-between", background: RED_DIM, borderRadius: 8, padding: "8px 12px", marginBottom: 14, border: `1px solid rgba(224,82,82,0.2)` }}>
            <span style={{ fontSize: 11, color: DIM, fontFamily: FONT }}>Maximum loss</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: MONO }}>−$25.47</span>
          </div>

          {/* Guaranteed stop option */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${BORDER}`, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: WHITE, fontFamily: FONT, fontWeight: 600 }}>Guaranteed Stop</div>
              <div style={{ fontSize: 9, color: DIM, fontFamily: FONT }}>No slippage. Small premium.</div>
            </div>
            {/* Toggle ON */}
            <div style={{ width: 38, height: 22, borderRadius: 11, background: GREEN, position: "relative" }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: WHITE, position: "absolute", right: 2, top: 2 }} />
            </div>
          </div>

          {/* Set button */}
          <div style={{ background: GREEN, borderRadius: 12, padding: "13px", textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: WHITE, fontFamily: FONT, letterSpacing: "0.02em" }}>Set Stop Loss</span>
          </div>
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 3: TAKE PROFIT
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat3TakeProfit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 100, 88);

  const textOp = fi(frame, 0, 12);
  const textY  = su(frame, 0, 12);
  const descOp = fi(frame, 20);
  const descY  = su(frame, 20);
  const sheetY = interpolate(frame - 12, [0, 22], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheetOp = fi(frame, 12, 16);

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Left */}
      <div style={{ maxWidth: 580 }}>
        <div style={{ fontSize: 13, color: GREEN, fontFamily: MONO, letterSpacing: "0.22em", marginBottom: 20, opacity: 0.8 }}>
          RISK TOOL 02 / 04
        </div>
        <Trail layers={4} lagInFrames={2} trailOpacity={0.22}>
          <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, fontSize: 100, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85 }}>
            TAKE
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: `3px ${GREEN}` }}>PROFIT</span>
          </div>
        </Trail>
        <div style={{ opacity: descOp, transform: `translateY(${descY}px)`, marginTop: 28, fontSize: 22, color: DIM, fontFamily: FONT, fontWeight: 300, lineHeight: 1.5 }}>
          Set your target price.
          <br />The app locks in your gains automatically.
          <br />
          <span style={{ color: GREEN, fontWeight: 600 }}>No manual monitoring required.</span>
        </div>
      </div>

      {/* Right: Phone with TP setup */}
      <Phone frame={frame} delay={5} fps={fps}>
        <AppNav title="Take Profit" subtitle="EUR / USD" />
        <div style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>
          <MiniChart frame={frame} showTP color={GREEN} />
        </div>
        {/* Bottom sheet */}
        <div
          style={{
            transform: `translateY(${sheetY}px)`,
            opacity: sheetOp,
            background: CARD_BG,
            borderRadius: "20px 20px 0 0",
            padding: "16px",
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ width: 36, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 14px" }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, fontFamily: FONT, marginBottom: 4 }}>Set Take Profit</div>
          <div style={{ fontSize: 11, color: DIM, fontFamily: FONT, marginBottom: 14 }}>Close trade if price rises to:</div>

          {/* Price input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: APP_BG, borderRadius: 10, padding: "10px 14px", border: `1.5px solid rgba(0,184,153,0.4)`, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: GREEN_DIM, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: GREEN, fontFamily: MONO, flexShrink: 0 }}>−</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 800, color: WHITE, fontFamily: MONO }}>1.09500</div>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: GREEN_DIM, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: GREEN, fontFamily: MONO, flexShrink: 0 }}>+</div>
          </div>

          {/* Profit display */}
          <div style={{ display: "flex", justifyContent: "space-between", background: GREEN_DIM, borderRadius: 8, padding: "8px 12px", marginBottom: 14, border: `1px solid ${GREEN_BORDER}` }}>
            <span style={{ fontSize: 11, color: DIM, fontFamily: FONT }}>Profit at this level</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, fontFamily: MONO }}>+$95.30</span>
          </div>

          {/* R/R ratio */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: DIM, fontFamily: FONT }}>Risk/Reward ratio</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: WHITE, fontFamily: MONO }}>1 : 3.74</span>
          </div>

          {/* Set button */}
          <div style={{ background: GREEN, borderRadius: 12, padding: "13px", textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: WHITE, fontFamily: FONT, letterSpacing: "0.02em" }}>Set Take Profit</span>
          </div>
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 4: PRICE ALERTS
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat4Alerts = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 100, 88);

  const textOp = fi(frame, 0, 12);
  const descOp = fi(frame, 20);
  const descY  = su(frame, 20);

  // Notification pops in
  const notifScale = spring({ frame: frame - 28, fps, config: { stiffness: 500, damping: 22 } });
  const notifOp = fi(frame, 28, 12);

  const sheetY = interpolate(frame - 10, [0, 22], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheetOp = fi(frame, 10, 16);

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Left */}
      <div style={{ maxWidth: 580 }}>
        <div style={{ fontSize: 13, color: DIM2, fontFamily: MONO, letterSpacing: "0.22em", marginBottom: 20 }}>
          RISK TOOL 03 / 04
        </div>
        <div style={{ opacity: textOp, fontSize: 96, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85 }}>
          PRICE
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: `3px ${WHITE}` }}>ALERTS</span>
        </div>
        <div style={{ opacity: descOp, transform: `translateY(${descY}px)`, marginTop: 28, fontSize: 22, color: DIM, fontFamily: FONT, fontWeight: 300, lineHeight: 1.5 }}>
          Get notified the moment
          <br />any asset hits your target.
          <br />
          <span style={{ color: WHITE, fontWeight: 600 }}>Know before it's too late.</span>
        </div>

        {/* Push notification preview */}
        <div
          style={{
            opacity: notifOp,
            transform: `scale(${Math.max(0, notifScale)})`,
            marginTop: 36,
            background: "rgba(255,255,255,0.06)",
            border: `1px solid rgba(255,255,255,0.1)`,
            borderRadius: 16,
            padding: "14px 18px",
            display: "flex",
            gap: 12,
            alignItems: "center",
            maxWidth: 400,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: "2.5px solid white" }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: WHITE, fontFamily: FONT }}>Capital.com Alert</div>
            <div style={{ fontSize: 11, color: DIM, fontFamily: FONT, marginTop: 2 }}>EUR/USD hit 1.08500 · Your alert triggered</div>
            <div style={{ fontSize: 10, color: DIM2, fontFamily: MONO, marginTop: 2 }}>Just now</div>
          </div>
        </div>
      </div>

      {/* Right: Phone with Alert setup screen */}
      <Phone frame={frame} delay={5} fps={fps}>
        <AppNav title="Price Alert" subtitle="EUR / USD" />
        <div style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>
          <MiniChart frame={frame} showAlert color={GREEN} />
        </div>
        {/* Alert setup sheet */}
        <div
          style={{
            transform: `translateY(${sheetY}px)`,
            opacity: sheetOp,
            background: CARD_BG,
            borderRadius: "20px 20px 0 0",
            padding: "16px",
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ width: 36, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 14px" }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, fontFamily: FONT, marginBottom: 4 }}>Create Price Alert</div>
          <div style={{ fontSize: 11, color: DIM, fontFamily: FONT, marginBottom: 14 }}>Alert me when EUR/USD reaches:</div>

          {/* Price input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: APP_BG, borderRadius: 10, padding: "10px 14px", border: `1.5px solid rgba(255,255,255,0.15)`, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: WHITE, fontFamily: MONO, flexShrink: 0 }}>−</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: 800, color: WHITE, fontFamily: MONO }}>1.09000</div>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: WHITE, fontFamily: MONO, flexShrink: 0 }}>+</div>
          </div>

          {/* Notification method */}
          {[{ label: "Push Notification", on: true }, { label: "Email", on: false }].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i === 0 ? `1px solid ${BORDER}` : "none" }}>
              <span style={{ fontSize: 11, color: WHITE, fontFamily: FONT }}>{item.label}</span>
              <div style={{ width: 38, height: 22, borderRadius: 11, background: item.on ? GREEN : "rgba(255,255,255,0.1)", position: "relative" }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: WHITE, position: "absolute", right: item.on ? 2 : undefined, left: item.on ? undefined : 2, top: 2 }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 14, background: GREEN, borderRadius: 12, padding: "13px", textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: WHITE, fontFamily: FONT }}>Set Alert</span>
          </div>
        </div>
      </Phone>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 5: GUARANTEED STOP — Phone shows the toggle + full screen text
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat5Guaranteed = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 90, 78);

  const t1Op = fi(frame, 0, 12);
  const t2Op = fi(frame, 14);
  const t2X  = sl(frame, 14, 14);
  const sub1Op = fi(frame, 30);
  const sub1Y  = su(frame, 30);
  const sub2Op = fi(frame, 44);
  const lineW  = interpolate(frame - 20, [0, 30], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneOp = fi(frame, 6, 20);
  const phoneSc = spring({ frame: frame - 6, fps, config: { stiffness: 200, damping: 26 } });

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Left */}
      <div style={{ maxWidth: 600 }}>
        <div style={{ fontSize: 13, color: DIM2, fontFamily: MONO, letterSpacing: "0.22em", marginBottom: 20 }}>RISK TOOL 04 / 04</div>
        <div style={{ opacity: t1Op, fontSize: 86, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85 }}>GUARANTEED</div>
        <div style={{ opacity: t2Op, transform: `translateX(${t2X}px)`, fontSize: 110, fontWeight: 900, color: "transparent", WebkitTextStroke: `4px ${RED}`, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85 }}>STOP</div>
        <div style={{ width: lineW, height: 2, background: RED, marginTop: 20, opacity: 0.7 }} />
        <div style={{ opacity: sub1Op, transform: `translateY(${sub1Y}px)`, marginTop: 22, fontSize: 22, color: DIM, fontFamily: FONT, fontWeight: 300 }}>
          Your position closes at the{" "}
          <span style={{ color: WHITE, fontWeight: 700 }}>exact price you set.</span>
        </div>
        <div style={{ opacity: sub2Op, marginTop: 10, fontSize: 20, color: RED, fontFamily: MONO, fontWeight: 700 }}>No slippage. No surprises. Guaranteed.</div>
      </div>

      {/* Right: Phone showing Guaranteed Stop toggle */}
      <div style={{ opacity: phoneOp, transform: `scale(${phoneSc})`, width: 320, height: 670, background: APP_BG, borderRadius: 48, border: "8px solid #1c2840", overflow: "hidden", flexShrink: 0, boxShadow: `0 60px 120px rgba(0,0,0,0.9)` }}>
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, background: "#000", borderRadius: 12, zIndex: 20 }} />
        <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px" }}>
          <span style={{ fontSize: 11, color: WHITE, fontFamily: FONT, fontWeight: 600 }}>9:41</span>
        </div>
        {/* Order form */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ padding: "10px 0", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, fontFamily: FONT }}>EUR / USD</div>
            <div style={{ fontSize: 12, color: GREEN, fontFamily: MONO }}>1.08547</div>
          </div>

          {/* Order rows */}
          {[
            { label: "Order Type", value: "Market" },
            { label: "Quantity", value: "0.10 Lots" },
            { label: "Stop Loss", value: "1.08000", valueColor: RED },
            { label: "Take Profit", value: "1.09500", valueColor: GREEN },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 12, color: DIM, fontFamily: FONT }}>{row.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: row.valueColor || WHITE, fontFamily: MONO }}>{row.value}</span>
            </div>
          ))}

          {/* Guaranteed Stop row — highlighted */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(0,184,153,0.08)", borderRadius: 10, marginTop: 10, border: `1px solid ${GREEN_BORDER}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, fontFamily: FONT }}>Guaranteed Stop</div>
              <div style={{ fontSize: 10, color: GREEN, fontFamily: FONT, marginTop: 2 }}>✓ No slippage guaranteed</div>
            </div>
            {/* Toggle ON */}
            <div style={{ width: 46, height: 26, borderRadius: 13, background: GREEN, position: "relative", flexShrink: 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: WHITE, position: "absolute", right: 2, top: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
            </div>
          </div>

          {/* Place order button */}
          <div style={{ marginTop: 16, background: GREEN, borderRadius: 14, padding: "15px", textAlign: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: WHITE, fontFamily: FONT }}>Place Order</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 6: ALL IN ONE — Chart showing all 3 limits + "One platform."
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat6AllInOne = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 110, 96);

  const textOp = fi(frame, 0, 16);
  const textY  = su(frame, 0, 16);
  const subOp  = fi(frame, 22);
  const subY   = su(frame, 22);
  const phoneOp = fi(frame, 5, 20);
  const phoneSc = spring({ frame: frame - 5, fps, config: { stiffness: 200, damping: 26 } });

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      {/* Left */}
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 13, color: DIM2, fontFamily: MONO, letterSpacing: "0.22em", marginBottom: 20 }}>COMPLETE RISK SUITE</div>
        <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, fontSize: 78, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.035em", lineHeight: 0.9 }}>
          Every limit.
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: `2.5px ${GREEN}` }}>One platform.</span>
        </div>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { color: RED, label: "Stop Loss", desc: "Caps your downside, always" },
            { color: GREEN, label: "Take Profit", desc: "Locks in your gains automatically" },
            { color: "rgba(255,255,255,0.6)", label: "Price Alerts", desc: "Never miss a market move" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: WHITE, fontFamily: FONT }}>{item.label}</span>
                <span style={{ fontSize: 14, color: DIM, fontFamily: FONT }}> · {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Phone showing all 3 limits on chart */}
      <Phone frame={frame} delay={5} fps={fps}>
        <AppNav title="BTC / USD" subtitle="CRYPTO · LIVE" />
        <div style={{ padding: "12px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: WHITE, fontFamily: MONO }}>67,240.50</div>
            <div style={{ fontSize: 11, color: GREEN, fontFamily: MONO, marginTop: 2 }}>▲ +3.44%</div>
          </div>
          <div style={{ padding: "5px 12px", background: GREEN_DIM, borderRadius: 8, border: `1px solid ${GREEN_BORDER}` }}>
            <span style={{ fontSize: 10, color: GREEN, fontFamily: MONO, fontWeight: 600 }}>ALL LIMITS SET</span>
          </div>
        </div>
        <div style={{ padding: "0 12px" }}>
          <MiniChart frame={frame} showSL showTP showAlert color={GREEN} />
        </div>
        {/* Limit summary cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: `1px solid ${BORDER}`, flex: 1 }}>
          {[
            { label: "Take Profit", price: "$71,000", pnl: "+$3,759.50", color: GREEN, bg: GREEN_DIM },
            { label: "Price Alert", price: "$68,500", pnl: "Notify me", color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.03)" },
            { label: "Stop Loss", price: "$64,500", pnl: "−$2,740.50", color: RED, bg: RED_DIM },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: item.bg, borderBottom: `1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontSize: 9, color: item.color, fontFamily: MONO, letterSpacing: "0.08em" }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, fontFamily: MONO }}>{item.price}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: item.color, fontFamily: MONO }}>{item.pnl}</div>
            </div>
          ))}
        </div>
        <TabBar />
      </Phone>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 7: SOCIAL PROOF — 1.2M+ traders
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat7Proof = () => {
  const frame = useCurrentFrame();
  const W = wrap(frame, 90, 78);

  const count = Math.round(1200000 * interpolate(frame - 5, [0, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const textOp = fi(frame, 0, 14);
  const subOp  = fi(frame, 22);
  const subY   = su(frame, 22);
  const badgeOp = fi(frame, 38);

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 12, color: DIM2, fontFamily: MONO, letterSpacing: "0.3em", marginBottom: 24, opacity: textOp }}>TRUSTED BY TRADERS WORLDWIDE</div>
      <div style={{ opacity: textOp, fontSize: 110, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85 }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, marginTop: 16, fontSize: 34, color: DIM, fontFamily: FONT, fontWeight: 300 }}>
        traders choose <span style={{ color: WHITE, fontWeight: 700 }}>Capital.com</span>
      </div>
      <div style={{ opacity: badgeOp, display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {["FCA Regulated", "Segregated Funds", "Guaranteed Stop", "24/7 Support"].map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 18px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: 13, color: DIM, fontFamily: FONT, fontWeight: 500 }}>{b}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 8: CTA — "Set Your Limits. Start Free Today."
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat8CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = wrap(frame, 160, 148);

  const line1Sc = spring({ frame: frame - 5, fps, config: { stiffness: 260, damping: 26 } });
  const line1Op = fi(frame, 5, 18);
  const line2Op = fi(frame, 22);
  const line2Y  = su(frame, 22);
  const subOp   = fi(frame, 36);
  const subY    = su(frame, 36);
  const btnSc   = spring({ frame: frame - 50, fps, config: { stiffness: 380, damping: 22 } });
  const btnOp   = fi(frame, 50, 14);
  const ringScale = 1 + interpolate(frame % 50, [0, 50], [0, 0.5]);
  const ringOp  = interpolate(frame % 50, [0, 25, 50], [0.35, 0.05, 0]);
  const shimmer = interpolate(frame - 55, [0, 65], [-160, 380], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoOp  = fi(frame, 38);

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Capital.com logo */}
      <div style={{ opacity: logoOp, display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 20, height: 20, borderRadius: 3.5, border: "2.5px solid white" }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: WHITE, fontFamily: FONT, letterSpacing: "-0.01em" }}>Capital.com</span>
      </div>

      <div style={{ opacity: line1Op, transform: `scale(${line1Sc})`, fontSize: 96, fontWeight: 900, color: WHITE, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.85, textAlign: "center" }}>
        Set Your Limits.
      </div>
      <div style={{ opacity: line2Op, transform: `translateY(${line2Y}px)`, fontSize: 96, fontWeight: 900, color: "transparent", WebkitTextStroke: `2.5px ${GREEN}`, fontFamily: FONT, letterSpacing: "-0.04em", lineHeight: 0.9, marginBottom: 8, textAlign: "center" }}>
        Start Free Today.
      </div>

      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontSize: 20, color: DIM, fontFamily: FONT, marginTop: 24, marginBottom: 48, textAlign: "center" }}>
        Full risk-management suite. No commitment required.
      </div>

      {/* Green CTA button */}
      <div style={{ position: "relative", opacity: btnOp, transform: `scale(${btnSc})` }}>
        <div style={{ position: "absolute", inset: -10, borderRadius: 100, border: `1.5px solid rgba(0,184,153,0.4)`, opacity: ringOp, transform: `scale(${ringScale})` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: GREEN, borderRadius: 100, padding: "22px 64px", overflow: "hidden", position: "relative", boxShadow: `0 0 40px rgba(0,184,153,0.35)` }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: WHITE, fontFamily: FONT, letterSpacing: "0.01em" }}>
            Open Free Account
          </span>
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path d="M4 10 H16 M11 5 L16 10 L11 15" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", transform: `translateX(${shimmer}px)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BEAT 9: BRAND END
// ═══════════════════════════════════════════════════════════════════════════════
export const CapBeat9Brand = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inOp  = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [65, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const W = inOp * outOp;

  const logoSc = spring({ frame: frame - 8, fps, config: { stiffness: 220, damping: 26 } });
  const tagOp  = fi(frame, 24);
  const tagY   = su(frame, 24);
  const urlOp  = fi(frame, 40);
  const lineW  = interpolate(frame - 30, [0, 28], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: W, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Logo mark + wordmark */}
      <div style={{ transform: `scale(${logoSc})`, display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px rgba(0,184,153,0.4)` }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, border: "3px solid white" }} />
        </div>
        <span style={{ fontSize: 36, fontWeight: 800, color: WHITE, fontFamily: FONT, letterSpacing: "-0.02em" }}>Capital.com</span>
      </div>

      <div style={{ width: lineW, height: 1, background: GREEN, opacity: 0.5, marginBottom: 18 }} />

      <div style={{ opacity: tagOp, transform: `translateY(${tagY}px)`, fontSize: 20, color: DIM, fontFamily: FONT, fontWeight: 300, letterSpacing: "0.03em" }}>
        Full risk-management suite.
      </div>

      <div style={{ opacity: urlOp, marginTop: 22, fontSize: 14, color: DIM2, fontFamily: MONO, letterSpacing: "0.16em" }}>
        capital.com
      </div>
    </AbsoluteFill>
  );
};
