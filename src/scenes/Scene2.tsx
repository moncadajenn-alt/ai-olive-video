/**
 * Scene 2 – Close-up: bicho squints at labels, flips bottles, scratches head
 * Labels blur and spin. Dog internal monologue about label confusion.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";

const SpinningLabel: React.FC<{ x: number; y: number; text: string; delay: number; color: string }> = ({
  x, y, text, delay, color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spin = interpolate(
    frame - delay,
    [0, 30, 60, 90],
    [0, 360, 720, 1080],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const blurAmt = interpolate(
    Math.sin(((frame - delay) / fps) * Math.PI * 3),
    [-1, 1],
    [0, 4]
  );
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      opacity,
      transform: `rotate(${spin}deg)`,
      filter: `blur(${blurAmt}px)`,
      transformOrigin: "center center",
    }}>
      <div style={{
        backgroundColor: color,
        borderRadius: 12, padding: "10px 22px",
        fontFamily: "'Inter',sans-serif",
        fontWeight: 800, fontSize: 28, color: "white",
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
      }}>{text}</div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera: zoom in close
  const zoom = interpolate(frame, [0, 30], [1.0, 1.4], { extrapolateRight: "clamp" });

  const expression =
    frame < 40 ? "confused" as const
    : frame < 90 ? "scratching" as const
    : "confused" as const;

  const sighY = interpolate(
    frame,
    [55, 70, 85, 105],
    [0, 20, 20, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const showLabels = frame >= 20;

  // thought bubble: which one is worth the price?
  const thoughtOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });
  const thoughtScale = interpolate(frame, [70, 85], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #EEF4FF 0%, #D8E8FF 100%)", overflow: "hidden" }}>

      {/* ── Shelf background ── */}
      <div style={{ position: "absolute", bottom: 750, left: 0, right: 0, height: 200, background: "linear-gradient(0deg, #E8DDD0 0%, transparent 100%)" }} />
      <div style={{ position: "absolute", bottom: 760, left: 0, right: 0, height: 16, background: "linear-gradient(180deg, #C4975A, #9B7340)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }} />

      {/* ── Zoom wrapper ── */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "center 55%" }}>

        {/* Spinning confused labels */}
        {showLabels && (
          <>
            <SpinningLabel x={80}  y={320} text="Extra Virgin?" color="#4A7C2A" delay={20} />
            <SpinningLabel x={580} y={280} text="Cold Pressed?" color="#8B6914" delay={28} />
            <SpinningLabel x={140} y={620} text="First Press?"  color="#2E5C2E" delay={36} />
            <SpinningLabel x={620} y={600} text="Premium?"      color="#9A6E00" delay={44} />
            <SpinningLabel x={300} y={200} text="Organic?"      color="#6C5CE7" delay={32} />
            <SpinningLabel x={480} y={460} text="Pure?"         color="#E17055" delay={24} />
          </>
        )}

        {/* ── Bottles – mid screen ── */}
        <div style={{
          position: "absolute",
          bottom: 760,
          left: 0, right: 0,
          display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 20,
        }}>
          {[
            { color: "#8FBC58", cap: "#4A7C2A", label: "CLASSICO",  price: "$8.99" },
            { color: "#C8A830", cap: "#8B6914", label: "PRIMAVERA", price: "$12.49" },
            { color: "#5B9B5A", cap: "#2E5C2E", label: "VERDE",     price: "$14.99" },
            { color: "#D4A818", cap: "#9A6E00", label: "DORADO",    price: "$11.99" },
          ].map((b, i) => {
            const isFlipped = i === 1;
            const flipAngle = isFlipped
              ? interpolate(frame, [30, 50, 70, 90], [0, -30, 30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
              : 0;
            return (
              <div key={i} style={{ transform: `rotate(${flipAngle}deg)`, transformOrigin: "bottom center" }}>
                <svg width="100" height="160" viewBox="0 0 80 130">
                  <rect x="26" y="2" width="28" height="18" rx="5" fill={b.cap} />
                  <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
                  <rect x="30" y="18" width="20" height="14" fill={b.color} />
                  <rect x="8" y="30" width="64" height="85" rx="16" fill={b.color} />
                  <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.28)" />
                  <rect x="14" y="44" width="52" height="60" rx="7" fill="white" opacity="0.95" />
                  <rect x="14" y="44" width="52" height="14" rx="7" fill={b.cap} opacity="0.88" />
                  <text x="40" y="54" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">{b.label}</text>
                  <text x="40" y="70" textAnchor="middle" fontSize="7" fill="#636E72">Olive Oil</text>
                  <text x="40" y="85" textAnchor="middle" fontSize="9" fontWeight="800" fill="#E17055">{b.price}</text>
                </svg>
              </div>
            );
          })}
        </div>

        {/* ── Bichon – vertically centered ── */}
        <div style={{
          position: "absolute",
          bottom: 540,
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
          transform: `translateY(${sighY}px)`,
        }}>
          <BichoCharacter expression={expression} scale={2.7} animate />
        </div>
      </div>

      {/* ── Thought bubble – safe zone ── */}
      <div style={{
        position: "absolute",
        bottom: 1200,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: thoughtOpacity,
        transform: `scale(${thoughtScale})`,
      }}>
        <div style={{
          background: "white",
          borderRadius: 22,
          padding: "14px 28px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.13)",
          fontFamily: "'Inter',sans-serif",
          fontWeight: 700, fontSize: 30, color: "#2D3436",
          whiteSpace: "nowrap",
          border: "2px solid #F0F0F0",
        }}>🤯 I can't tell which is worth the price!</div>
        <div style={{ position: "absolute", bottom: -22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
          {[9, 6, 4].map((sz, i) => (
            <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }} />
          ))}
        </div>
      </div>

    </AbsoluteFill>
  );
};
