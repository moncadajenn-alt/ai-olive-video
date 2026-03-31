/**
 * Scene 1 – 4 big bottles centered, dog confused, thought bubble dialogue.
 * No banners. Safe zone layout.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { SupermarketBg } from "../components/SupermarketBg";

const Bottle: React.FC<{ color: string; capColor: string; label: string; sub: string; price: string; idx: number }> = ({
  color, capColor, label, sub, price, idx,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = idx * 6;
  const entrance = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const w = Math.sin((frame / fps) * Math.PI * 1.4 + idx * 1.1) * 5;

  return (
    <div style={{ transform: `scale(${s}) translateY(${w}px)`, transformOrigin: "bottom center" }}>
      <svg width="160" height="260" viewBox="0 0 80 130">
        <rect x="26" y="2" width="28" height="18" rx="5" fill={capColor} />
        <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
        <rect x="30" y="18" width="20" height="14" fill={color} />
        <rect x="8" y="30" width="64" height="85" rx="16" fill={color} />
        <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.3)" />
        <rect x="14" y="44" width="52" height="60" rx="7" fill="white" opacity="0.96" />
        <rect x="14" y="44" width="52" height="20" rx="7" fill={capColor} opacity="0.9" />
        <rect x="14" y="57" width="52" height="7" fill={capColor} opacity="0.9" />
        <text x="40" y="58" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">{label}</text>
        <text x="40" y="72" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2D3436">{sub}</text>
        <text x="40" y="83" textAnchor="middle" fontSize="8" fill="#636E72">Olive Oil 500ml</text>
        <text x="40" y="98" textAnchor="middle" fontSize="12" fontWeight="900" fill="#E17055">{price}</text>
      </svg>
    </div>
  );
};

const ThoughtBubble: React.FC<{ text: string; emoji: string; fadeIn: number; fadeOut: number }> = ({ text, emoji, fadeIn, fadeOut }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [fadeIn, fadeIn + 10, fadeOut - 10, fadeOut], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [fadeIn, fadeIn + 10], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: 28, padding: "18px 34px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 38, color: "#2D3436",
        whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14,
        border: "2px solid #F0F0F0",
      }}>
        <span style={{ fontSize: 44 }}>{emoji}</span>
        <span>{text}</span>
      </div>
      <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 8 }}>
        {[12, 8, 6].map((sz, i) => (
          <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.95)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} />
        ))}
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 120], [1.05, 1.12], { extrapolateRight: "clamp" });
  const lookAngle = interpolate(frame, [10, 30, 55, 75, 100, 120], [0, -22, 22, -10, 0, 5], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const shoulderDrop = interpolate(frame, [60, 80], [0, 18], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SupermarketBg zoom={zoom} />

      {/* ── Shelf back wall ── */}
      <div style={{ position: "absolute", bottom: 698, left: 0, right: 0, height: 260, background: "linear-gradient(180deg,#EEE5D8,#D8CCC0)" }} />

      {/* ── Shelf plank ── */}
      <div style={{ position: "absolute", bottom: 698, left: 0, right: 0, height: 18, background: "linear-gradient(180deg,#C4975A,#9B7340)", boxShadow: "0 6px 18px rgba(0,0,0,0.3)" }} />

      {/* ── 4 big bottles – centered ── */}
      <div style={{
        position: "absolute", bottom: 718,
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16,
      }}>
        <Bottle color="#8FBC58" capColor="#4A7C2A" label="CLASSICO"  sub="Extra Virgin" price="$8.99"  idx={0} />
        <Bottle color="#C8A830" capColor="#8B6914" label="PRIMAVERA" sub="Cold Pressed"  price="$12.49" idx={1} />
        <Bottle color="#5B9B5A" capColor="#2E5C2E" label="VERDE"     sub="Organic"       price="$14.99" idx={2} />
        <Bottle color="#D4A818" capColor="#9A6E00" label="DORADO"    sub="Premium"        price="$11.99" idx={3} />
      </div>

      {/* ── Dog – centered in front of shelf ── */}
      <div style={{
        position: "absolute", bottom: 420,
        left: 0, right: 0, display: "flex", justifyContent: "center",
        transform: `translateY(${shoulderDrop}px)`,
      }}>
        <div style={{ transform: `rotate(${lookAngle * 0.3}deg)` }}>
          <BichoCharacter expression="confused" scale={2.8} animate />
        </div>
      </div>

      {/* ── Thought bubbles – safe zone, above dog head ── */}
      <div style={{ position: "absolute", bottom: 1300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ThoughtBubble text="Wow... so many choices!" emoji="😵" fadeIn={15} fadeOut={52} />
      </div>
      <div style={{ position: "absolute", bottom: 1300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ThoughtBubble text="Which has the best quality?" emoji="🤔" fadeIn={52} fadeOut={88} />
      </div>
      <div style={{ position: "absolute", bottom: 1300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ThoughtBubble text="Which is more affordable?" emoji="💰" fadeIn={88} fadeOut={122} />
      </div>
    </AbsoluteFill>
  );
};
