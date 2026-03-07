// ── Scene 2: MARKET / DATA VISUALIZATION ─────────────────────────────────────
// Glassmorphism panel slides up with animated chart bars.
// Text slides in from left. Premium fintech aesthetic.

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { SceneProps } from "../types/AwardTypes";

export const Scene2: React.FC<SceneProps> = ({ scene, colors, brand }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const mainText = (scene.voiceover_text || "THE MARKET IS SHIFTING.").toUpperCase();
    const subText  = scene.visual_description || "";

    // Panel slide up
    const panelY  = spring({ fps, frame, config: { damping: 15, mass: 1.2, stiffness: 80 } });
    const panelOp = spring({ fps, frame, config: { damping: 20, stiffness: 70 } });

    // Text slide from left
    const textX  = spring({ fps, frame: frame - 15, config: { damping: 12, stiffness: 120, mass: 0.6 } });
    const textOp = spring({ fps, frame: frame - 15, config: { damping: 20 } });

    // Sub-text
    const subOp = spring({ fps, frame: frame - 28, config: { damping: 20 } });

    // Bar chart heights (simulated market data — randomized but deterministic)
    const barHeights = [0.35, 0.65, 0.45, 0.88, 0.55, 0.72, 1.0, 0.78];
    const barColors  = [
        colors.primary, colors.primary, colors.primary,
        colors.primary, colors.primary, colors.primary,
        colors.primary, colors.primary,
    ];

    return (
        <AbsoluteFill>

            {/* ── Glassmorphism chart panel ── */}
            <AbsoluteFill style={{
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 180,
                transform: `translateY(${(1 - panelY) * 250}px)`,
                opacity: panelOp,
            }}>
                <div style={{
                    width: "86%",
                    height: 380,
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRadius: 32,
                    border: `1px solid ${colors.primary}18`,
                    boxShadow: `0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
                    padding: "36px 40px",
                    overflow: "hidden",
                }}>
                    {/* Panel header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                    }}>
                        <div style={{
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            fontSize: 18,
                            fontWeight: 600,
                            color: `${colors.secondary}60`,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                        }}>
                            Market Index
                        </div>
                        <div style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            fontSize: 22,
                            fontWeight: 700,
                            color: colors.primary,
                        }}>
                            +24.7%
                        </div>
                    </div>

                    {/* Animated bar chart */}
                    <div style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-end",
                        height: 180,
                    }}>
                        {barHeights.map((h, i) => {
                            const barSpring = spring({
                                fps,
                                frame: frame - 8 - i * 3,
                                config: { damping: 13, stiffness: 100 }
                            });
                            const isLast = i === barHeights.length - 1;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: `${h * 100}%`,
                                        background: isLast
                                            ? colors.primary
                                            : `linear-gradient(to top, ${colors.primary}CC 0%, ${colors.primary}40 100%)`,
                                        borderRadius: "6px 6px 0 0",
                                        transform: `scaleY(${barSpring})`,
                                        transformOrigin: "bottom",
                                        boxShadow: isLast ? `0 0 20px ${colors.primary}60` : "none",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </AbsoluteFill>

            {/* ── Main text block ── */}
            <AbsoluteFill style={{
                justifyContent: "flex-end",
                paddingBottom: 140,
                paddingLeft: 80,
                paddingRight: 80,
            }}>
                {/* Accent line */}
                <div style={{
                    width: spring({ fps, frame: frame - 10, config: { damping: 18 } }) * 100,
                    height: 3,
                    backgroundColor: colors.primary,
                    marginBottom: 28,
                    borderRadius: 2,
                }} />

                <div style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: mainText.length > 28 ? 58 : 68,
                    color: colors.secondary,
                    lineHeight: 1.05,
                    letterSpacing: "-2px",
                    textTransform: "uppercase",
                    opacity: textOp,
                    transform: `translateX(${(1 - textX) * -80}px)`,
                }}>
                    {mainText}
                </div>

                <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: 24,
                    color: `${colors.secondary}88`,
                    marginTop: 18,
                    lineHeight: 1.5,
                    opacity: subOp,
                }}>
                    {subText.length > 85 ? subText.substring(0, 85) + "…" : subText}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
