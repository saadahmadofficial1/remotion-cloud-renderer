// ── Scene 5: CTA / BRAND REVEAL ───────────────────────────────────────────────
// Massive brand reveal. Light sweep expanding from center.
// CTA text below. Shimmer line separator. URL at bottom.

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { SceneProps } from "../types/AwardTypes";

export const Scene5: React.FC<SceneProps> = ({ scene, colors, brand }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const ctaText  = scene.voiceover_text || "START TRADING NOW.";
    const subText  = scene.visual_description || "";
    const brandUrl = `${brand.toLowerCase().replace(/\s/g, "")}.com`;

    const logoScale = spring({ fps, frame: frame - 5,  config: { mass: 1.5, damping: 14, stiffness: 80 } });
    const logoOp    = spring({ fps, frame,             config: { damping: 25, stiffness: 80 } });
    const sweepR    = spring({ fps, frame: frame - 15, config: { mass: 3, damping: 35, stiffness: 50 } }) * 60;
    const ctaOp     = spring({ fps, frame: frame - 40, config: { damping: 20 } });
    const ctaY      = spring({ fps, frame: frame - 40, config: { damping: 14, stiffness: 100 } });
    const lineW     = spring({ fps, frame: frame - 32, config: { damping: 18, stiffness: 100 } });
    const urlOp     = spring({ fps, frame: frame - 55, config: { damping: 22 } });
    const shimmerX  = (frame * 8) % 300;
    const glowPulse = 0.08 + Math.abs(Math.sin(frame / 20)) * 0.06;

    return (
        <AbsoluteFill>
            {/* Light sweep radial expansion */}
            <AbsoluteFill style={{
                background: `radial-gradient(circle at 50% 45%, ${colors.primary} ${sweepR}%, transparent ${sweepR + 30}%)`,
                opacity: glowPulse,
            }} />

            {/* Ambient glow */}
            <AbsoluteFill style={{
                background: `radial-gradient(ellipse at 50% 40%, ${colors.primary}22 0%, transparent 55%)`,
            }} />

            <AbsoluteFill style={{
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 80,
            }}>
                {/* Brand name reveal */}
                <div style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: brand.length > 10 ? 90 : 120,
                    color: colors.secondary,
                    letterSpacing: "-5px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    opacity: logoOp,
                    transform: `scale(${0.5 + logoScale * 0.5})`,
                    textShadow: `0 0 60px ${colors.primary}40, 0 20px 50px rgba(0,0,0,0.6)`,
                    lineHeight: 1,
                }}>
                    {brand.toUpperCase()}
                </div>

                {/* Shimmer separator line */}
                <div style={{
                    width: `${lineW * 400}px`,
                    height: 2,
                    borderRadius: 2,
                    marginTop: 32,
                    marginBottom: 32,
                    position: "relative",
                    overflow: "hidden",
                    background: `${colors.primary}40`,
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: `${shimmerX - 60}px`,
                        width: 60,
                        height: "100%",
                        background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)`,
                    }} />
                </div>

                {/* CTA text */}
                <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 700,
                    fontSize: 38,
                    color: colors.primary,
                    textAlign: "center",
                    letterSpacing: 1,
                    opacity: ctaOp,
                    transform: `translateY(${(1 - ctaY) * 25}px)`,
                }}>
                    {ctaText}
                </div>

                {subText ? (
                    <div style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 400,
                        fontSize: 22,
                        color: `${colors.secondary}50`,
                        textAlign: "center",
                        marginTop: 16,
                        maxWidth: 700,
                        lineHeight: 1.5,
                        opacity: urlOp,
                    }}>
                        {subText.length > 70 ? subText.substring(0, 70) + "..." : subText}
                    </div>
                ) : null}

                {/* URL */}
                <div style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 500,
                    fontSize: 22,
                    color: `${colors.secondary}35`,
                    textAlign: "center",
                    marginTop: 48,
                    letterSpacing: 2,
                    opacity: urlOp,
                }}>
                    {brandUrl}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
