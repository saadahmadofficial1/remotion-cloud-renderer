/**
 * AnimatedBackground.tsx
 * Capital.com "Set your limits" style — pure black background.
 * Uses @remotion/noise for organic, non-repeating particle movement.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

const BG     = "#000000";
const SILVER = "#e0e0e0";
const RED    = "#ff3a52";

// ─── Noise-driven particle ────────────────────────────────────────────────────
// Each particle uses 2D Perlin noise for smooth, non-repeating organic drift
const NoiseParticle = ({
  id,
  baseX,
  baseY,
  size,
  opacity,
  speed,
}: {
  id: string;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
}) => {
  const frame = useCurrentFrame();
  const t = frame * speed * 0.008;

  // noise2D returns -1 to 1 — separate seeds for x and y drift
  const driftX = noise2D(`${id}-x`, t, 0) * 12;  // ±12% drift
  const driftY = noise2D(`${id}-y`, 0, t) * 12;

  // Subtle pulse using noise — no linear repetition
  const pulse = (noise2D(`${id}-p`, t * 0.5, 0) + 1) / 2; // 0→1
  const finalOpacity = opacity * (0.3 + pulse * 0.7);

  return (
    <div
      style={{
        position: "absolute",
        left: `${baseX + driftX}%`,
        top: `${baseY + driftY}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: SILVER,
        opacity: finalOpacity,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

const PARTICLES = [
  { id: "a", baseX: 8,  baseY: 18, size: 2,   opacity: 0.35, speed: 1.0 },
  { id: "b", baseX: 22, baseY: 72, size: 1.5, opacity: 0.25, speed: 0.7 },
  { id: "c", baseX: 40, baseY: 35, size: 2.5, opacity: 0.30, speed: 1.3 },
  { id: "d", baseX: 60, baseY: 82, size: 1.5, opacity: 0.22, speed: 0.6 },
  { id: "e", baseX: 75, baseY: 22, size: 2,   opacity: 0.28, speed: 1.1 },
  { id: "f", baseX: 88, baseY: 58, size: 1.5, opacity: 0.25, speed: 0.8 },
  { id: "g", baseX: 30, baseY: 90, size: 2,   opacity: 0.30, speed: 1.4 },
  { id: "h", baseX: 52, baseY: 12, size: 1.5, opacity: 0.20, speed: 0.9 },
  { id: "i", baseX: 14, baseY: 60, size: 3,   opacity: 0.15, speed: 0.5 },
  { id: "j", baseX: 82, baseY: 78, size: 2,   opacity: 0.28, speed: 1.2 },
  { id: "k", baseX: 48, baseY: 48, size: 1,   opacity: 0.18, speed: 1.6 },
  { id: "l", baseX: 95, baseY: 30, size: 2,   opacity: 0.22, speed: 0.75 },
];

// ─── Subtle horizontal scan line ─────────────────────────────────────────────
const ScanLine = ({ frame }: { frame: number }) => {
  const y   = interpolate(frame % 160, [0, 160], [-2, 102]);
  const opc = interpolate(frame % 160, [0, 10, 140, 160], [0, 0.05, 0.05, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${y}%`,
        height: 1,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
        opacity: opc,
      }}
    />
  );
};

// ─── Noise-animated candlestick chart in background ───────────────────────────
const BackgroundChart = ({ frame }: { frame: number }) => {
  const candles = [
    { open: 500, high: 560, low: 460, close: 540, bull: true },
    { open: 540, high: 580, low: 510, close: 525, bull: false },
    { open: 525, high: 570, low: 480, close: 555, bull: true },
    { open: 555, high: 610, low: 530, close: 590, bull: true },
    { open: 590, high: 620, low: 540, close: 545, bull: false },
    { open: 545, high: 590, low: 510, close: 575, bull: true },
    { open: 575, high: 640, low: 560, close: 630, bull: true },
    { open: 630, high: 660, low: 580, close: 590, bull: false },
    { open: 590, high: 650, low: 570, close: 640, bull: true },
    { open: 640, high: 690, low: 620, close: 680, bull: true },
  ];
  const W = 1920;
  const H = 400;
  const step = W / candles.length;
  const toY = (v: number) => H - ((v - 420) / 320) * H;

  return (
    <svg
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.04 }}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      {candles.map((c, i) => {
        const t = frame * 0.005;
        const drift = noise2D(`candle-${i}`, t, 0) * 8;
        const x = i * step + step * 0.3;
        const bw = step * 0.4;
        const adjustedClose = c.close + drift;
        const bodyTop = Math.min(toY(c.open), toY(adjustedClose));
        const bodyH = Math.abs(toY(c.open) - toY(adjustedClose));
        const color = c.bull ? SILVER : RED;
        return (
          <g key={i}>
            <line x1={x + bw / 2} y1={toY(c.high)} x2={x + bw / 2} y2={toY(c.low)} stroke={color} strokeWidth={1.5} opacity={0.6} />
            <rect x={x} y={bodyTop} width={bw} height={Math.max(2, bodyH)} fill={color} rx={2} opacity={0.8} />
          </g>
        );
      })}
    </svg>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const AnimatedBackground = ({ frame }: { frame: number }) => {
  return (
    <div style={{ position: "absolute", inset: 0, background: BG, overflow: "hidden" }}>
      {/* Noise-animated candlestick chart — bottom, very subtle */}
      <BackgroundChart frame={frame} />

      {/* Fine dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vertical guide lines */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i + 1) * (100 / 13)}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: "rgba(255,255,255,0.012)",
          }}
        />
      ))}

      {/* Horizontal guide lines */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${(i + 1) * (100 / 7)}%`,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(255,255,255,0.012)",
          }}
        />
      ))}

      {/* Noise-driven organic particles */}
      {PARTICLES.map((p) => (
        <NoiseParticle key={p.id} {...p} />
      ))}

      {/* Scan line */}
      <ScanLine frame={frame} />

      {/* Top vignette */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 180,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.96), transparent)",
        }}
      />

      {/* Bottom vignette */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 220,
          background: "linear-gradient(to top, rgba(0,0,0,0.98), transparent)",
        }}
      />
    </div>
  );
};
