/**
 * Scene 3 – Idea moment (5 s)
 * Bicho pauses → idea bubble pops → expression shifts curious → reaches for phone
 * Cut to close-up paw tapping screen.
 * Text: "use AI"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { AnimatedText } from "../components/AnimatedText";
import { SupermarketBg } from "../components/SupermarketBg";

// Duration exported for Composition
export const SCENE3_DURATION = 150;

/* ── Phone close-up (second half of scene) ── */
const PhoneCloseUp: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - 100, fps, config: { damping: 12, stiffness: 120 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  // paw tap animation at frame ~130
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
      {/* Phone */}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 280, height: 480,
          backgroundColor: "#1A1A2E",
          borderRadius: 36, padding: 14,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          {/* notch */}
          <div style={{ width: 70, height: 10, backgroundColor: "#0D0D1A", borderRadius: 5, margin: "0 auto 10px" }} />
          {/* screen */}
          <div style={{
            width: "100%", height: 400,
            backgroundColor: "#F8F9FA",
            borderRadius: 26,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 14,
            overflow: "hidden",
          }}>
            {/* wallpaper hint */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #E8F4FD, #D5E8F7)", borderRadius: 26 }} />
            {/* lock screen icons */}
            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 8 }}>🤖</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 20, color: "#2D3436" }}>AI Assistant</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#636E72", marginTop: 4 }}>tap to open</div>
            </div>
          </div>
        </div>

        {/* Paw tapping */}
        <div style={{
          position: "absolute",
          bottom: 80, left: "50%",
          transform: `translateX(-50%) scale(${pawScale})`,
          transformOrigin: "center bottom",
          zIndex: 10,
        }}>
          <svg width="110" height="80" viewBox="0 0 110 80">
            {/* paw pad main */}
            <ellipse cx="55" cy="55" rx="34" ry="22" fill="#F0EBE3" />
            <FurPuff cx={22} cy={44} r={16} />
            <FurPuff cx={55} cy={34} r={16} />
            <FurPuff cx={88} cy={44} r={16} />
            {/* toe beans */}
            <circle cx="28" cy="56" r="7" fill="#E8E0D8" />
            <circle cx="55" cy="62" r="8" fill="#E8E0D8" />
            <circle cx="82" cy="56" r="7" fill="#E8E0D8" />
          </svg>
        </div>

        {/* Tap ripple */}
        {tapFrame > 0 && (
          <div style={{
            position: "absolute",
            bottom: 100, left: "50%",
            transform: "translateX(-50%)",
            width: interpolate(tapFrame, [0, 20], [0, 80], { extrapolateRight: "clamp" }),
            height: interpolate(tapFrame, [0, 20], [0, 80], { extrapolateRight: "clamp" }),
            borderRadius: "50%",
            border: "3px solid rgba(108,92,231,0.6)",
            opacity: interpolate(tapFrame, [0, 20], [1, 0], { extrapolateRight: "clamp" }),
          }} />
        )}
      </div>
    </div>
  );
};

function FurPuff({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="#F5F0EB" />;
}

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Idea bubble pop
  const bubbleEntrance = spring({ frame: frame - 25, fps, config: { damping: 6, stiffness: 200 } });
  const bubbleScale = interpolate(bubbleEntrance, [0, 1], [0, 1.1], { extrapolateLeft: "clamp" });

  // Expression timeline
  const expression =
    frame < 25 ? "confused" as const
    : frame < 70 ? "curious" as const
    : "phone" as const;

  // Bicho slides out right when phone close-up comes in
  const bichoX = interpolate(frame, [85, 110], [0, 600], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const bichoOpacity = interpolate(frame, [85, 108], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // "use AI" text
  const textOpacity = interpolate(frame, [105, 125], [0, 1], { extrapolateRight: "clamp" });

  // Soft flash on idea moment
  const flashOpacity = interpolate(frame, [24, 28, 36], [0, 0.25, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFF8F0 0%, #FFE8D5 100%)" }}>
      <SupermarketBg brightness={0.88} />

      {/* ── idea flash ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: `rgba(255,255,180,${flashOpacity})`,
        pointerEvents: "none",
      }} />

      {/* ── Bicho (visible until phone close-up) ── */}
      <div style={{
        position: "absolute",
        bottom: 240,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateX(${bichoX}px)`,
        opacity: bichoOpacity,
      }}>
        <BichoCharacter expression={expression} scale={2.4} animate />
      </div>

      {/* ── Idea bubble (separate from character, bigger) ── */}
      {frame >= 24 && frame < 90 && (
        <div style={{
          position: "absolute",
          top: 360,
          left: "50%",
          transform: `translateX(-120%) scale(${bubbleScale})`,
          transformOrigin: "bottom right",
          zIndex: 20,
        }}>
          <div style={{
            backgroundColor: "rgba(255,255,255,0.97)",
            border: "3px solid #FDCB6E",
            borderRadius: 28,
            padding: "16px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            boxShadow: "0 8px 32px rgba(253,203,110,0.5)",
          }}>
            <span style={{ fontSize: 52 }}>💡</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 20, color: "#F39C12" }}>I have an idea!</span>
          </div>
          {/* bubble tail */}
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", paddingRight: 30, marginTop: 4 }}>
            {[10, 7, 5].map((sz, i) => (
              <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "2px solid #FDCB6E" }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Phone close-up ── */}
      <PhoneCloseUp visible={frame >= 90} />

      {/* ── Text ── */}
      <div style={{
        position: "absolute",
        top: 120, left: 60, right: 60,
        display: "flex", justifyContent: "center",
        opacity: textOpacity,
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.93)",
          borderRadius: 22, padding: "16px 44px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
        }}>
          <AnimatedText
            text="use AI"
            delay={0}
            fontSize={74}
            color="#2D3436"
            highlightWords={["AI"]}
            highlightColor="#A29BFE"
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
