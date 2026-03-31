/**
 * Scene 2 – Close-up: big bottles, labels spinning, dog confused. No banners.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";

const SpinningLabel: React.FC<{ x: number; y: number; text: string; delay: number; color: string }> = ({ x, y, text, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = interpolate(frame - delay, [0, 30, 60, 90], [0, 360, 720, 1080], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const blurAmt = interpolate(Math.sin(((frame - delay) / fps) * Math.PI * 3), [-1, 1], [0, 4]);
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, transform: `rotate(${spin}deg)`, filter: `blur(${blurAmt}px)`, transformOrigin: "center center" }}>
      <div style={{
        backgroundColor: color, borderRadius: 14, padding: "12px 26px",
        fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 32, color: "white",
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)", whiteSpace: "nowrap",
      }}>{text}</div>
    </div>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 30], [1.0, 1.35], { extrapolateRight: "clamp" });
  const expression = frame < 40 ? "confused" as const : frame < 90 ? "scratching" as const : "confused" as const;
  const sighY = interpolate(frame, [55, 70, 85, 105], [0, 20, 20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const showLabels = frame >= 20;
  const thoughtOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });
  const thoughtScale = interpolate(frame, [70, 85], [0.85, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #EEF4FF 0%, #D8E8FF 100%)", overflow: "hidden" }}>

      {/* ── Shelf background ── */}
      <div style={{ position: "absolute", bottom: 698, left: 0, right: 0, height: 260, background: "linear-gradient(0deg, #E8DDD0, #F5EDE2)" }} />
      <div style={{ position: "absolute", bottom: 698, left: 0, right: 0, height: 18, background: "linear-gradient(180deg, #C4975A, #9B7340)", boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }} />

      {/* ── Zoom wrapper ── */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "center 55%" }}>

        {showLabels && (
          <>
            <SpinningLabel x={60}  y={340} text="Extra Virgin?" color="#4A7C2A" delay={20} />
            <SpinningLabel x={560} y={300} text="Cold Pressed?" color="#8B6914" delay={28} />
            <SpinningLabel x={100} y={640} text="First Press?"  color="#2E5C2E" delay={36} />
            <SpinningLabel x={580} y={620} text="Premium?"      color="#9A6E00" delay={44} />
            <SpinningLabel x={280} y={220} text="Organic?"      color="#6C5CE7" delay={32} />
            <SpinningLabel x={460} y={490} text="Pure?"         color="#E17055" delay={24} />
          </>
        )}

        {/* ── Big bottles – centered mid-screen ── */}
        <div style={{
          position: "absolute", bottom: 718,
          left: 0, right: 0,
          display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16,
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
                <svg width="160" height="260" viewBox="0 0 80 130">
                  <rect x="26" y="2" width="28" height="18" rx="5" fill={b.cap} />
                  <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
                  <rect x="30" y="18" width="20" height="14" fill={b.color} />
                  <rect x="8" y="30" width="64" height="85" rx="16" fill={b.color} />
                  <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.3)" />
                  <rect x="14" y="44" width="52" height="60" rx="7" fill="white" opacity="0.96" />
                  <rect x="14" y="44" width="52" height="20" rx="7" fill={b.cap} opacity="0.9" />
                  <text x="40" y="58" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">{b.label}</text>
                  <text x="40" y="73" textAnchor="middle" fontSize="9" fill="#636E72">Olive Oil 500ml</text>
                  <text x="40" y="88" textAnchor="middle" fontSize="12" fontWeight="900" fill="#E17055">{b.price}</text>
                </svg>
              </div>
            );
          })}
        </div>

        {/* ── Dog – centered ── */}
        <div style={{
          position: "absolute", bottom: 420,
          left: 0, right: 0, display: "flex", justifyContent: "center",
          transform: `translateY(${sighY}px)`,
        }}>
          <BichoCharacter expression={expression} scale={2.8} animate />
        </div>
      </div>

      {/* ── Thought bubble – safe zone ── */}
      <div style={{
        position: "absolute", bottom: 1280,
        left: 0, right: 0, display: "flex", justifyContent: "center",
        opacity: thoughtOpacity, transform: `scale(${thoughtScale})`,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.97)", borderRadius: 28, padding: "18px 34px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 36, color: "#2D3436",
          whiteSpace: "nowrap", border: "2px solid #F0F0F0",
        }}>🤯 I can't tell which is worth it!</div>
      </div>
    </AbsoluteFill>
  );
};
