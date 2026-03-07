import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import config from "../../video.config.json";

const WHITE = "#ffffff";
const SILVER = "#e0e0e0";
const RED = "#ff3a52";
const DIM = "rgba(255,255,255,0.22)";

// A sharp market drop + recovery chart — visualizes "risk" before the hook
const RiskChart = ({ frame }: { frame: number }) => {
  // Points: rises, then sharp DROP, then rebounds — classic risk visual
  const pts = [
    [0, 200], [120, 180], [240, 155], [360, 160], [480, 130],
    [580, 110], [650, 200], [720, 300], [800, 340], [900, 310],
    [1000, 280], [1100, 240], [1200, 210], [1300, 175], [1400, 145],
  ];

  const progress = interpolate(frame, [0, 28], [0, 1], { extrapolateRight: "clamp" });
  const visible = Math.max(2, Math.floor(pts.length * progress));
  const vPts = pts.slice(0, visible);
  const pathD = vPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  // Color the drop segment red, rest silver
  const dropStart = 5; // index where drop begins
  const beforeDrop = vPts.slice(0, Math.min(vPts.length, dropStart + 1));
  const afterDrop = vPts.length > dropStart ? vPts.slice(dropStart) : [];
  const drop = pts.slice(dropStart, 9); // the sharp drop portion

  const beforeD = beforeDrop.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const dropD = drop.slice(0, Math.min(drop.length, Math.max(0, vPts.length - dropStart)))
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const afterD = afterDrop.length > 3
    ? afterDrop.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")
    : "";

  return (
    <svg width={1400} height={380} viewBox="0 0 1400 380" style={{ overflow: "visible" }}>
      {/* Before drop — silver */}
      {beforeD && <path d={beforeD} fill="none" stroke={SILVER} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />}
      {/* Drop — red */}
      {dropD && visible > dropStart && (
        <path d={dropD} fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" />
      )}
      {/* After drop — silver recovery */}
      {afterD && (
        <path d={afterD} fill="none" stroke={SILVER} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
      )}
      {/* Stop loss line — horizontal red dashed */}
      {visible > 7 && (
        <line
          x1={0} y1={340} x2={1400} y2={340}
          stroke={RED} strokeWidth={1.5} strokeDasharray="12 8" opacity={0.4}
        />
      )}
      {visible > 7 && (
        <text x={10} y={330} fill={RED} fontSize={14} fontFamily="'SF Mono', monospace" opacity={0.5}>
          STOP LOSS
        </text>
      )}
    </svg>
  );
};

// Three market cards that flash in — showing volatility/risk context
const MarketFlash = ({ frame }: { frame: number }) => {
  const pairs = [
    { pair: "BTC/USD", price: "67,240.50", change: "-8.44%", up: false },
    { pair: "EUR/USD", price: "1.08211", change: "-0.32%", up: false },
    { pair: "GOLD", price: "2,341.80", change: "+0.87%", up: true },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 160px",
      }}
    >
      {pairs.map((item, i) => {
        const localFrame = frame - i * 4;
        const opacity = interpolate(localFrame, [0, 8, 22, 30], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(localFrame, [0, 10], [20, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${item.up ? "rgba(255,255,255,0.12)" : "rgba(255,58,82,0.25)"}`,
              borderRadius: 12,
              padding: "20px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              minWidth: 220,
            }}
          >
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'SF Mono', monospace", letterSpacing: "0.18em" }}>
              {item.pair}
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: WHITE, fontFamily: "'SF Mono', monospace" }}>
              {item.price}
            </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: item.up ? SILVER : RED, fontFamily: "'SF Mono', monospace" }}>
              {item.change}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Market flash (0-35)
  const flashOpacity = interpolate(frame, [0, 5, 26, 36], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Main hook (32+)
  const hookOpacity = interpolate(frame, [32, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "SET YOUR LIMITS." slams in
  const hookScale = spring({
    frame: frame - 32,
    fps,
    config: { stiffness: 700, damping: 30 },
  });

  // Subhook
  const subOpacity = interpolate(frame - 52, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame - 52, [0, 18], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chart enters right side
  const chartOpacity = interpolate(frame - 40, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chartY = interpolate(frame - 40, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brand top right
  const badgeOpacity = interpolate(frame - 68, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent bar height (left side white line)
  const barH = interpolate(frame - 34, [0, 22], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene exit
  const exitOpacity = interpolate(frame, [88, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Phase 1 — market flash */}
      <div style={{ opacity: flashOpacity, position: "absolute", inset: 0 }}>
        <MarketFlash frame={frame} />
      </div>

      {/* Phase 2 — main hook */}
      <div style={{ opacity: hookOpacity, position: "absolute", inset: 0 }}>
        {/* Left white accent bar */}
        <div
          style={{
            position: "absolute",
            left: 110,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: barH,
            background: WHITE,
            borderRadius: 2,
            opacity: 0.9,
          }}
        />

        {/* Main hook text */}
        <div
          style={{
            position: "absolute",
            left: 148,
            top: "50%",
            transform: `translateY(-50%) scale(${hookScale})`,
            transformOrigin: "left center",
            maxWidth: 900,
          }}
        >
          {/* "SET YOUR" — large white */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: WHITE,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              textTransform: "uppercase",
            }}
          >
            SET YOUR
          </div>
          {/* "LIMITS." — outlined / hollow style */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "transparent",
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              textTransform: "uppercase",
              WebkitTextStroke: `3px ${WHITE}`,
            }}
          >
            LIMITS.
          </div>

          {/* Subhook */}
          <div
            style={{
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
              marginTop: 28,
              fontSize: 28,
              fontWeight: 300,
              color: SILVER,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {config.subhook}
          </div>
        </div>

        {/* Risk chart — right side */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: "50%",
            transform: `translateY(-52%) translateY(${chartY}px)`,
            opacity: chartOpacity,
          }}
        >
          <RiskChart frame={Math.max(0, frame - 40)} />
        </div>

        {/* Brand badge — top right */}
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 100,
            opacity: badgeOpacity,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: WHITE,
              opacity: 0.7,
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: WHITE,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "0.14em",
              opacity: 0.8,
            }}
          >
            {config.brand.toUpperCase()}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
