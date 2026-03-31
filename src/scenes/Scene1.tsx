/**
 * Scene 1 – Medium shot: 4 bottles in front, bicho confused
 * Bicho looks left and right, shoulders drop.
 * Text: "too many choices?" → "which one is best?"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { AnimatedText } from "../components/AnimatedText";
import { SupermarketBg } from "../components/SupermarketBg";

const Bottle: React.FC<{ color: string; capColor: string; label: string; sub: string; idx: number }> = ({
  color, capColor, label, sub, idx,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = idx * 6;
  const entrance = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  const s = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const w = Math.sin((frame / fps) * Math.PI * 1.4 + idx * 1.1) * 5;

  return (
    <div style={{ transform: `scale(${s}) translateY(${w}px)`, transformOrigin: "bottom center" }}>
      <svg width="106" height="172" viewBox="0 0 80 130">
        <rect x="26" y="2" width="28" height="18" rx="5" fill={capColor} />
        <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="18" width="20" height="14" fill={color} />
        <rect x="8" y="30" width="64" height="85" rx="16" fill={color} />
        <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.28)" />
        <rect x="14" y="44" width="52" height="55" rx="7" fill="white" opacity="0.93" />
        <rect x="14" y="44" width="52" height="18" rx="7" fill={capColor} opacity="0.9" />
        <rect x="14" y="55" width="52" height="7" fill={capColor} opacity="0.9" />
        <text x="40" y="57" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">{label}</text>
        <text x="40" y="71" textAnchor="middle" fontSize="8" fontWeight="700" fill="#2D3436">{sub}</text>
        <text x="40" y="82" textAnchor="middle" fontSize="7" fill="#636E72">Olive Oil</text>
        <text x="40" y="93" textAnchor="middle" fontSize="6" fill="#95A5A6">500 ml</text>
      </svg>
    </div>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: slight zoom from medium to slightly closer
  const zoom = interpolate(frame, [0, 120], [1.0, 1.06], { extrapolateRight: "clamp" });

  // bicho head looking left/right/center over time
  const lookAngle = interpolate(
    frame,
    [10, 30, 55, 75, 100, 120],
    [0, -22, 22, -10, 0, 5],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // shoulder drop — body slightly lower after frame 60
  const shoulderDrop = interpolate(frame, [60, 80], [0, 18], { extrapolateRight: "clamp" });

  // pulse on "≈" signs
  const eqPulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.8, 1.2]);

  return (
    <AbsoluteFill>
      <SupermarketBg zoom={zoom} />

      {/* ── shelf back wall ── */}
      <div style={{
        position: "absolute",
        top: 720, left: 60, right: 60, height: 172,
        background: "linear-gradient(180deg,#EEE5D8,#E0D4C4)",
        borderRadius: 6,
      }} />

      {/* ── Bottles ── */}
      <div style={{
        position: "absolute",
        bottom: 450,
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 44,
      }}>
        <Bottle color="#8FBC58" capColor="#4A7C2A" label="CLASSICO" sub="Extra Virgin" idx={0} />
        <Bottle color="#C8A830" capColor="#8B6914" label="PRIMAVERA" sub="Cold Pressed" idx={1} />
        <Bottle color="#5B9B5A" capColor="#2E5C2E" label="VERDE" sub="Organic" idx={2} />
        <Bottle color="#D4A818" capColor="#9A6E00" label="DORADO" sub="Premium" idx={3} />
      </div>

      {/* ── shelf plank ── */}
      <div style={{ position: "absolute", bottom: 444, left: 60, right: 60, height: 22, background: "linear-gradient(180deg,#C4975A,#9B7340)", borderRadius: 4, boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", bottom: 422, left: 60, right: 60, height: 24, backgroundColor: "#FFD700", display: "flex", alignItems: "center", paddingLeft: 16 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12, color: "#5D4300" }}>🫒 OLIVE OIL SELECTION</span>
      </div>

      {/* ── Comparison ≈ signs ── */}
      <div style={{ position: "absolute", bottom: 560, left: 0, right: 0 }}>
        {[230, 404, 578].map((xPos, i) => (
          <div key={i} style={{
            position: "absolute", left: xPos, top: 0,
            fontSize: 38, color: "#95A5A6", fontWeight: 900,
            transform: `scale(${eqPulse})`,
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }),
          }}>≈</div>
        ))}
      </div>

      {/* ── Bichon dog ── */}
      <div style={{
        position: "absolute",
        bottom: 180,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateY(${shoulderDrop}px)`,
      }}>
        <div style={{ transform: `rotate(${lookAngle * 0.3}deg)` }}>
          <BichoCharacter expression="confused" scale={2.3} animate />
        </div>
      </div>

      {/* ── Thought bubble ── */}
      <div style={{
        position: "absolute",
        bottom: 500,
        left: "50%",
        transform: "translateX(-55%)",
        opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          background: "white",
          borderRadius: 18,
          padding: "10px 22px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          fontFamily: "'Inter',sans-serif",
          fontWeight: 700, fontSize: 28, color: "#636E72",
          whiteSpace: "nowrap",
        }}>Hmm... 🤔</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 5 }}>
          {[10, 7, 5].map((sz, i) => (
            <div key={i} style={{ width: sz, height: sz, borderRadius: "50%", backgroundColor: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }} />
          ))}
        </div>
      </div>

      {/* ── Text ── */}
      <div style={{
        position: "absolute", top: 110,
        left: 60, right: 60,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          borderRadius: 22, padding: "16px 40px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}>
          <AnimatedText
            text="too many choices?"
            delay={0}
            fontSize={56}
            color="#2C3E50"
            highlightWords={["choices"]}
            highlightColor="#FAB1A0"
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
