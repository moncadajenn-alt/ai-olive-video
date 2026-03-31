/**
 * Scene 5 – AI response. Giant phone fills safe zone. Large readable text.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";

export const SCENE5_DURATION = 210;

const ThinkingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bounce = Math.sin(((frame - delay) / fps) * Math.PI * 4) * 10;
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      width: 22, height: 22, borderRadius: "50%",
      backgroundColor: "#6C5CE7",
      transform: `translateY(${bounce}px)`, opacity,
    }} />
  );
};

type RankItem = { rank: number; name: string; score: string; note: string; color: string };
const rankData: RankItem[] = [
  { rank: 1, name: "CLASSICO",  score: "9.4/10", note: "Extra virgin · first cold press",  color: "#8FBC58" },
  { rank: 2, name: "VERDE",     score: "8.7/10", note: "Organic certified · low acidity",  color: "#5B9B5A" },
  { rank: 3, name: "PRIMAVERA", score: "8.0/10", note: "Cold pressed · good value",         color: "#C8A830" },
  { rank: 4, name: "DORADO",    score: "7.2/10", note: "Premium blend · pricier",           color: "#D4A818" },
];

const RankRow: React.FC<RankItem & { delay: number }> = ({ rank, name, score, note, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140 } });
  const x = interpolate(e, [0, 1], [-120, 0], { extrapolateLeft: "clamp" });
  const op = interpolate(e, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const medals = ["🥇", "🥈", "🥉", "4️⃣"];

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      backgroundColor: rank === 1 ? "#FFFBEC" : "white",
      borderRadius: 18, padding: "18px 18px",
      boxShadow: rank === 1 ? "0 6px 24px rgba(253,203,110,0.55)" : "0 2px 10px rgba(0,0,0,0.07)",
      border: rank === 1 ? "3px solid #FDCB6E" : "2px solid #F0F0F0",
      transform: `translateX(${x}px)`, opacity: op,
    }}>
      <span style={{ fontSize: 36, flexShrink: 0 }}>{medals[rank - 1]}</span>
      <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 26, color: "#2D3436" }}>{name}</div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, color: "#636E72", marginTop: 3 }}>{note}</div>
      </div>
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 28, color: rank === 1 ? "#E17055" : "#636E72", flexShrink: 0 }}>{score}</span>
    </div>
  );
};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showPhone = frame < 170;
  const showBicho = frame >= 155;

  const fullText = "which one is the best quality?";
  const charCount = Math.floor(interpolate(frame, [5, 55], [0, fullText.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const typedText = fullText.slice(0, charCount);

  const showDots = frame >= 60 && frame < 120;
  const showResults = frame >= 110;

  const bichoExpression = frame >= 185 ? "happy" as const : "excited" as const;
  const bichoEntrance = spring({ frame: frame - 155, fps, config: { damping: 10, stiffness: 110 } });
  const bichoX = interpolate(bichoEntrance, [0, 1], [600, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #F0F4FF 0%, #E0E8FF 100%)" }}>

      {/* ── Giant phone – fills safe zone ── */}
      {showPhone && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 780, height: 1340,
            backgroundColor: "#1A1A2E",
            borderRadius: 60, padding: 22,
            boxShadow: "0 50px 120px rgba(0,0,0,0.55)",
          }}>
            {/* notch */}
            <div style={{ width: 90, height: 14, backgroundColor: "#0D0D1A", borderRadius: 7, margin: "0 auto 14px" }} />
            {/* screen */}
            <div style={{
              width: "100%", height: "calc(100% - 28px)",
              backgroundColor: "#F8F9FA",
              borderRadius: 44, overflow: "hidden",
              padding: "22px 20px",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 16, borderBottom: "2px solid #E9ECEF" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#6C5CE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 26, color: "#2D3436" }}>AI Assistant</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, color: "#00B894" }}>● Online</div>
                </div>
              </div>

              {/* user message */}
              {charCount > 0 && (
                <div style={{
                  backgroundColor: "#6C5CE7", color: "white",
                  borderRadius: "28px 28px 8px 28px",
                  padding: "18px 22px",
                  fontFamily: "'Inter',sans-serif", fontSize: 24, fontWeight: 600,
                  marginLeft: 40, lineHeight: 1.4,
                }}>
                  {typedText}
                  {charCount < fullText.length && <span style={{ opacity: 0.5 }}>|</span>}
                </div>
              )}

              {/* AI thinking */}
              {showDots && (
                <div style={{ display: "flex", gap: 12, padding: "18px 16px", backgroundColor: "white", borderRadius: "8px 28px 28px 28px", width: "fit-content", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
                  <ThinkingDot delay={0} />
                  <ThinkingDot delay={8} />
                  <ThinkingDot delay={16} />
                </div>
              )}

              {/* AI results */}
              {showResults && (
                <div style={{ backgroundColor: "white", borderRadius: "8px 28px 28px 28px", padding: "20px 18px", boxShadow: "0 4px 16px rgba(0,0,0,0.09)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 22, fontWeight: 700, color: "#2D3436", marginBottom: 4 }}>Here's my ranking:</div>
                  {rankData.map((r, i) => (
                    <RankRow key={i} {...r} delay={i * 14} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Bicho reaction (peek from side) ── */}
      {showBicho && (
        <div style={{ position: "absolute", bottom: 300, right: -40, transform: `translateX(${bichoX}px)` }}>
          <BichoCharacter expression={bichoExpression} scale={2.4} animate />
        </div>
      )}
    </AbsoluteFill>
  );
};
