import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import config from "../../video.config.json";

const WHITE = "#ffffff";
const SILVER = "#e0e0e0";
const RED = "#ff3a52";
const DIM = "rgba(255,255,255,0.18)";

// Risk tool card — each tool gets its own card (Stop Loss, Take Profit, Price Alerts)
const RiskCard = ({
  stat,
  frame,
  delay,
  fps,
  index,
}: {
  stat: typeof config.stats[0];
  frame: number;
  delay: number;
  fps: number;
  index: number;
}) => {
  const localFrame = frame - delay;
  const cardScale = spring({ frame: localFrame, fps, config: { stiffness: 320, damping: 26 } });
  const cardOpacity = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(localFrame, [0, 22], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent color per card: Stop Loss = red, Take Profit = white, Price Alerts = silver
  const accentColors = [RED, WHITE, SILVER];
  const accent = accentColors[index] ?? WHITE;

  // Animated underline grows
  const lineW = interpolate(localFrame, [10, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Icon SVG paths for each tool
  const icons = [
    // Stop Loss — shield with X
    <svg key="sl" width={36} height={36} viewBox="0 0 36 36" fill="none">
      <path d="M18 3 L32 9 L32 20 C32 27 18 33 18 33 C18 33 4 27 4 20 L4 9 Z" stroke={RED} strokeWidth={2} fill="none" />
      <line x1="13" y1="13" x2="23" y2="23" stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <line x1="23" y1="13" x2="13" y2="23" stroke={RED} strokeWidth={2} strokeLinecap="round" />
    </svg>,
    // Take Profit — target circle
    <svg key="tp" width={36} height={36} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" stroke={WHITE} strokeWidth={2} opacity={0.5} />
      <circle cx="18" cy="18" r="9" stroke={WHITE} strokeWidth={2} opacity={0.7} />
      <circle cx="18" cy="18" r="4" fill={WHITE} />
    </svg>,
    // Price Alerts — bell
    <svg key="pa" width={36} height={36} viewBox="0 0 36 36" fill="none">
      <path d="M18 4 C24 4 28 8 28 15 L28 22 L31 25 L5 25 L8 22 L8 15 C8 8 12 4 18 4 Z" stroke={SILVER} strokeWidth={2} fill="none" />
      <path d="M15 25 C15 26.7 16.3 28 18 28 C19.7 28 21 26.7 21 25" stroke={SILVER} strokeWidth={2} fill="none" />
    </svg>,
  ];

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `scale(${cardScale}) translateY(${cardY}px)`,
        flex: 1,
        background: "rgba(255,255,255,0.025)",
        borderRadius: 16,
        border: `1px solid rgba(255,255,255,0.08)`,
        borderTop: `2px solid ${accent}`,
        padding: "40px 36px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Icon */}
      <div style={{ marginBottom: 4 }}>
        {icons[index]}
      </div>

      {/* Tool name — large */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: WHITE,
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {stat.suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: SILVER,
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        {stat.label}
      </div>

      {/* Sublabel */}
      <div
        style={{
          fontSize: 14,
          color: DIM,
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          lineHeight: 1.5,
        }}
      >
        {stat.sublabel}
      </div>

      {/* Animated accent underline */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 1,
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${lineW}%`,
            background: accent,
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
};

export const StatsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header
  const headerOpacity = interpolate(frame - 5, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame - 5, [0, 18], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Thin line that draws across under eyebrow
  const lineW = interpolate(frame - 8, [0, 24], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity * exitOpacity }}>
      {/* Eyebrow row */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 140,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            width: lineW,
            height: 1,
            background: WHITE,
            opacity: 0.5,
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: SILVER,
            fontFamily: "'SF Mono', monospace",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          RISK MANAGEMENT TOOLS
        </span>
      </div>

      {/* Section headline */}
      <div
        style={{
          position: "absolute",
          top: 118,
          left: 140,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 66,
            fontWeight: 900,
            color: WHITE,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
          }}
        >
          You control
          <br />
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: `2.5px ${WHITE}`,
            }}
          >
            every outcome.
          </span>
        </div>
      </div>

      {/* Tool cards */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 140,
          right: 140,
          display: "flex",
          gap: 22,
        }}
      >
        {config.stats.map((stat, i) => (
          <RiskCard key={i} stat={stat} frame={frame} delay={16 + i * 18} fps={fps} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
