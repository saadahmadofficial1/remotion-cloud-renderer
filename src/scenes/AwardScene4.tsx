// ── Scene 4: FEATURE 2 / STATS / CONTROL ─────────────────────────────────────
// Three animated stat counters at top. Feature text below. Premium card.
// Slow, elegant — confidence-building.

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { SceneProps } from "../types/AwardTypes";

export const Scene4: React.FC<SceneProps> = ({ scene, colors, brand }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const mainText = (scene.voiceover_text || "TOTAL CONTROL.").toUpperCase();
    const subText  = scene.visual_description || "";
    const badgeText = (scene.motion_graphics_instruction || "ZERO RISK").substring(0, 24).toUpperCase();

    // Elegant slow text entry
    const textOp  = spring({ fps, frame: frame - 20, config: { damping: 30, stiffness: 60 } });
    const textY   = spring({ fps, frame: frame - 20, config: { damping: 20, stiffness: 70 } });
    const subOp   = spring({ fps, frame: frame - 35, config: { damping: 30 } });

    // Stats data (fintech-appropriate)
    const stats = [
        { value: "1.2M+", label: "Active Traders" },
        { value: "0%",    label: "Commission"    },
        { value: "100%",  label: "Secure Funds"  },
    ];

    return (
        <AbsoluteFill>

            {/* Feature number — top right large ghost text */}
            <div style={{
                position: "absolute",
                top: 80,
                right: 60,
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: 120,
                color: `${colors.primary}15`,
                letterSpacing: "-8px",
                lineHeight: 1,
                userSelect: "none",
            }}>
                02
            </div>

            {/* Stats row */}
            <AbsoluteFill style={{
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: 200,
                paddingLeft: 60,
                paddingRight: 60,
                flexDirection: "column",
            }}>
                <div style={{
                    display: "flex",
                    gap: 0,
                    width: "100%",
                    justifyContent: "space-around",
                }}>
                    {stats.map((s, i) => {
                        const statOp = spring({ fps, frame: frame - i * 10, config: { damping: 20 } });
                        const statY  = spring({ fps, frame: frame - i * 10, config: { damping: 14, stiffness: 100 } });
                        return (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    opacity: statOp,
                                    transform: `translateY(${(1 - statY) * 40}px)`,
                                    padding: "24px 20px",
                                    background: `${colors.primary}08`,
                                    borderRadius: 24,
                                    border: `1px solid ${colors.primary}20`,
                                    minWidth: 240,
                                    boxShadow: `0 10px 30px rgba(0,0,0,0.4)`,
                                }}
                            >
                                <div style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 900,
                                    fontSize: 52,
                                    color: colors.primary,
                                    letterSpacing: "-2px",
                                    lineHeight: 1,
                                }}>
                                    {s.value}
                                </div>
                                <div style={{
                                    fontFamily: "Plus Jakarta Sans, sans-serif",
                                    fontWeight: 500,
                                    fontSize: 18,
                                    color: `${colors.secondary}60`,
                                    marginTop: 8,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                }}>
                                    {s.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </AbsoluteFill>

            {/* Main text + badge */}
            <AbsoluteFill style={{
                justifyContent: "flex-end",
                paddingBottom: 140,
                paddingLeft: 80,
                paddingRight: 80,
            }}>
                {/* Badge */}
                <div style={{
                    display: "inline-flex",
                    padding: "10px 28px",
                    background: `${colors.primary}18`,
                    border: `1px solid ${colors.primary}50`,
                    borderRadius: 50,
                    marginBottom: 24,
                    alignSelf: "flex-start",
                    opacity: spring({ fps, frame: frame - 10, config: { damping: 20 } }),
                }}>
                    <span style={{
                        fontFamily: "Plus Jakarta Sans, sans-serif",
                        fontWeight: 700,
                        fontSize: 17,
                        color: colors.primary,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                    }}>
                        {badgeText}
                    </span>
                </div>

                <div style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: mainText.length > 28 ? 58 : 68,
                    color: colors.secondary,
                    lineHeight: 1.05,
                    letterSpacing: "-2px",
                    textTransform: "uppercase",
                    opacity: textOp,
                    transform: `translateY(${(1 - textY) * 30}px)`,
                }}>
                    {mainText}
                </div>

                <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: 24,
                    color: `${colors.secondary}80`,
                    marginTop: 18,
                    lineHeight: 1.5,
                    opacity: subOp,
                }}>
                    {subText.length > 80 ? subText.substring(0, 80) + "…" : subText}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
