/**
 * Scene 5 – Asking + AI response (7 s = 210 frames)
 * Close-up phone screen → bicho types → AI thinking dots → ranked results → bicho reacts
 * Text: "AI compares and recommends"
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { AnimatedText } from "../components/AnimatedText";

export const SCENE5_DURATION = 210;

const ThinkingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bounce = Math.sin(((frame - delay) / fps) * Math.PI * 4) * 6;
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      width: 14, height: 14,
      borderRadius: "50%",
      backgroundColor: "#6C5CE7",
      transform: `translateY(${bounce}px)`,
      opacity,
    }} />
  );
};

type RankItem = { rank: number; name: string; score: string; note: string; color: string };
const rankData: RankItem[] = [
  { rank: 1, name: "CLASSICO",  score: "9.4/10", note: "Extra virgin, first cold press",  color: "#8FBC58" },
  { rank: 2, name: "VERDE",     score: "8.7/10", note: "Organic certified, low acidity",   color: "#5B9B5A" },
  { rank: 3, name: "PRIMAVERA", score: "8.0/10", note: "Cold pressed, good quality",        color: "#C8A830" },
  { rank: 4, name: "DORADO",    score: "7.2/10", note: "Premium blend",                      color: "#D4A818" },
];

const RankRow: React.FC<RankItem & { delay: number }> = ({ rank, name, score, note, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140 } });
  const x = interpolate(e, [0, 1], [-80, 0], { extrapolateLeft: "clamp" });
  const op = interpolate(e, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const medals = ["🥇","🥈","🥉","4️⃣"];

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 9,
      backgroundColor: rank === 1 ? "#FFFBEC" : "white",
      borderRadius: 12, padding: "9px 10px",
      boxShadow: rank === 1 ? "0 3px 14px rgba(253,203,110,0.45)" : "0 2px 6px rgba(0,0,0,0.05)",
      border: rank === 1 ? "2px solid #FDCB6E" : "1px solid #F0F0F0",
      transform: `translateX(${x}px)`, opacity: op,
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{medals[rank - 1]}</span>
      <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 15, color: "#2D3436" }}>{name}</div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#95A5A6" }}>{note}</div>
      </div>
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: 17, color: rank === 1 ? "#E17055" : "#636E72", flexShrink: 0 }}>{score}</span>
    </div>
  );
};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-60):  phone screen close-up, typing
  // Phase 2 (60-120): AI thinking dots
  // Phase 3 (120-170): results appear
  // Phase 4 (170-210): cut to bicho reaction

  const showPhone = frame < 170;
  const showBicho = frame >= 155;

  // typing animation: "which one is the best quality and why?"
  const fullText = "which one is the best quality and why?";
  const charCount = Math.floor(interpolate(frame, [5, 55], [0, fullText.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const typedText = fullText.slice(0, charCount);

  // thinking dots phase
  const showDots = frame >= 60 && frame < 120;
  const showResults = frame >= 110;

  // bicho expression timeline
  const bichoExpression = frame >= 185 ? "happy" as const : "excited" as const;

  // bicho entrance
  const bichoEntrance = spring({ frame: frame - 155, fps, config: { damping: 10, stiffness: 110 } });
  const bichoX = interpolate(bichoEntrance, [0, 1], [400, 0], { extrapolateLeft: "clamp" });

  // success chime sparkles
  const sparkleStart = 120;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #FFF5F0 0%, #FFE8DF 100%)" }}>

      {/* ── Phone screen ── */}
      {showPhone && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 340, height: 600,
            backgroundColor: "#1A1A2E",
            borderRadius: 40, padding: 16,
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          }}>
            <div style={{ width: 70, height: 10, backgroundColor: "#0D0D1A", borderRadius: 5, margin: "0 auto 10px" }} />
            <div style={{ width: "100%", height: "calc(100% - 20px)", backgroundColor: "#F8F9FA", borderRadius: 28, overflow: "hidden", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: "1px solid #E9ECEF" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#6C5CE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 15, color: "#2D3436" }}>AI Assistant</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: "#00B894" }}>● Online</div>
                </div>
              </div>

              {/* user message */}
              {charCount > 0 && (
                <div style={{
                  backgroundColor: "#6C5CE7", color: "white",
                  borderRadius: "16px 16px 4px 16px",
                  padding: "9px 12px",
                  fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500,
                  marginLeft: 20,
                }}>
                  {typedText}
                  {charCount < fullText.length && <span style={{ opacity: 0.6 }}>|</span>}
                </div>
              )}

              {/* AI thinking */}
              {showDots && (
                <div style={{ display: "flex", gap: 8, padding: "10px 8px", backgroundColor: "white", borderRadius: "4px 16px 16px 16px", width: "fit-content", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <ThinkingDot delay={0} />
                  <ThinkingDot delay={8} />
                  <ThinkingDot delay={16} />
                </div>
              )}

              {/* AI results */}
              {showResults && (
                <div style={{ backgroundColor: "white", borderRadius: "4px 16px 16px 16px", padding: "12px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: "#2D3436", marginBottom: 4 }}>Here's my ranking:</div>
                  {rankData.map((r, i) => (
                    <RankRow key={i} {...r} delay={i * 14} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sparkle confetti on results ── */}
      {showResults && [
        { x: 80, y: 300, c: "#FDCB6E", sz: 18 },
        { x: 950, y: 280, c: "#FF7675", sz: 14 },
        { x: 60, y: 500, c: "#74B9FF", sz: 16 },
        { x: 980, y: 500, c: "#A29BFE", sz: 12 },
        { x: 100, y: 700, c: "#55EFC4", sz: 14 },
        { x: 940, y: 700, c: "#FD79A8", sz: 10 },
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
          position: "absolute", bottom: 60, right: 20,
          transform: `translateX(${bichoX}px)`,
        }}>
          <BichoCharacter expression={bichoExpression} scale={2.3} animate />
        </div>
      )}

      {/* ── Text ── */}
      <div style={{
        position: "absolute", top: 100, left: 60, right: 60,
        display: "flex", justifyContent: "center",
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 22, padding: "16px 40px", boxShadow: "0 6px 24px rgba(0,0,0,0.1)" }}>
          <AnimatedText text="AI compares and recommends" delay={0} fontSize={46} color="#2D3436" highlightWords={["AI","recommends"]} highlightColor="#FDCB6E" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
