// ── Scene 1: HOOK ─────────────────────────────────────────────────────────────
// Big bold hook slams in. Animated particles stream upward.
// Brand name sits top-right. Accent accent bar pulses below hook.

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { SceneProps } from "../types/AwardTypes";

export const Scene1: React.FC<SceneProps> = ({ scene, colors, brand }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const hookText = (scene.voiceover_text || "THE MARKET IS MOVING.").toUpperCase();
    const subText = scene.visual_description || "";

    // Jitter-style text entry: spring up from below
    const hookY = spring({ fps, frame, config: { damping: 14, stiffness: 110 } });
    const hookOp = spring({ fps, frame, config: { damping: 20, stiffness: 80 } });
    const subOp = spring({ fps, frame: frame - 18, config: { damping: 20 } });
    const subY = spring({ fps, frame: frame - 18, config: { damping: 14 } });
    const barW = spring({ fps, frame: frame - 5, config: { damping: 18, stiffness: 100 } });

    // Brand fade in
    const brandOp = spring({ fps, frame: frame - 5, config: { damping: 25 } });

    // Subtle camera zoom
    const cameraZoom = 1 + (frame / 180) * 0.04;

    // Floating particles (20 dots streaming upward)
    const particles = Array.from({ length: 20 }, (_, i) => {
        const speed = 0.8 + (i % 5) * 0.3;
        const startY = (i * 97) % 1920;
        const posY = ((startY - frame * speed * 1.5) + 1920 * 3) % 1920;
        const posX = 50 + (i * 143 + Math.sin(frame / 20 + i) * 30) % 980;
        return { posX, posY, opacity: 0.12 + (i % 3) * 0.06, size: 2 + (i % 3) };
    });

    return (
        <AbsoluteFill style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}>

            {/* Floating particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: p.posX,
                        top: p.posY,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        backgroundColor: colors.primary,
                        opacity: p.opacity,
                        filter: "blur(1px)",
                    }}
                />
            ))}

            {/* Brand name — top right */}
            <div style={{
                position: "absolute",
                top: 80,
                right: 80,
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: 28,
                color: colors.primary,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: brandOp,
            }}>
                {brand}
            </div>

            {/* Left accent bar — horizontal, color accent */}
            <div style={{
                position: "absolute",
                bottom: 370,
                left: 80,
                width: `${barW * 160}px`,
                height: 4,
                backgroundColor: colors.primary,
                borderRadius: 2,
                boxShadow: `0 0 12px ${colors.primary}`,
            }} />

            {/* HOOK TEXT */}
            <div style={{
                position: "absolute",
                bottom: 230,
                left: 80,
                right: 80,
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: hookText.length > 30 ? 58 : 72,
                color: colors.secondary,
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: "-2px",
                opacity: hookOp,
                transform: `translateY(${(1 - hookY) * 80}px)`,
            }}>
                {hookText}
            </div>

            {/* Sub-description — Glassmorphism container */}
            <div style={{
                position: "absolute",
                bottom: 120,
                left: 80,
                right: 300,
                padding: "24px 32px",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(12px) saturate(140%)",
                borderLeft: `4px solid ${colors.primary}`,
                borderRadius: "0 12px 12px 0",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 400,
                fontSize: 24,
                color: `${colors.secondary}cc`,
                lineHeight: 1.4,
                letterSpacing: "0.5px",
                opacity: subOp,
                transform: `translateX(${(1 - subY) * 30}px)`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
                {subText.length > 140 ? subText.substring(0, 140) + "…" : subText}
            </div>
        </AbsoluteFill>
    );
};
