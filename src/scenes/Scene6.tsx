/**
 * Scene 6 – Confident choice (5 s = 150 frames)
 * Bicho reaches for top-ranked bottle, picks it up, examines it, smiles and nods.
 * Text: "great, this is the best quality" → "i am going to buy this one"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { AnimatedText } from "../components/AnimatedText";
import { SupermarketBg } from "../components/SupermarketBg";

export const SCENE6_DURATION = 150;

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-50): bicho reaches arm toward winning bottle
  // Phase 2 (50-100): picks up bottle, holds it, examines
  // Phase 3 (100-150): smile + nod + sparkle on bottle

  // arm reach forward
  const reachProgress = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 100 } });
  const reachX = interpolate(reachProgress, [0, 1], [0, 60], { extrapolateLeft: "clamp" });

  // bottle lift
  const liftProgress = spring({ frame: frame - 52, fps, config: { damping: 10, stiffness: 110 } });
  const bottleY = interpolate(liftProgress, [0, 1], [0, -120], { extrapolateLeft: "clamp" });
  const bottleScale = interpolate(liftProgress, [0, 1], [1.0, 1.35], { extrapolateLeft: "clamp" });

  // sparkle on bottle at phase 3
  const sparkleProgress = spring({ frame: frame - 100, fps, config: { damping: 8, stiffness: 160 } });
  const sparkleScale = interpolate(sparkleProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  // head nod
  const nodAngle = frame >= 100
    ? interpolate(Math.sin(((frame - 100) / fps) * Math.PI * 2.5), [-1, 1], [-6, 6])
    : 0;

  // expression
  const expression =
    frame < 45 ? "neutral" as const
    : frame < 100 ? "examining" as const
    : "confident" as const;

  // text lines
  const text1Opacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const text2Opacity = interpolate(frame, [100, 118], [0, 1], { extrapolateRight: "clamp" });

  // camera zoom in on the moment of picking
  const zoom = interpolate(frame, [48, 80], [1.0, 1.1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #EEFFF8 0%, #D4FFE8 100%)" }}>
      <SupermarketBg zoom={zoom} brightness={0.9} />

      {/* ── shelf ── */}
      <div style={{ position: "absolute", bottom: 380, left: 0, right: 0, height: 20, background: "linear-gradient(180deg,#C4975A,#9B7340)", boxShadow: "0 5px 14px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", bottom: 360, left: 0, right: 0, height: 28, backgroundColor: "#FFD700", display: "flex", alignItems: "center", paddingLeft: 20 }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: "#5D4300" }}>🥇 BEST QUALITY — CLASSICO EXTRA VIRGIN</span>
      </div>

      {/* ── shelf back wall ── */}
      <div style={{ position: "absolute", bottom: 390, left: 0, right: 0, height: 160, background: "linear-gradient(180deg,#EEE5D8,#E0D4C4)" }} />

      {/* ── 3 non-chosen bottles (grayed out) ── */}
      <div style={{
        position: "absolute", bottom: 400,
        left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 80,
      }}>
        {[
          { color: "#A8A8A8", cap: "#888", label: "PRIMAVERA" },
          null, // placeholder for winner gap
          { color: "#A8A8A8", cap: "#888", label: "VERDE" },
          { color: "#A8A8A8", cap: "#888", label: "DORADO" },
        ].map((b, i) => b ? (
          <div key={i} style={{ opacity: 0.38, filter: "grayscale(0.8)" }}>
            <svg width="72" height="118" viewBox="0 0 80 130">
              <rect x="26" y="2" width="28" height="16" rx="4" fill={b.cap} />
              <rect x="8" y="16" width="64" height="100" rx="16" fill={b.color} />
              <rect x="14" y="44" width="52" height="44" rx="6" fill="white" opacity="0.6" />
              <text x="40" y="68" textAnchor="middle" fontSize="8" fill="#555">{b.label}</text>
            </svg>
          </div>
        ) : <div key={i} style={{ width: 72 }} />)}
      </div>

      {/* ── Winner bottle ── */}
      <div style={{
        position: "absolute",
        bottom: 400 - bottleY,
        left: "50%",
        transform: `translateX(calc(-50% - 120px)) scale(${bottleScale})`,
        transformOrigin: "bottom center",
        zIndex: 10,
      }}>
        <svg width="106" height="172" viewBox="0 0 80 130">
          <rect x="26" y="2" width="28" height="18" rx="5" fill="#4A7C2A" />
          <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.4)" />
          <rect x="30" y="18" width="20" height="14" fill="#8FBC58" />
          <rect x="8" y="30" width="64" height="85" rx="16" fill="#8FBC58" />
          <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.3)" />
          <rect x="14" y="44" width="52" height="55" rx="7" fill="white" opacity="0.95" />
          <rect x="14" y="44" width="52" height="18" rx="7" fill="#4A7C2A" opacity="0.9" />
          <text x="40" y="56" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">CLASSICO</text>
          <text x="40" y="70" textAnchor="middle" fontSize="8" fontWeight="600" fill="#2D3436">Extra Virgin</text>
          <text x="40" y="82" textAnchor="middle" fontSize="7" fill="#636E72">500 ml</text>
        </svg>

        {/* Sparkle burst on bottle */}
        {frame >= 100 && [0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const dist = interpolate(sparkleProgress, [0, 1], [0, 55], { extrapolateLeft: "clamp" });
          const sx = 53 + Math.cos(rad) * dist;
          const sy = 40 + Math.sin(rad) * dist;
          const starOpacity = interpolate(sparkleProgress, [0, 0.5, 1], [0, 1, 0.7], { extrapolateLeft: "clamp" });
          return (
            <div key={i} style={{
              position: "absolute",
              left: sx, top: sy,
              fontSize: i % 2 === 0 ? 18 : 14,
              opacity: starOpacity,
              transform: `scale(${sparkleScale})`,
            }}>
              {i % 2 === 0 ? "✨" : "⭐"}
            </div>
          );
        })}
      </div>

      {/* ── Bichon reaching / examining ── */}
      <div style={{
        position: "absolute",
        bottom: 140,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        transform: `translateX(${reachX}px) rotate(${nodAngle}deg)`,
        transformOrigin: "bottom center",
      }}>
        <BichoCharacter expression={expression} scale={2.3} animate />
      </div>

      {/* ── Text lines ── */}
      <div style={{ position: "absolute", top: 110, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ opacity: text1Opacity, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 18, padding: "14px 36px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
          <AnimatedText text="great, this is the best quality" delay={0} fontSize={46} color="#2D3436" highlightWords={["best"]} highlightColor="#FDCB6E" />
        </div>
        <div style={{ opacity: text2Opacity, backgroundColor: "rgba(85,239,196,0.2)", border: "2px solid #55EFC4", borderRadius: 18, padding: "12px 32px" }}>
          <AnimatedText text="i am going to buy this one" delay={0} fontSize={42} color="#00B894" highlightWords={["buy"]} highlightColor="#55EFC4" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
