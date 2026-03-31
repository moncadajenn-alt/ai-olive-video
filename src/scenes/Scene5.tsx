/**
 * Scene 5 – Asking + AI response (7 s = 210 frames)
 * Large phone close-up → bicho types → AI thinking dots → ranked results → bicho reacts
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";

export const SCENE5_DURATION = 210;

const ThinkingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bounce = Math.sin(((frame - delay) / fps) * Math.PI * 4) * 8;
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      width: 18, height: 18,
      borderRadius: "50%",
      backgroundColor: "#6C5CE7",
      transform: `translateY(${bounce}px)`,
      opacity,
    }} />
  );
};

type RankItem = { rank: number; name: string; score: string; note: string; color: string };
const rankData: RankItem[] = [
  { rank: 1, name: "CLASSICO",  score: "9.4/10", note: "Extra virgin · first cold press",  color: "#8FBC58" },
  { rank: 2, name: "VERDE",     score: "8.7/10", note: "Organic certified · low acidity",  color: "#5B9B5A" },
  { rank: 3, name: "PRIMAVERA", score: "8.0/10", note: "Cold pressed · good quality",       color: "#C8A830" },
  { rank: 4, name: "DORADO",    score: "7.2/10", note: "Premium blend · higher price",      color: "#D4A818" },
];

const RankRow: React.FC<RankItem & { delay: number }> = ({ rank, name, score, note, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140 } });
  const x = interpolate(e, [0, 1], [-100, 0], { extrapolateLeft: "clamp" });
  const op = interpolate(e, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const medals = ["🥇", "🥈", "🥉", "4️⃣"];

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      backgroundColor: rank === 1 ? "#FFFBEC" : "white",
      borderRadius: 14, padding: "13px 14px",
      boxShadow: rank === 1 ? "0 4px 18px rgba(253,203,110,0.5)" : "0 2px 8px rgba(0,0,0,0.06)",
      border: rank === 1 ? "2.5px solid #FDCB6E" : "1.5px solid #F0F0F0",
      transform: `translateX(${x}px)`, opacity: op,
    }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{medals[rank - 1]}</span>
      <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 20, color: "#2D3436" }}>{name}</div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#95A5A6", marginTop: 2 }}>{note}</div>
      </div>
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 22, color: rank === 1 ? "#E17055" : "#636E72", flexShrink: 0 }}>{score}</span>
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
  const bichoX = interpolate(bichoEntrance, [0, 1], [400, 0], { extrapolateLeft: "clamp" });

  const sparkleStart = 120;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFF5F0 0%, #FFE8DF 100%)" }}>

      {/* ── Large phone filling most of screen ── */}
      {showPhone && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 500, height: 820,
            backgroundColor: "#1A1A2E",
            borderRadius: 50, padding: 18,
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          }}>
            {/* notch */}
            <div style={{ width: 80, height: 12, backgroundColor: "#0D0D1A", borderRadius: 6, margin: "0 auto 12px" }} />
            {/* screen */}
            <div style={{
              width: "100%", height: "calc(100% - 24px)",
              backgroundColor: "#F8F9FA",
              borderRadius: 36, overflow: "hidden",
              padding: "18px 16px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1.5px solid #E9ECEF" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", backgroundColor: "#6C5CE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 19, color: "#2D3436" }}>AI Assistant</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#00B894" }}>● Online</div>
                </div>
              </div>

              {/* user message */}
              {charCount > 0 && (
                <div style={{
                  backgroundColor: "#6C5CE7", color: "white",
                  borderRadius: "20px 20px 6px 20px",
                  padding: "12px 16px",
                  fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 600,
                  marginLeft: 30,
                }}>
                  {typedText}
                  {charCount < fullText.length && <span style={{ opacity: 0.6 }}>|</span>}
                </div>
              )}

              {/* AI thinking */}
              {showDots && (
                <div style={{ display: "flex", gap: 10, padding: "14px 12px", backgroundColor: "white", borderRadius: "6px 20px 20px 20px", width: "fit-content", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
                  <ThinkingDot delay={0} />
                  <ThinkingDot delay={8} />
                  <ThinkingDot delay={16} />
                </div>
              )}

              {/* AI results */}
              {showResults && (
                <div style={{ backgroundColor: "white", borderRadius: "6px 20px 20px 20px", padding: "16px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 700, color: "#2D3436", marginBottom: 4 }}>Here's my ranking:</div>
                  {rankData.map((r, i) => (
                    <RankRow key={i} {...r} delay={i * 14} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sparkle confetti ── */}
      {showResults && [
        { x: 40,  y: 300, c: "#FDCB6E", sz: 20 },
        { x: 990, y: 280, c: "#FF7675", sz: 16 },
        { x: 30,  y: 500, c: "#74B9FF", sz: 18 },
        { x: 1010,y: 500, c: "#A29BFE", sz: 14 },
        { x: 60,  y: 700, c: "#55EFC4", sz: 16 },
        { x: 970, y: 700, c: "#FD79A8", sz: 12 },
      ].map((d, i) => {
        const f2 = Math.max(0, frame - sparkleStart - i * 5);
        const e = spring({ frame: f2, fps, config: { damping: 8, stiffness: 150 } });
        const s = interpolate(e, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", left: d.x, top: d.y,
            width: d.sz, height: d.sz, borderRadius: "50%",
            backgroundColor: d.c,
            transform: `scale(${s})`, opacity: s,
          }} />
        );
      })}

      {/* ── Bicho reaction ── */}
      {showBicho && (
        <div style={{
          position: "absolute", bottom: 40, right: 10,
          transform: `translateX(${bichoX}px)`,
        }}>
          <BichoCharacter expression={bichoExpression} scale={2.4} animate />
        </div>
      )}

      {/* ── Top label (fades out when results show so phone is fully readable) ── */}
      <div style={{
        position: "absolute", top: 50, left: 60, right: 60,
        display: "flex", justifyContent: "center",
        opacity: interpolate(frame, [0, 15, 100, 115], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 22, padding: "12px 36px", boxShadow: "0 6px 24px rgba(0,0,0,0.1)" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 46, color: "#2D3436" }}>
            AI compares & recommends 🤖
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
