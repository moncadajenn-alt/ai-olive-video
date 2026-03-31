/**
 * Hook (0–5 s)
 * Wide shot of supermarket aisle, camera slowly pans and zooms in on bichon.
 * Dog enters holding one bottle, then notices many more options.
 * Text: "too many choices?"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { AnimatedText } from "../components/AnimatedText";
import { SupermarketBg } from "../components/SupermarketBg";

const OliveBottle: React.FC<{ color: string; capColor: string; label: string; x: number; delay: number; wobble?: number }> = ({
  color, capColor, label, x, delay, wobble = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const w = Math.sin((frame / fps) * Math.PI * 1.5 + wobble) * 4;
  return (
    <div style={{ position: "absolute", left: x, bottom: 0, transform: `scale(${s}) translateY(${w}px)`, transformOrigin: "bottom center" }}>
      <svg width="88" height="148" viewBox="0 0 80 130">
        <rect x="26" y="2" width="28" height="18" rx="5" fill={capColor} />
        <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="18" width="20" height="14" fill={color} />
        <rect x="8" y="30" width="64" height="85" rx="16" fill={color} />
        <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.28)" />
        <rect x="14" y="44" width="52" height="55" rx="7" fill="white" opacity="0.92" />
        <rect x="14" y="44" width="52" height="18" rx="7" fill={capColor} opacity="0.88" />
        <rect x="14" y="55" width="52" height="7" fill={capColor} opacity="0.88" />
        <text x="40" y="57" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">{label}</text>
        <text x="40" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill="#2D3436">Olive Oil</text>
        <text x="40" y="84" textAnchor="middle" fontSize="7" fill="#636E72">500 ml</text>
      </svg>
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera pan: slowly moves from left to center ──
  const panX = interpolate(frame, [0, 90], [160, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // ── Camera zoom in ──
  const zoom = interpolate(frame, [0, 150], [1.18, 1.0], { extrapolateRight: "clamp" });

  // ── Scene fade in ──
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // ── Bicho walks in from left ──
  const bichoEntrance = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 80 } });
  const bichoX = interpolate(bichoEntrance, [0, 1], [-280, 0], { extrapolateLeft: "clamp" });

  // ── Bicho noticing bottles ──
  // at frame ~80 he looks left, frame ~100 right, frame ~115 looks forward confused
  const lookFrame = Math.max(0, frame - 80);
  const headLook = interpolate(lookFrame, [0, 15, 30, 45], [0, -18, 18, 0], { extrapolateRight: "clamp" });

  // ── Bottles pop in after bicho appears ──
  const bottlesReveal = Math.max(0, frame - 75);

  // ── Text ──
  const textDelay = 100;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <SupermarketBg panX={panX} zoom={zoom} />

      {/* ── Shelf surface bottles stand on ── */}
      <div style={{
        position: "absolute",
        bottom: 410,
        left: 0, right: 0,
        height: 160,
        overflow: "visible",
      }}>
        {/* row of many bottles (background props) */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, display: "flex", alignItems: "flex-end", gap: 12, paddingLeft: 20 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ opacity: interpolate(Math.max(0, bottlesReveal - i * 3), [0, 12], [0, 0.4], { extrapolateRight: "clamp" }) }}>
              <svg width="42" height="90" viewBox="0 0 80 130">
                <rect x="26" y="2" width="28" height="18" rx="5" fill={["#4A7C2A","#8B6914","#2E5C2E","#9A6E00"][i%4]} />
                <rect x="8" y="18" width="64" height="98" rx="16" fill={["#8FBC58","#C8A830","#5B9B5A","#D4A818"][i%4]} />
              </svg>
            </div>
          ))}
        </div>

        {/* 4 featured bottles centered */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 36 }}>
          <OliveBottle color="#8FBC58" capColor="#4A7C2A" label="CLASSICO" x={-202} delay={80} wobble={0} />
          <OliveBottle color="#C8A830" capColor="#8B6914" label="PRIMAVERA" x={-64} delay={88} wobble={1.5} />
          <OliveBottle color="#5B9B5A" capColor="#2E5C2E" label="VERDE" x={74} delay={96} wobble={3} />
          <OliveBottle color="#D4A818" capColor="#9A6E00" label="DORADO" x={212} delay={104} wobble={4.5} />
        </div>
      </div>

      {/* ── Bichon character ── */}
      <div style={{
        position: "absolute",
        bottom: 540,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        transform: `translateX(${bichoX}px)`,
      }}>
        <div style={{ transform: `rotate(${headLook * 0.25}deg)` }}>
          <BichoCharacter
            expression={frame > 80 ? "confused" : "neutral"}
            scale={2.4}
            animate
          />
        </div>
      </div>

      {/* ── Text overlay ── */}
      <div style={{
        position: "absolute",
        top: 160,
        left: 60, right: 60,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [textDelay, textDelay + 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.93)",
          borderRadius: 22,
          padding: "18px 42px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          textAlign: "center",
        }}>
          <AnimatedText
            text="too many choices?"
            delay={0}
            fontSize={60}
            color="#2D3436"
            highlightWords={["choices"]}
            highlightColor="#FAB1A0"
          />
        </div>
      </div>

      {/* ── Overhead light glow ── */}
      <div style={{
        position: "absolute",
        top: 0, left: "20%", right: "20%", bottom: 0,
        background: "radial-gradient(ellipse at 50% 5%, rgba(255,255,220,0.12) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
