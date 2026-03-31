/**
 * Hook (0–5 s)
 * Wide supermarket aisle. Dog walks in, notices 4 bottles. No top text.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { SupermarketBg } from "../components/SupermarketBg";

const OliveBottle: React.FC<{ color: string; capColor: string; label: string; price: string; delay: number; wobble?: number }> = ({
  color, capColor, label, price, delay, wobble = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const w = Math.sin((frame / fps) * Math.PI * 1.5 + wobble) * 4;
  return (
    <div style={{ transform: `scale(${s}) translateY(${w}px)`, transformOrigin: "bottom center" }}>
      <svg width="120" height="196" viewBox="0 0 80 130">
        <rect x="26" y="2" width="28" height="18" rx="5" fill={capColor} />
        <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="18" width="20" height="14" fill={color} />
        <rect x="8" y="30" width="64" height="85" rx="16" fill={color} />
        <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.28)" />
        <rect x="14" y="44" width="52" height="58" rx="7" fill="white" opacity="0.95" />
        <rect x="14" y="44" width="52" height="18" rx="7" fill={capColor} opacity="0.9" />
        <rect x="14" y="55" width="52" height="7" fill={capColor} opacity="0.9" />
        <text x="40" y="57" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">{label}</text>
        <text x="40" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill="#2D3436">Olive Oil</text>
        <text x="40" y="84" textAnchor="middle" fontSize="7" fill="#636E72">500 ml</text>
        <text x="40" y="98" textAnchor="middle" fontSize="9" fontWeight="800" fill="#E17055">{price}</text>
      </svg>
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panX = interpolate(frame, [0, 90], [160, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const zoom = interpolate(frame, [0, 150], [1.18, 1.0], { extrapolateRight: "clamp" });
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const bichoEntrance = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 80 } });
  const bichoX = interpolate(bichoEntrance, [0, 1], [-280, 0], { extrapolateLeft: "clamp" });

  const lookFrame = Math.max(0, frame - 80);
  const headLook = interpolate(lookFrame, [0, 15, 30, 45], [0, -18, 18, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <SupermarketBg panX={panX} zoom={zoom} />

      {/* ── Shelf plank ── */}
      <div style={{ position: "absolute", bottom: 378, left: 0, right: 0, height: 20, background: "linear-gradient(180deg,#C4975A,#9B7340)", boxShadow: "0 5px 14px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", bottom: 356, left: 0, right: 0, height: 26, backgroundColor: "#FFD700", display: "flex", alignItems: "center", paddingLeft: 20 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: "#5D4300" }}>🫒 OLIVE OIL SELECTION</span>
      </div>

      {/* ── 4 featured bottles ── */}
      <div style={{
        position: "absolute", bottom: 400,
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 20,
      }}>
        <OliveBottle color="#8FBC58" capColor="#4A7C2A" label="CLASSICO"  price="$8.99"  delay={80} wobble={0} />
        <OliveBottle color="#C8A830" capColor="#8B6914" label="PRIMAVERA" price="$12.49" delay={88} wobble={1.5} />
        <OliveBottle color="#5B9B5A" capColor="#2E5C2E" label="VERDE"     price="$14.99" delay={96} wobble={3} />
        <OliveBottle color="#D4A818" capColor="#9A6E00" label="DORADO"    price="$11.99" delay={104} wobble={4.5} />
      </div>

      {/* ── Bichon – close to bottles ── */}
      <div style={{
        position: "absolute",
        bottom: 120,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateX(${bichoX}px)`,
      }}>
        <div style={{ transform: `rotate(${headLook * 0.25}deg)` }}>
          <BichoCharacter
            expression={frame > 80 ? "confused" : "neutral"}
            scale={2.8}
            animate
          />
        </div>
      </div>

      {/* ── Light glow ── */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", bottom: 0,
        background: "radial-gradient(ellipse at 50% 5%, rgba(255,255,220,0.12) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
