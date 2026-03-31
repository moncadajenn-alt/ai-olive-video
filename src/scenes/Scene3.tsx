/**
 * Scene 3 – Idea moment (5 s)
 * Bicho pauses → idea bubble pops with dialogue → expression shifts curious → reaches for phone
 * Text: "use AI"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { SupermarketBg } from "../components/SupermarketBg";

export const SCENE3_DURATION = 150;

/* ── Phone close-up ── */
const PhoneCloseUp: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - 100, fps, config: { damping: 12, stiffness: 120 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  const tapFrame = Math.max(0, frame - 128);
  const tapScale = spring({ frame: tapFrame, fps, config: { damping: 6, stiffness: 300 } });
  const pawScale = interpolate(tapScale, [0, 0.5, 1], [1, 0.7, 1], { extrapolateLeft: "clamp" });

  if (!visible) return null;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity,
      transform: `scale(${s})`,
    }}>
      <div style={{ position: "relative" }}>
        <div style={{
          width: 560, height: 900,
          backgroundColor: "#1A1A2E",
          borderRadius: 56, padding: 20,
          boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
        }}>
          <div style={{ width: 70, height: 10, backgroundColor: "#0D0D1A", borderRadius: 5, margin: "0 auto 10px" }} />
          <div style={{
            width: "100%", height: "calc(100% - 20px)",
            backgroundColor: "#F8F9FA",
            borderRadius: 28,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 14,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #E8F4FD, #D5E8F7)", borderRadius: 28 }} />
            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{ fontSize: 110, marginBottom: 16 }}>🤖</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 36, color: "#2D3436" }}>AI Assistant</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 24, color: "#636E72", marginTop: 10 }}>tap to open</div>
            </div>
          </div>
        </div>

        <div style={{
          position: "absolute",
          bottom: 80, left: "50%",
          transform: `translateX(-50%) scale(${pawScale})`,
          transformOrigin: "center bottom",
          zIndex: 10,
        }}>
          <svg width="120" height="90" viewBox="0 0 110 80">
            <ellipse cx="55" cy="55" rx="34" ry="22" fill="#F0EBE3" />
            <circle cx="22" cy="44" r="16" fill="#F5F0EB" />
            <circle cx="55" cy="34" r="16" fill="#F5F0EB" />
            <circle cx="88" cy="44" r="16" fill="#F5F0EB" />
            <circle cx="28" cy="56" r="7" fill="#E8E0D8" />
            <circle cx="55" cy="62" r="8" fill="#E8E0D8" />
            <circle cx="82" cy="56" r="7" fill="#E8E0D8" />
          </svg>
        </div>

        {tapFrame > 0 && (
          <div style={{
            position: "absolute",
            bottom: 100, left: "50%",
            transform: "translateX(-50%)",
            width: interpolate(tapFrame, [0, 20], [0, 90], { extrapolateRight: "clamp" }),
            height: interpolate(tapFrame, [0, 20], [0, 90], { extrapolateRight: "clamp" }),
            borderRadius: "50%",
            border: "3px solid rgba(108,92,231,0.6)",
            opacity: interpolate(tapFrame, [0, 20], [1, 0], { extrapolateRight: "clamp" }),
          }} />
        )}
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Idea bubble – phase 1: "I have an idea!"
  const bubble1 = spring({ frame: frame - 25, fps, config: { damping: 6, stiffness: 200 } });
  const bubble1Scale = interpolate(bubble1, [0, 1], [0, 1.05], { extrapolateLeft: "clamp" });
  const bubble1Opacity = interpolate(frame, [24, 32, 68, 78], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Idea bubble – phase 2: "Where is my phone?"
  const bubble2 = spring({ frame: frame - 55, fps, config: { damping: 8, stiffness: 180 } });
  const bubble2Scale = interpolate(bubble2, [0, 1], [0, 1.05], { extrapolateLeft: "clamp" });
  const bubble2Opacity = interpolate(frame, [54, 62, 84, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const expression =
    frame < 25 ? "confused" as const
    : frame < 70 ? "curious" as const
    : "phone" as const;

  const bichoX = interpolate(frame, [85, 110], [0, 600], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const bichoOpacity = interpolate(frame, [85, 108], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const flashOpacity = interpolate(frame, [24, 28, 36], [0, 0.25, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFF8F0 0%, #FFE8D5 100%)" }}>
      <SupermarketBg brightness={0.88} />

      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: `rgba(255,255,180,${flashOpacity})`,
        pointerEvents: "none",
      }} />

      {/* ── Bicho – vertically centered ── */}
      <div style={{
        position: "absolute",
        bottom: 560,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateX(${bichoX}px)`,
        opacity: bichoOpacity,
      }}>
        <BichoCharacter expression={expression} scale={2.7} animate />
      </div>

      {/* ── Idea bubble phase 1: "I have an idea!" ── */}
      <div style={{
        position: "absolute",
        top: 300,
        left: "50%",
        transform: `translateX(-130%) scale(${bubble1Scale})`,
        transformOrigin: "bottom right",
        opacity: bubble1Opacity,
        zIndex: 20,
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          border: "3px solid #FDCB6E",
          borderRadius: 28,
          padding: "18px 28px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          boxShadow: "0 8px 32px rgba(253,203,110,0.5)",
        }}>
          <span style={{ fontSize: 56 }}>💡</span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 30, color: "#F39C12" }}>I have an idea!</span>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", paddingRight: 30, marginTop: 5 }}>
          {[10, 7, 5].map((sz, i) => (
            <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "2px solid #FDCB6E" }} />
          ))}
        </div>
      </div>

      {/* ── Idea bubble phase 2: "Where is my phone?" ── */}
      <div style={{
        position: "absolute",
        top: 260,
        left: "50%",
        transform: `translateX(-130%) scale(${bubble2Scale})`,
        transformOrigin: "bottom right",
        opacity: bubble2Opacity,
        zIndex: 20,
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          border: "3px solid #A29BFE",
          borderRadius: 28,
          padding: "18px 28px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          boxShadow: "0 8px 32px rgba(162,155,254,0.4)",
        }}>
          <span style={{ fontSize: 56 }}>📱</span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 30, color: "#6C5CE7" }}>Where is my phone?</span>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", paddingRight: 30, marginTop: 5 }}>
          {[10, 7, 5].map((sz, i) => (
            <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "2px solid #A29BFE" }} />
          ))}
        </div>
      </div>

      {/* ── Phone close-up ── */}
      <PhoneCloseUp visible={frame >= 90} />

    </AbsoluteFill>
  );
};
