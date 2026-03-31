/**
 * Hook (0–5 s) – No text banners. Dog + big bottles centered on screen.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { SupermarketBg } from "../components/SupermarketBg";

const OliveBottle: React.FC<{ color: string; capColor: string; label: string; sub: string; price: string; delay: number; wobble?: number }> = ({
  color, capColor, label, sub, price, delay, wobble = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const w = Math.sin((frame / fps) * Math.PI * 1.5 + wobble) * 5;
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
        <text x="40" y="83" textAnchor="middle" fontSize="8" fill="#636E72">Olive Oil</text>
        <text x="40" y="98" textAnchor="middle" fontSize="11" fontWeight="900" fill="#E17055">{price}</text>
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

      {/* ── Shelf plank only – no text ── */}
      <div style={{ position: "absolute", bottom: 698, left: 0, right: 0, height: 18, background: "linear-gradient(180deg,#C4975A,#9B7340)", boxShadow: "0 6px 18px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", bottom: 678, left: 0, right: 0, height: 20, background: "linear-gradient(180deg,#EEE5D8,#D8CCC0)" }} />

      {/* ── 4 big bottles – centered mid-screen ── */}
      <div style={{
        position: "absolute", bottom: 718,
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16,
      }}>
        <OliveBottle color="#8FBC58" capColor="#4A7C2A" label="CLASSICO"  sub="Extra Virgin" price="$8.99"  delay={80} wobble={0} />
        <OliveBottle color="#C8A830" capColor="#8B6914" label="PRIMAVERA" sub="Cold Pressed"  price="$12.49" delay={88} wobble={1.5} />
        <OliveBottle color="#5B9B5A" capColor="#2E5C2E" label="VERDE"     sub="Organic"       price="$14.99" delay={96} wobble={3} />
        <OliveBottle color="#D4A818" capColor="#9A6E00" label="DORADO"    sub="Premium"        price="$11.99" delay={104} wobble={4.5} />
      </div>

      {/* ── Bichon – in front of shelf ── */}
      <div style={{
        position: "absolute", bottom: 420,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateX(${bichoX}px)`,
      }}>
        <div style={{ transform: `rotate(${headLook * 0.25}deg)` }}>
          <BichoCharacter expression={frame > 80 ? "confused" : "neutral"} scale={2.8} animate />
        </div>
      </div>
    </AbsoluteFill>
  );
};
