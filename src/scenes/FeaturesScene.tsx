import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import config from "../../video.config.json";

const WHITE = "#ffffff";
const SILVER = "#e0e0e0";
const RED = "#ff3a52";
const DIM = "rgba(255,255,255,0.20)";

// Capital.com-style limit order UI panel
const LimitOrderUI = ({ frame }: { frame: number }) => {
  const uiOpacity = interpolate(frame - 10, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const uiScale = spring({ frame: frame - 10, fps: 30, config: { stiffness: 200, damping: 24 } });

  // Animated line — goes up then crashes
  const lineProgress = interpolate(frame - 15, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const allPoints = [
    [0, 100], [40, 86], [80, 92], [120, 72], [150, 58],
    [180, 90], [210, 115], [240, 108], [280, 82], [320, 60], [360, 40],
  ];
  const visibleCount = Math.max(2, Math.floor(allPoints.length * lineProgress));
  const vPts = allPoints.slice(0, visibleCount);
  const pathD = vPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  // Stop loss and take profit line Y values
  const slY = 108;
  const tpY = 40;
  const showLines = lineProgress > 0.4;

  // Animated price counter
  const price = interpolate(frame - 15, [0, 70], [67240, 65810], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isDown = true;

  return (
    <div
      style={{
        opacity: uiOpacity,
        transform: `scale(${uiScale})`,
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        overflow: "hidden",
        width: 500,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: WHITE, opacity: 0.6 }} />
          <span style={{ fontSize: 13, color: WHITE, fontFamily: "'SF Mono', monospace", fontWeight: 600, opacity: 0.85 }}>
            BTC/USD
          </span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'SF Mono', monospace" }}>
          LIVE · 1H
        </span>
      </div>

      {/* Price */}
      <div style={{ padding: "14px 20px 6px" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: WHITE, fontFamily: "'SF Mono', monospace", letterSpacing: "-0.02em" }}>
          {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: 13, color: RED, fontFamily: "'SF Mono', monospace", marginTop: 4 }}>
          ▼ -$1,430.00 (-2.09%)
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: "0 20px 10px", position: "relative" }}>
        <svg width="100%" height={130} viewBox="0 0 370 130" style={{ overflow: "visible" }}>
          {/* Take profit line — white */}
          {showLines && (
            <line x1={0} y1={tpY} x2={370} y2={tpY} stroke={WHITE} strokeWidth={1} strokeDasharray="8 5" opacity={0.35} />
          )}
          {showLines && (
            <text x={4} y={tpY - 4} fill={WHITE} fontSize={9} fontFamily="'SF Mono', monospace" opacity={0.4}>TAKE PROFIT</text>
          )}

          {/* Price line */}
          <path d={pathD} fill="none" stroke={WHITE} strokeWidth={2} strokeLinecap="round" opacity={0.7} />

          {/* Stop loss line — red */}
          {showLines && (
            <line x1={0} y1={slY} x2={370} y2={slY} stroke={RED} strokeWidth={1.5} strokeDasharray="8 5" opacity={0.6} />
          )}
          {showLines && (
            <text x={4} y={slY + 12} fill={RED} fontSize={9} fontFamily="'SF Mono', monospace" opacity={0.6}>STOP LOSS</text>
          )}

          {/* Current price dot */}
          {vPts.length > 1 && (
            <circle
              cx={vPts[vPts.length - 1][0]}
              cy={vPts[vPts.length - 1][1]}
              r={4}
              fill={WHITE}
              opacity={0.8}
            />
          )}
        </svg>
      </div>

      {/* Limit order row */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Stop Loss */}
        <div
          style={{
            flex: 1,
            padding: "14px 16px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,58,82,0.06)",
          }}
        >
          <div style={{ fontSize: 10, color: RED, fontFamily: "'SF Mono', monospace", marginBottom: 6, letterSpacing: "0.1em" }}>STOP LOSS</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: RED, fontFamily: "'SF Mono', monospace" }}>64,500.00</div>
        </div>

        {/* Take Profit */}
        <div
          style={{
            flex: 1,
            padding: "14px 16px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div style={{ fontSize: 10, color: SILVER, fontFamily: "'SF Mono', monospace", marginBottom: 6, letterSpacing: "0.1em" }}>TAKE PROFIT</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: WHITE, fontFamily: "'SF Mono', monospace" }}>71,000.00</div>
        </div>
      </div>

      {/* Set Limits button */}
      <div
        style={{
          margin: "12px 16px",
          padding: "13px",
          textAlign: "center",
          background: WHITE,
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: "#000", fontFamily: "'SF Pro Display', sans-serif", letterSpacing: "0.05em" }}>
          SET LIMITS
        </span>
      </div>
    </div>
  );
};

// Feature row — each risk management feature
const FeatureRow = ({
  feature,
  frame,
  delay,
  fps,
  index,
}: {
  feature: typeof config.features[0];
  frame: number;
  delay: number;
  fps: number;
  index: number;
}) => {
  const localFrame = frame - delay;
  const opacity = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(localFrame, [0, 20], [-28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotScale = spring({ frame: localFrame - 8, fps, config: { stiffness: 450, damping: 22 } });

  // Color per feature
  const dotColors = [RED, WHITE, SILVER, "rgba(255,255,255,0.4)"];
  const dotColor = dotColors[index] ?? WHITE;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        padding: "18px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Dot indicator */}
      <div
        style={{
          transform: `scale(${Math.max(0, dotScale)})`,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
          marginTop: 6,
          opacity: index === 0 ? 1 : 0.7,
        }}
      />

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: WHITE,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          {feature.title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: DIM,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            lineHeight: 1.6,
          }}
        >
          {feature.description}
        </div>
      </div>
    </div>
  );
};

export const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerOpacity = interpolate(frame - 5, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame - 5, [0, 18], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const uiX = interpolate(frame - 8, [0, 30], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const uiOpacity = interpolate(frame - 8, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity * exitOpacity }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 68,
          left: 140,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: SILVER,
            fontFamily: "'SF Mono', monospace",
            letterSpacing: "0.28em",
            marginBottom: 14,
            opacity: 0.5,
          }}
        >
          FULL SUITE
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: WHITE,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
          }}
        >
          Every tool to
          <br />
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: `2px ${WHITE}`,
            }}
          >
            protect your trade.
          </span>
        </div>
      </div>

      {/* Left — feature list */}
      <div
        style={{
          position: "absolute",
          top: 248,
          left: 140,
          width: 660,
          bottom: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {config.features.map((feature, i) => (
          <FeatureRow
            key={i}
            feature={feature}
            frame={frame}
            delay={18 + i * 14}
            fps={fps}
            index={i}
          />
        ))}
      </div>

      {/* Right — Limit Order UI */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: `translateY(-50%) translateX(${uiX}px)`,
          opacity: uiOpacity,
        }}
      >
        <LimitOrderUI frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
