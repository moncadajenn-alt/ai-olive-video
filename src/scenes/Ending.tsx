/**
 * Ending – Walk away (5 s = 150 frames)
 * Bicho walks off carrying the bottle, glances at phone, looks forward.
 * Text: "just try it"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { SupermarketBg } from "../components/SupermarketBg";

export const ENDING_DURATION = 150;

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bicho walks from center to right
  const walkX = interpolate(frame, [0, 150], [-80, 500], { extrapolateRight: "clamp" });

  // Camera pans with bicho
  const panX = interpolate(frame, [0, 150], [0, -200], { extrapolateRight: "clamp" });

  // Happy bounce on walk
  const walkBounce = Math.abs(Math.sin((frame / fps) * Math.PI * 4)) * -12;

  // Phone glance: at frame ~70, bicho looks down (flipX moment), then looks forward
  const glanceOpacity = interpolate(frame, [65, 80, 100, 115], [0, 1, 1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const phoneGlanceX = interpolate(frame, [65, 80], [-60, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // "just try it" text fades in at frame 20, grows
  const textEntrance = spring({ frame: frame - 18, fps, config: { damping: 8, stiffness: 100 } });
  const textScale = interpolate(textEntrance, [0, 1], [0.5, 1], { extrapolateLeft: "clamp" });
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  // subtitle
  const subtitleEntrance = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 120 } });
  const subtitleOpacity = interpolate(subtitleEntrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const subtitleY = interpolate(subtitleEntrance, [0, 1], [24, 0], { extrapolateLeft: "clamp" });

  // sparkle burst at start
  const sparkProgress = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 90 } });
  const sparkScale = interpolate(sparkProgress, [0, 1], [0.2, 1], { extrapolateLeft: "clamp" });
  const sparkOpacity = interpolate(sparkProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  // Background gentle pulse
  const bgHue = 48 + Math.sin((frame / fps) * Math.PI * 0.5) * 3;
  const bgLightness = 93 + Math.sin((frame / fps) * Math.PI * 0.5) * 2;

  return (
    <AbsoluteFill style={{ background: `hsl(${bgHue}, 100%, ${bgLightness}%)`, overflow: "hidden" }}>
      <SupermarketBg panX={panX} brightness={0.85} />

      {/* ── sparkle burst ── */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = interpolate(sparkProgress, [0, 1], [0, 180], { extrapolateLeft: "clamp" });
        const x = 540 + Math.cos(rad) * dist;
        const y = 960 + Math.sin(rad) * dist;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            fontSize: i % 2 === 0 ? 28 : 20,
            opacity: sparkOpacity * 0.8,
            transform: `scale(${sparkScale})`,
          }}>
            {i % 2 === 0 ? "✨" : "⭐"}
          </div>
        );
      })}

      {/* ── Bicho walking with bottle ── */}
      <div style={{
        position: "absolute",
        bottom: 560,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateX(${walkX}px) translateY(${walkBounce}px)`,
      }}>
        <BichoCharacter expression="walking" scale={2.4} animate />
      </div>

      {/* ── Phone glance ── */}
      <div style={{
        position: "absolute",
        bottom: 560,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: glanceOpacity,
        transform: `translateX(${walkX + phoneGlanceX}px)`,
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: 20,
          padding: "12px 24px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
        }}>
          <span style={{ fontSize: 32 }}>📱</span>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 20, color: "#2D3436" }}>CLASSICO #1</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#00B894" }}>✓ Best choice confirmed</div>
          </div>
        </div>
      </div>

      {/* ── "just try it" text ── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 32, pointerEvents: "none",
      }}>
        <div style={{
          transform: `scale(${textScale})`, opacity: textOpacity,
          textAlign: "center",
          fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
          fontWeight: 900,
          fontSize: 112,
          color: "#2D3436",
          letterSpacing: "-2px",
          lineHeight: 1.0,
          textShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}>
          just
          <br />
          <span style={{
            background: "linear-gradient(135deg, #E17055, #FDCB6E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
          }}>try it</span>
          <div style={{ fontSize: 70, marginTop: 8 }}>👇</div>
        </div>

        <div style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          backgroundColor: "rgba(255,255,255,0.88)",
          borderRadius: 24, padding: "16px 44px",
          fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 30,
          color: "#636E72",
          boxShadow: "0 4px 22px rgba(0,0,0,0.09)",
          textAlign: "center",
        }}>
          open any AI app &amp; take a photo 📸
        </div>
      </div>
    </AbsoluteFill>
  );
};
