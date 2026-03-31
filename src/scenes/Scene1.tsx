/**
 * Scene 1 – Medium shot: 4 bottles in front, bicho confused
 * Bicho looks left and right, shoulders drop.
 * Internal monologue thought bubbles.
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
      <svg width="130" height="210" viewBox="0 0 80 130">
        <rect x="26" y="2" width="28" height="18" rx="5" fill={capColor} />
        <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="18" width="20" height="14" fill={color} />
        <rect x="8" y="30" width="64" height="85" rx="16" fill={color} />
        <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.28)" />
        <rect x="14" y="44" width="52" height="60" rx="7" fill="white" opacity="0.95" />
        <rect x="14" y="44" width="52" height="18" rx="7" fill={capColor} opacity="0.9" />
        <rect x="14" y="55" width="52" height="7" fill={capColor} opacity="0.9" />
        <text x="40" y="57" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">{label}</text>
        <text x="40" y="72" textAnchor="middle" fontSize="8" fontWeight="700" fill="#2D3436">{sub}</text>
        <text x="40" y="83" textAnchor="middle" fontSize="7" fill="#636E72">Olive Oil</text>
        <text x="40" y="97" textAnchor="middle" fontSize="9" fontWeight="800" fill="#E17055">{price}</text>
      </svg>
    </div>
  );
};

const ThoughtBubble: React.FC<{ text: string; emoji: string; fadeIn: number; fadeOut: number }> = ({ text, emoji, fadeIn, fadeOut }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [fadeIn, fadeIn + 10, fadeOut - 10, fadeOut],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scale = interpolate(
    frame,
    [fadeIn, fadeIn + 10],
    [0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ opacity, transform: `scale(${scale})`, transition: "none" }}>
      <div style={{
        background: "white",
        borderRadius: 22,
        padding: "14px 26px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.13)",
        fontFamily: "'Inter',sans-serif",
        fontWeight: 700, fontSize: 32, color: "#2D3436",
        whiteSpace: "nowrap",
        border: "2px solid #F0F0F0",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span>{emoji}</span>
        <span>{text}</span>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 6 }}>
        {[10, 7, 5].map((sz, i) => (
          <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }} />
        ))}
      </div>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: slight zoom
  const zoom = interpolate(frame, [0, 120], [1.05, 1.12], { extrapolateRight: "clamp" });

  // bicho head looking left/right
  const lookAngle = interpolate(
    frame,
    [10, 30, 55, 75, 100, 120],
    [0, -22, 22, -10, 0, 5],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const shoulderDrop = interpolate(frame, [60, 80], [0, 18], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SupermarketBg zoom={zoom} />

      {/* ── shelf back wall ── */}
      <div style={{
        position: "absolute",
        bottom: 780, left: 0, right: 0, height: 200,
        background: "linear-gradient(180deg,#EEE5D8,#E0D4C4)",
      }} />

      {/* ── Bottles – mid screen ── */}
      <div style={{
        position: "absolute",
        bottom: 800,
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 30,
      }}>
        <Bottle color="#8FBC58" capColor="#4A7C2A" label="CLASSICO"  sub="Extra Virgin" price="$8.99"  idx={0} />
        <Bottle color="#C8A830" capColor="#8B6914" label="PRIMAVERA" sub="Cold Pressed"  price="$12.49" idx={1} />
        <Bottle color="#5B9B5A" capColor="#2E5C2E" label="VERDE"     sub="Organic"       price="$14.99" idx={2} />
        <Bottle color="#D4A818" capColor="#9A6E00" label="DORADO"    sub="Premium"        price="$11.99" idx={3} />
      </div>

      {/* ── shelf plank ── */}
      <div style={{ position: "absolute", bottom: 792, left: 0, right: 0, height: 22, background: "linear-gradient(180deg,#C4975A,#9B7340)", boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", bottom: 768, left: 0, right: 0, height: 26, backgroundColor: "#FFD700", display: "flex", alignItems: "center", paddingLeft: 16 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: "#5D4300" }}>🫒 OLIVE OIL SELECTION</span>
      </div>

      {/* ── Bichon dog – vertically centered ── */}
      <div style={{
        position: "absolute",
        bottom: 560,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateY(${shoulderDrop}px)`,
      }}>
        <div style={{ transform: `rotate(${lookAngle * 0.3}deg)` }}>
          <BichoCharacter expression="confused" scale={2.7} animate />
        </div>
      </div>

      {/* ── Thought bubbles – safe zone above dog ── */}
      <div style={{
        position: "absolute",
        bottom: 1230,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <ThoughtBubble text="Wow... so many choices!" emoji="😵" fadeIn={15}  fadeOut={55} />
      </div>
      <div style={{
        position: "absolute",
        bottom: 1230,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <ThoughtBubble text="Which has the best quality?" emoji="🤔" fadeIn={55}  fadeOut={90} />
      </div>
      <div style={{
        position: "absolute",
        bottom: 1230,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <ThoughtBubble text="Which is more affordable?" emoji="💰" fadeIn={90} fadeOut={125} />
      </div>

    </AbsoluteFill>
  );
};
