import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import config from "../../video.config.json";

const WHITE = "#ffffff";
const SILVER = "#e0e0e0";
const RED = "#ff3a52";
const DIM = "rgba(255,255,255,0.18)";

// Trust badge — minimal white/silver style
const TrustBadge = ({
  label,
  frame,
  delay,
  fps,
}: {
  label: string;
  frame: number;
  delay: number;
  fps: number;
}) => {
  const localFrame = frame - delay;
  const scale = spring({ frame: localFrame, fps, config: { stiffness: 320, damping: 22 } });
  const opacity = interpolate(localFrame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "10px 18px",
      }}
    >
      {/* Checkmark */}
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.5" stroke={SILVER} strokeWidth={1} opacity={0.5} />
        <path d="M4 7 L6.2 9.2 L10 5" stroke={SILVER} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      </svg>
      <span
        style={{
          fontSize: 13,
          color: SILVER,
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 500,
          letterSpacing: "0.02em",
          opacity: 0.7,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textScale = spring({ frame: frame - 10, fps, config: { stiffness: 240, damping: 24 } });
  const textOpacity = interpolate(frame - 10, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame - 28, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame - 28, [0, 18], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btnScale = spring({ frame: frame - 42, fps, config: { stiffness: 380, damping: 22 } });
  const btnOpacity = interpolate(frame - 42, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shimmer on button
  const shimmer = interpolate(frame - 46, [0, 55], [-160, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing ring
  const ringScale = 1 + interpolate(frame % 45, [0, 45], [0, 0.5]);
  const ringOpacity = interpolate(frame % 45, [0, 22, 45], [0.4, 0.08, 0]);

  const urlOpacity = interpolate(frame - 62, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trustBadges = ["FCA Regulated", "Segregated Funds", "Guaranteed Stop", "Instant Withdrawals"];

  // Subtle line accent grows across
  const accentLineW = interpolate(frame - 6, [0, 30], [0, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Top-left brand */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 140,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: textOpacity * 0.7,
        }}
      >
        <div style={{ width: accentLineW, height: 1, background: WHITE, opacity: 0.3 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: WHITE, fontFamily: "'SF Pro Display', sans-serif", letterSpacing: "0.14em", opacity: 0.6 }}>
          {config.brand.toUpperCase()}
        </span>
      </div>

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 12,
            color: SILVER,
            fontFamily: "'SF Mono', monospace",
            letterSpacing: "0.28em",
            marginBottom: 28,
            opacity: textOpacity * 0.5,
            textTransform: "uppercase",
          }}
        >
          Risk less. Trade smarter.
        </div>

        {/* Main headline */}
        <div style={{ opacity: textOpacity, transform: `scale(${textScale})`, textAlign: "center" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 900,
              color: WHITE,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
            }}
          >
            Protect Your
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: `3px ${WHITE}`,
              fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              marginBottom: 8,
            }}
          >
            Capital.
          </div>
        </div>

        {/* Subline */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontSize: 20,
            color: DIM,
            fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
            textAlign: "center",
            marginTop: 24,
            marginBottom: 48,
            letterSpacing: "0.01em",
          }}
        >
          {config.tagline}
        </div>

        {/* CTA Button — white on black */}
        <div style={{ position: "relative", opacity: btnOpacity, transform: `scale(${btnScale})` }}>
          {/* Pulsing ring */}
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: 100,
              border: `1.5px solid rgba(255,255,255,0.3)`,
              opacity: ringOpacity,
              transform: `scale(${ringScale})`,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: WHITE,
              borderRadius: 100,
              padding: "22px 60px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#000000",
                fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              {config.cta}
            </span>
            {/* Arrow */}
            <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <path d="M4 11 H18 M13 6 L18 11 L13 16" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Shimmer sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 80,
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
                transform: `translateX(${shimmer}px)`,
              }}
            />
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {trustBadges.map((badge, i) => (
            <TrustBadge key={i} label={badge} frame={frame} delay={52 + i * 8} fps={fps} />
          ))}
        </div>
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: urlOpacity,
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.18)",
            fontFamily: "'SF Mono', monospace",
            letterSpacing: "0.16em",
          }}
        >
          {config.ctaUrl}
        </span>
      </div>
    </AbsoluteFill>
  );
};
