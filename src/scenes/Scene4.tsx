/**
 * Scene 4 – Step-by-step setup (8 s = 240 frames)
 * 4 internal parts with quick cuts + text sequence
 * Part1: arrange bottles | Part2: frame shot | Part3: tap + | Part4: shutter
 */
import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BichoCharacter } from "../components/BichoCharacter";
import { AnimatedText } from "../components/AnimatedText";
import { SupermarketBg } from "../components/SupermarketBg";

export const SCENE4_DURATION = 240;

/* ──────────────────────────── Part 1: Arrange bottles ─────────────────────────── */
const Part1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bottles = [
    { color: "#8FBC58", cap: "#4A7C2A", label: "CLASSICO", targetX: -165 },
    { color: "#C8A830", cap: "#8B6914", label: "PRIMAVERA", targetX: -55 },
    { color: "#5B9B5A", cap: "#2E5C2E", label: "VERDE", targetX: 55 },
    { color: "#D4A818", cap: "#9A6E00", label: "DORADO", targetX: 165 },
  ];

  return (
    <AbsoluteFill>
      <SupermarketBg brightness={0.92} />

      {/* flat surface */}
      <div style={{ position: "absolute", bottom: 360, left: 60, right: 60, height: 20, background: "linear-gradient(180deg,#C4975A,#9B7340)", borderRadius: 4, boxShadow: "0 5px 14px rgba(0,0,0,0.2)" }} />
      <div style={{ position: "absolute", bottom: 340, left: 60, right: 60, height: 30, background: "linear-gradient(180deg, #E8DDD0, #D8CECE)", borderRadius: "0 0 4px 4px" }} />

      {/* bottles sliding into place */}
      {bottles.map((b, i) => {
        const arrival = spring({ frame: frame - i * 8, fps, config: { damping: 12, stiffness: 110 } });
        const x = interpolate(arrival, [0, 1], [i % 2 === 0 ? -300 : 300, b.targetX], { extrapolateLeft: "clamp" });
        // small nudge to align
        const nudge = i === 3 ? interpolate(frame, [45, 52], [8, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }) : 0;
        return (
          <div key={i} style={{
            position: "absolute",
            bottom: 380,
            left: "50%",
            transform: `translateX(calc(${x}px - 50%)) translateX(${nudge}px)`,
            transformOrigin: "bottom center",
          }}>
            <svg width="90" height="148" viewBox="0 0 80 130">
              <rect x="26" y="2" width="28" height="18" rx="5" fill={b.cap} />
              <rect x="28" y="4" width="8" height="12" rx="3" fill="rgba(255,255,255,0.35)" />
              <rect x="30" y="18" width="20" height="14" fill={b.color} />
              <rect x="8" y="30" width="64" height="85" rx="16" fill={b.color} />
              <rect x="12" y="34" width="10" height="70" rx="5" fill="rgba(255,255,255,0.28)" />
              <rect x="14" y="44" width="52" height="55" rx="7" fill="white" opacity="0.92" />
              <rect x="14" y="44" width="52" height="14" rx="7" fill={b.cap} opacity="0.88" />
              <text x="40" y="54" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">{b.label}</text>
              <text x="40" y="70" textAnchor="middle" fontSize="7" fill="#636E72">Olive Oil</text>
            </svg>
          </div>
        );
      })}

      {/* bicho placing bottles */}
      <div style={{ position: "absolute", bottom: 80, right: 60 }}>
        <BichoCharacter expression="neutral" scale={1.8} animate />
      </div>

      <div style={{ position: "absolute", top: 110, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "14px 36px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
          <AnimatedText text="place bottles side by side" delay={0} fontSize={50} color="#2D3436" highlightWords={["side"]} highlightColor="#55EFC4" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ──────────────────────────── Part 2: Frame the shot ─────────────────────────── */
const Part2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // phone tilt left/right while framing
  const tilt = interpolate(
    frame,
    [5, 18, 32, 46, 55],
    [0, -15, 12, -6, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #F0F8FF 0%, #E0EFFF 100%)" }}>
      <SupermarketBg brightness={0.9} />

      {/* flat surface */}
      <div style={{ position: "absolute", bottom: 360, left: 60, right: 60, height: 20, background: "linear-gradient(180deg,#C4975A,#9B7340)", borderRadius: 4, boxShadow: "0 5px 14px rgba(0,0,0,0.2)" }} />

      {/* 4 bottles lined up */}
      <div style={{ position: "absolute", bottom: 380, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 36 }}>
        {[["#8FBC58","#4A7C2A","CLASSICO"],["#C8A830","#8B6914","PRIMAVERA"],["#5B9B5A","#2E5C2E","VERDE"],["#D4A818","#9A6E00","DORADO"]].map(([c,cp,l], i) => (
          <div key={i}>
            <svg width="80" height="132" viewBox="0 0 80 130">
              <rect x="26" y="2" width="28" height="18" rx="5" fill={cp} />
              <rect x="8" y="18" width="64" height="98" rx="16" fill={c} />
              <rect x="12" y="24" width="10" height="80" rx="5" fill="rgba(255,255,255,0.25)" />
              <rect x="14" y="44" width="52" height="44" rx="7" fill="white" opacity="0.88" />
              <text x="40" y="68" textAnchor="middle" fontSize="8" fill="#2D3436">{l}</text>
            </svg>
          </div>
        ))}
      </div>

      {/* bicho holding phone up, tilting */}
      <div style={{ position: "absolute", bottom: 100, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "bottom center" }}>
          <BichoCharacter expression="phone" scale={2.2} animate />
        </div>
      </div>

      {/* viewfinder overlay on phone */}
      <div style={{
        position: "absolute",
        top: 400, left: "50%",
        transform: `translateX(40%) rotate(${tilt}deg)`,
        transformOrigin: "center center",
        width: 140, height: 110,
        border: "3px solid rgba(255,255,255,0.9)",
        borderRadius: 10,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.25)",
      }}>
        <div style={{ position: "absolute", top: -3, left: -3, width: 20, height: 20, borderTop: "4px solid white", borderLeft: "4px solid white", borderRadius: "8px 0 0 0" }} />
        <div style={{ position: "absolute", top: -3, right: -3, width: 20, height: 20, borderTop: "4px solid white", borderRight: "4px solid white", borderRadius: "0 8px 0 0" }} />
        <div style={{ position: "absolute", bottom: -3, left: -3, width: 20, height: 20, borderBottom: "4px solid white", borderLeft: "4px solid white", borderRadius: "0 0 0 8px" }} />
        <div style={{ position: "absolute", bottom: -3, right: -3, width: 20, height: 20, borderBottom: "4px solid white", borderRight: "4px solid white", borderRadius: "0 0 8px 0" }} />
      </div>

      <div style={{ position: "absolute", top: 110, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "14px 36px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
          <AnimatedText text="open your AI app" delay={0} fontSize={52} color="#2D3436" highlightWords={["AI"]} highlightColor="#A29BFE" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ──────────────────────────── Part 3: Tap + button ─────────────────────────── */
const Part3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tapEntrance = spring({ frame: frame - 20, fps, config: { damping: 6, stiffness: 300 } });
  const tapScale = interpolate(tapEntrance, [0, 0.5, 1], [1, 0.6, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #E8DCFF 100%)" }}>
      {/* phone screen mock */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 320, height: 580, backgroundColor: "#1A1A2E", borderRadius: 40, padding: 16, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ width: 70, height: 10, backgroundColor: "#0D0D1A", borderRadius: 5, margin: "0 auto 10px" }} />
          <div style={{ width: "100%", height: "calc(100% - 20px)", backgroundColor: "#F8F9FA", borderRadius: 28, overflow: "hidden", position: "relative" }}>
            {/* chat interface */}
            <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid #E9ECEF" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#6C5CE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 16, color: "#2D3436" }}>AI Assistant</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#00B894" }}>● Online</div>
                </div>
              </div>
              {/* spacer */}
              <div style={{ flex: 1 }} />
              {/* camera + button area */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                backgroundColor: "#F0F0F0", borderRadius: 28, padding: "10px 14px",
              }}>
                {/* + button */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  backgroundColor: "#6C5CE7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, color: "white", fontWeight: 900,
                  transform: `scale(${tapScale})`,
                  boxShadow: "0 4px 14px rgba(108,92,231,0.5)",
                  cursor: "pointer",
                }}>+</div>
                <div style={{ flex: 1, fontFamily: "'Inter',sans-serif", fontSize: 14, color: "#95A5A6" }}>Type a message...</div>
              </div>
            </div>

            {/* camera option popup */}
            {frame >= 30 && (
              <div style={{
                position: "absolute",
                bottom: 80, left: 12, right: 12,
                backgroundColor: "white",
                borderRadius: 18,
                padding: "10px 0",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                opacity: interpolate(frame, [30, 44], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [30, 44], [20, 0], { extrapolateRight: "clamp" })}px)`,
              }}>
                {[["📷", "Camera", "#0984E3"], ["🖼️", "Photo Library", "#00B894"], ["📄", "Document", "#6C5CE7"]].map(([icon, label, color], i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 18px",
                    backgroundColor: i === 0 ? "#E8F4FD" : "transparent",
                    borderRadius: i === 0 ? 12 : 0,
                  }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 15, color: i === 0 ? color : "#636E72" }}>{label}</span>
                    {i === 0 && <span style={{ marginLeft: "auto", fontSize: 14, color }}> ← selected</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 100, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(255,255,255,0.93)", borderRadius: 20, padding: "14px 36px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}>
          <AnimatedText text="use the camera" delay={0} fontSize={52} color="#2D3436" highlightWords={["camera"]} highlightColor="#74B9FF" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ──────────────────────────── Part 4: Camera shutter ─────────────────────────── */
const Part4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // shutter blink at frame ~30
  const shutterOpacity = interpolate(
    frame,
    [28, 30, 34, 36],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // flash
  const flashOpacity = interpolate(
    frame,
    [29, 31, 38],
    [0, 0.8, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: "#0D0D1A", overflow: "hidden" }}>
      {/* camera viewfinder UI */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #1A1A2E 0%, #2D2D44 100%)",
      }}>
        {/* bottles in viewfinder */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -40%)" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end" }}>
            {[["#8FBC58","#4A7C2A","CLASSICO"],["#C8A830","#8B6914","PRIMAVERA"],["#5B9B5A","#2E5C2E","VERDE"],["#D4A818","#9A6E00","DORADO"]].map(([c,cp,l],i)=>(
              <div key={i}>
                <svg width="70" height="118" viewBox="0 0 80 130">
                  <rect x="26" y="2" width="28" height="18" rx="5" fill={cp} />
                  <rect x="8" y="18" width="64" height="98" rx="16" fill={c} />
                  <rect x="14" y="44" width="52" height="44" rx="7" fill="white" opacity="0.85" />
                  <text x="40" y="68" textAnchor="middle" fontSize="8" fill="#2D3436">{l}</text>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* viewfinder corners */}
      {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
        <div key={i} style={{
          position: "absolute",
          [v]: 180, [h]: 60,
          width: 40, height: 40,
          borderTop: v === "top" ? "4px solid rgba(255,255,255,0.8)" : undefined,
          borderBottom: v === "bottom" ? "4px solid rgba(255,255,255,0.8)" : undefined,
          borderLeft: h === "left" ? "4px solid rgba(255,255,255,0.8)" : undefined,
          borderRight: h === "right" ? "4px solid rgba(255,255,255,0.8)" : undefined,
          borderRadius: v === "top" && h === "left" ? "8px 0 0 0" : v === "top" && h === "right" ? "0 8px 0 0" : v === "bottom" && h === "left" ? "0 0 0 8px" : "0 0 8px 0",
        }} />
      ))}

      {/* focus indicator */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 140, height: 100,
        border: "2px solid rgba(255,220,0,0.8)",
        borderRadius: 8,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }} />

      {/* shutter animation */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "black",
        opacity: shutterOpacity,
        pointerEvents: "none",
      }} />

      {/* camera flash */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "white",
        opacity: flashOpacity,
        pointerEvents: "none",
      }} />

      {/* shutter button UI */}
      <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          border: "5px solid rgba(255,255,255,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${interpolate(frame, [26, 30, 36], [1, 0.8, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })})`,
        }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)" }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 100, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "14px 36px", backdropFilter: "blur(8px)" }}>
          <AnimatedText text="take a photo" delay={0} fontSize={56} color="white" highlightWords={["photo"]} highlightColor="#FDCB6E" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ──────────────────────────── Main Scene 4 ─────────────────────────── */
export const Scene4: React.FC = () => {
  const PART = 55;
  return (
    <AbsoluteFill>
      <Sequence from={0}   durationInFrames={PART}   premountFor={6}><Part1 /></Sequence>
      <Sequence from={PART}   durationInFrames={PART} premountFor={6}><Part2 /></Sequence>
      <Sequence from={PART*2} durationInFrames={PART} premountFor={6}><Part3 /></Sequence>
      <Sequence from={PART*3} durationInFrames={SCENE4_DURATION - PART*3} premountFor={6}><Part4 /></Sequence>
    </AbsoluteFill>
  );
};
