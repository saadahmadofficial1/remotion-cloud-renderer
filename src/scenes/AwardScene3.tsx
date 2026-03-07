// ── Scene 3: FEATURE 1 / ACTION ───────────────────────────────────────────────
// Speed lines behind. Feature title slams in center.
// Badge chip and description text below. Energetic, fast-paced.

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { SceneProps } from "../types/AwardTypes";

export const Scene3: React.FC<SceneProps> = ({ scene, colors, brand }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const mainText  = (scene.voiceover_text || "UNMATCHED SPEED.").toUpperCase();
    const subText   = scene.visual_description || "";
    const badgeText = (scene.motion_graphics_instruction || "CORE FEATURE").substring(0, 28).toUpperCase();

    // Ultra-fast scale in
    const textScale = spring({ fps, frame, config: { damping: 10, mass: 0.3, stiffness: 220 } });
    const textOp    = spring({ fps, frame, config: { damping: 15, stiffness: 150 } });
    const subOp     = spring({ fps, frame: frame - 20, config: { damping: 20 } });
    const badgeOp   = spring({ fps, frame: frame - 30, config: { damping: 20 } });
    const badgeX    = spring({ fps, frame: frame - 30, config: { damping: 14, stiffness: 120 } });

    // Speed lines — vertical streaks moving fast
    const speedLines = Array.from({ length: 12 }, (_, i) => ({
        left: `${6 + i * 7.5}%`,
        speed: 35 + (i % 4) * 15,
        opacity: 0.06 + (i % 3) * 0.03,
        width: 2 + (i % 2),
    }));

    return (
        <AbsoluteFill>

            {/* Speed line background */}
            {speedLines.map((sl, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: sl.left,
                        top: 0,
                        width: sl.width,
                        height: "100%",
                        background: `linear-gradient(to bottom, transparent 0%, ${colors.primary} 40%, ${colors.primary} 60%, transparent 100%)`,
                        transform: `translateY(${(frame * sl.speed + i * 200) % 2200 - 1100}px)`,
                        opacity: sl.opacity,
                        filter: "blur(2px)",
                    }}
                />
            ))}

            {/* Feature number indicator — top left */}
            <div style={{
                position: "absolute",
                top: 100,
                left: 80,
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: 120,
                color: `${colors.primary}18`,
                letterSpacing: "-8px",
                lineHeight: 1,
                userSelect: "none",
            }}>
                01
            </div>

            {/* Center content block */}
            <AbsoluteFill style={{
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 80,
                paddingRight: 80,
                paddingTop: 80,
            }}>
                {/* Animated accent ring */}
                <div style={{
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    border: `2px solid ${colors.primary}30`,
                    transform: `scale(${spring({ fps, frame, config: { mass: 2, damping: 20, stiffness: 60 } })}) rotate(${frame * 0.5}deg)`,
                    opacity: 0.5,
                }} />

                {/* Main feature text */}
                <div style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: mainText.length > 25 ? 66 : 84,
                    color: colors.primary,
                    lineHeight: 1.0,
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "-3px",
                    opacity: textOp,
                    transform: `scale(${0.6 + textScale * 0.4})`,
                    textShadow: `0 0 60px ${colors.primary}50`,
                }}>
                    {mainText}
                </div>

                {/* Feature description */}
                <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 400,
                    fontSize: 26,
                    color: `${colors.secondary}99`,
                    textAlign: "center",
                    marginTop: 28,
                    maxWidth: 800,
                    lineHeight: 1.5,
                    opacity: subOp,
                }}>
                    {subText.length > 80 ? subText.substring(0, 80) + "…" : subText}
                </div>

                {/* Badge chip */}
                <div style={{
                    marginTop: 48,
                    padding: "14px 36px",
                    border: `1px solid ${colors.primary}60`,
                    borderRadius: 50,
                    background: `${colors.primary}10`,
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: colors.primary,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    opacity: badgeOp,
                    transform: `translateY(${(1 - badgeX) * 20}px)`,
                    boxShadow: `0 0 20px ${colors.primary}20`,
                }}>
                    {badgeText}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
