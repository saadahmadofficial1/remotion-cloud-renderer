import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { SceneColors } from "../types/AwardTypes";

interface Props {
  colors?: SceneColors;
  // Legacy square compat
  color1?: string;
  color2?: string;
}

export const CinematicBackground: React.FC<Props> = ({ colors, color1, color2 }) => {
    const frame = useCurrentFrame();
    const { height, width } = useVideoConfig();

    const bg      = colors?.bg      || color1 || "#05050f";
    const primary = colors?.primary || color2 || "#00ffd0";

    // Slow pan for the premium noise overlay
    const offsetY = (frame * 0.3) % height;

    // Animated ambient orb position
    const orbX = 50 + Math.sin(frame / 90) * 15;
    const orbY = 30 + Math.cos(frame / 120) * 10;

    // Subtle dot grid animation
    const gridOffset = (frame * 0.8) % 80;

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
            {/* Deep gradient base */}
            <AbsoluteFill
                style={{
                    background: `radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, ${bg} 65%)`,
                }}
            />

            {/* Animated dot grid — premium fintech feel */}
            <AbsoluteFill
                style={{
                    backgroundImage: `radial-gradient(circle, ${primary}18 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                    backgroundPosition: `0 ${gridOffset}px`,
                    opacity: 0.6,
                }}
            />

            {/* Slow-moving primary ambient glow */}
            <AbsoluteFill
                style={{
                    background: `radial-gradient(circle at ${orbX}% ${orbY}%, ${primary}14 0%, transparent 55%)`,
                }}
            />

            {/* Secondary bottom-left glow */}
            <AbsoluteFill
                style={{
                    background: `radial-gradient(circle at 15% 80%, ${primary}08 0%, transparent 40%)`,
                    transform: `translateX(${Math.sin(frame / 70) * 30}px)`,
                }}
            />

            {/* Subtle horizontal scan line sweep */}
            <AbsoluteFill
                style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${primary}06 50%, transparent 100%)`,
                    transform: `translateY(${(frame * 1.5) % (height * 2) - height}px)`,
                }}
            />

            {/* Premium film grain / noise layer */}
            <svg
                viewBox={`0 0 ${width} ${height}`}
                style={{
                    position: "absolute",
                    top: -height + offsetY,
                    left: 0,
                    width: "100%",
                    height: "200%",
                    opacity: 0.045,
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                }}
            >
                <filter id="noise-bg">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise-bg)" />
            </svg>

            {/* Bottom vignette */}
            <AbsoluteFill style={{ background: `linear-gradient(to top, ${bg} 0%, transparent 30%)` }} />
            {/* Top vignette */}
            <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${bg} 0%, transparent 20%)` }} />
        </AbsoluteFill>
    );
};
