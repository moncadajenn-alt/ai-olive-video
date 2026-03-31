/**
 * BichonDog – SVG character modeled after the real bichon frise.
 * White fluffy curly coat, dark round eyes, small dark nose, brown ear patches, red collar + silver tag.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type BichoExpression =
  | "confused"
  | "neutral"
  | "excited"
  | "happy"
  | "phone"
  | "confident"
  | "smile"
  | "curious"
  | "walking"
  | "scratching"
  | "examining";

type BichoProps = {
  expression?: BichoExpression;
  scale?: number;
  flipX?: boolean;
  animate?: boolean;
  /** override frame for manual animation control */
  frameOverride?: number;
};

const FurBall: React.FC<{ cx: number; cy: number; r: number; shadow?: boolean }> = ({ cx, cy, r, shadow }) => (
  <circle cx={cx} cy={cy} r={r} fill={shadow ? "#E8E0D8" : "#F5F0EB"} />
);

export const BichoCharacter: React.FC<BichoProps> = ({
  expression = "neutral",
  scale = 1,
  flipX = false,
  animate = true,
  frameOverride,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameOverride !== undefined ? frameOverride : currentFrame;

  /* ── idle animations ── */
  const bob = animate ? Math.sin((frame / fps) * Math.PI * 1.1) * 5 : 0;
  const tailWag = animate ? Math.sin((frame / fps) * Math.PI * 3.2) * 20 : 0;

  /* ── walking leg swing ── */
  const walkCycle = (frame / fps) * Math.PI * 4;
  const legSwingL = expression === "walking" ? Math.sin(walkCycle) * 25 : 0;
  const legSwingR = expression === "walking" ? Math.sin(walkCycle + Math.PI) * 25 : 0;
  const armSwingL = expression === "walking" ? Math.sin(walkCycle + Math.PI) * 20 : 0;
  const armSwingR = expression === "walking" ? Math.sin(walkCycle) * 20 : 0;
  const walkBob = expression === "walking" ? Math.abs(Math.sin(walkCycle)) * -8 : 0;

  /* ── scratching arm ── */
  const scratchAngle = expression === "scratching"
    ? 30 + Math.sin((frame / fps) * Math.PI * 6) * 20
    : 0;

  /* ── head tilt ── */
  const headTilt =
    expression === "confused" ? Math.sin((frame / fps) * Math.PI * 1.2) * 7
    : expression === "curious" ? -12
    : expression === "examining" ? 8
    : 0;

  /* ── entrance spring ── */
  const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const entryScale = interpolate(entrance, [0, 1], [0.4, 1]);

  /* ── eye shape ── */
  const squintEyes = expression === "happy" || expression === "smile" || expression === "excited";
  const wideEyes = !squintEyes;

  /* ── mouth ── */
  const getMouth = () => {
    if (expression === "happy" || expression === "excited" || expression === "walking") {
      return (
        <>
          <ellipse cx="0" cy="22" rx="14" ry="8" fill="#C0453C" />
          <ellipse cx="0" cy="27" rx="10" ry="6" fill="#E8777D" />
          <path d="M-10 22 Q0 30 10 22" fill="none" stroke="#A03030" strokeWidth="1.5" />
        </>
      );
    }
    if (expression === "smile" || expression === "confident" || expression === "examining") {
      return <path d="M -10 20 Q 0 28 10 20" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    if (expression === "confused" || expression === "scratching") {
      return <path d="M -9 22 Q -2 18 4 22 Q 8 25 12 21" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    if (expression === "curious") {
      return <path d="M -6 20 Q 0 24 8 20" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    return <path d="M -8 21 Q 0 25 8 21" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />;
  };

  /* ── eyebrows ── */
  const getEyebrows = () => {
    if (expression === "confused" || expression === "scratching") {
      return (
        <>
          <path d="M -30 -20 Q -24 -26 -18 -22" stroke="#C8A882" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M  18 -22 Q  24 -26  30 -20" stroke="#C8A882" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (expression === "excited" || expression === "happy" || expression === "walking") {
      return (
        <>
          <path d="M -30 -24 Q -24 -30 -18 -26" stroke="#C8A882" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M  18 -26 Q  24 -30  30 -24" stroke="#C8A882" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (expression === "curious" || expression === "examining") {
      // one eyebrow raised
      return (
        <>
          <path d="M -30 -24 Q -24 -32 -18 -28" stroke="#C8A882" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M  18 -22 Q  24 -26  30 -20" stroke="#C8A882" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }
    return null;
  };

  /* ── extras ── */
  const getExtras = () => {
    if (expression === "confused" || expression === "scratching") {
      const q = interpolate(Math.sin((frame / fps) * Math.PI * 2.2), [-1, 1], [0.4, 1]);
      return (
        <>
          <text x="-72" y="-70" fontSize="30" fill="#FF6B6B" fontWeight="bold" opacity={q}>?</text>
          <text x="44" y="-85" fontSize="22" fill="#A29BFE" fontWeight="bold" opacity={1 - q + 0.3}>?</text>
        </>
      );
    }
    if (expression === "excited" || expression === "happy") {
      return (
        <>
          <text x="-70" y="-70" fontSize="24" opacity="0.9">⭐</text>
          <text x="46" y="-80" fontSize="18" opacity="0.7">✨</text>
        </>
      );
    }
    if (expression === "phone" || expression === "examining") {
      return (
        <g transform="translate(58, 30)">
          <rect x="-14" y="-26" width="28" height="48" rx="5" fill="#1A1A2E" />
          <rect x="-11" y="-22" width="22" height="36" rx="3" fill="#74B9FF" />
          <circle cx="0" cy="-4" r="7" fill="rgba(255,255,255,0.4)" />
          <circle cx="0" cy="-4" r="4" fill="rgba(255,255,255,0.7)" />
          <circle cx="0" cy="18" r="3.5" fill="#636E72" />
        </g>
      );
    }
    if (expression === "curious") {
      const bulbPulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.85, 1.15]);
      return (
        <g transform={`translate(-10, -110) scale(${bulbPulse})`} style={{ transformOrigin: "0 0" }}>
          {/* idea bubble */}
          <circle cx="0" cy="0" r="28" fill="rgba(255,255,255,0.95)" stroke="#FDCB6E" strokeWidth="3" />
          <text x="0" y="10" textAnchor="middle" fontSize="28">💡</text>
          {/* bubble tail */}
          <circle cx="12" cy="24" r="6" fill="rgba(255,255,255,0.9)" stroke="#FDCB6E" strokeWidth="2" />
          <circle cx="22" cy="36" r="4" fill="rgba(255,255,255,0.85)" stroke="#FDCB6E" strokeWidth="1.5" />
          <circle cx="30" cy="46" r="3" fill="rgba(255,255,255,0.8)" stroke="#FDCB6E" strokeWidth="1.5" />
        </g>
      );
    }
    if (expression === "confident") {
      return <text x="50" y="-40" fontSize="28" opacity="0.85">💪</text>;
    }
    if (expression === "walking") {
      // bottle in hand
      return (
        <g transform="translate(50, 10) rotate(-15)">
          <rect x="-8" y="-24" width="16" height="8" rx="3" fill="#4A7C2A" />
          <rect x="-9" y="-16" width="18" height="44" rx="6" fill="#8FBC58" />
          <rect x="-7" y="-10" width="6" height="36" rx="3" fill="rgba(255,255,255,0.3)" />
          <rect x="-6" y="-2" width="12" height="18" rx="3" fill="white" opacity="0.85" />
          <text x="0" y="9" textAnchor="middle" fontSize="5" fill="#2D3436" fontWeight="bold">CLASSICO</text>
        </g>
      );
    }
    return null;
  };

  const showCheeks =
    expression === "happy" || expression === "excited" || expression === "smile" ||
    expression === "confident" || expression === "walking";

  return (
    <svg
      width={160 * scale}
      height={200 * scale}
      viewBox="-90 -130 180 220"
      style={{
        transform: `scaleX(${flipX ? -1 : 1}) translateY(${bob + walkBob}px) scale(${entryScale})`,
        overflow: "visible",
      }}
    >
      {/* shadow */}
      <ellipse cx="0" cy="88" rx={expression === "walking" ? 56 : 48} ry="10" fill="rgba(0,0,0,0.12)" />

      {/* ── BODY ── */}
      <ellipse cx="0" cy="40" rx="52" ry="46" fill="#F0EBE3" />
      <ellipse cx="0" cy="36" rx="34" ry="32" fill="#FDFAF7" />
      <FurBall cx="-50" cy="28" r="20" shadow />
      <FurBall cx="50" cy="28" r="20" shadow />
      <FurBall cx="-48" cy="50" r="18" shadow />
      <FurBall cx="48" cy="50" r="18" shadow />
      <FurBall cx="-40" cy="68" r="16" shadow />
      <FurBall cx="40" cy="68" r="16" shadow />
      <FurBall cx="0" cy="72" r="22" shadow />
      <FurBall cx="-22" cy="24" r="15" />
      <FurBall cx="22" cy="24" r="15" />

      {/* ── TAIL ── */}
      <g transform={`translate(48,55) rotate(${tailWag})`}>
        <ellipse cx="18" cy="-18" rx="14" ry="10" fill="#F0EBE3" transform="rotate(-45)" />
        <FurBall cx="24" cy="-22" r="10" />
        <FurBall cx="30" cy="-30" r="8" />
      </g>

      {/* ── LEGS ── */}
      {/* left leg */}
      <g transform={`translate(-24, 68) rotate(${legSwingL})`} style={{ transformOrigin: "0 0" }}>
        <rect x="-10" y="0" width="20" height="28" rx="10" fill="#F0EBE3" />
        <FurBall cx="-6" cy="4" r="9" />
        <FurBall cx="6" cy="4" r="9" />
        {/* paw */}
        <ellipse cx="0" cy="30" rx="12" ry="8" fill="#FDFAF7" />
        <FurBall cx="-5" cy="26" r="7" />
        <FurBall cx="5" cy="26" r="7" />
        <FurBall cx="0" cy="22" r="6" />
      </g>
      {/* right leg */}
      <g transform={`translate(24, 68) rotate(${legSwingR})`} style={{ transformOrigin: "0 0" }}>
        <rect x="-10" y="0" width="20" height="28" rx="10" fill="#F0EBE3" />
        <FurBall cx="-6" cy="4" r="9" />
        <FurBall cx="6" cy="4" r="9" />
        <ellipse cx="0" cy="30" rx="12" ry="8" fill="#FDFAF7" />
        <FurBall cx="-5" cy="26" r="7" />
        <FurBall cx="5" cy="26" r="7" />
        <FurBall cx="0" cy="22" r="6" />
      </g>

      {/* ── ARMS ── */}
      {/* left arm */}
      <g transform={`translate(-44, 18) rotate(${armSwingL - (expression === "walking" ? 0 : 0)})`} style={{ transformOrigin: "0 0" }}>
        <rect x="-9" y="0" width="18" height="24" rx="9" fill="#F0EBE3" />
        <FurBall cx="0" cy="2" r="10" />
      </g>
      {/* right arm (scratching override) */}
      {expression === "scratching" ? (
        <g transform={`translate(44, 18) rotate(${-scratchAngle})`} style={{ transformOrigin: "0 0" }}>
          <rect x="-9" y="0" width="18" height="24" rx="9" fill="#F0EBE3" />
          <FurBall cx="0" cy="2" r="10" />
        </g>
      ) : (
        <g transform={`translate(44, 18) rotate(${armSwingR})`} style={{ transformOrigin: "0 0" }}>
          <rect x="-9" y="0" width="18" height="24" rx="9" fill="#F0EBE3" />
          <FurBall cx="0" cy="2" r="10" />
        </g>
      )}

      {/* ── COLLAR ── */}
      <ellipse cx="0" cy="4" rx="28" ry="14" fill="#E8E0D5" />
      <path d="M -24 6 Q 0 14 24 6" stroke="#C0392B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="12" rx="8" ry="6" fill="#BDC3C7" />
      <ellipse cx="0" cy="12" rx="6" ry="4.5" fill="#ECF0F1" />
      <text x="0" y="15" textAnchor="middle" fontSize="5" fill="#7F8C8D" fontWeight="bold">ID</text>

      {/* ── HEAD ── */}
      <g transform={`rotate(${headTilt})`}>
        <circle cx="0" cy="-30" r="52" fill="#F0EBE3" />
        <FurBall cx="-48" cy="-40" r="22" shadow />
        <FurBall cx="48" cy="-40" r="22" shadow />
        <FurBall cx="-52" cy="-18" r="18" shadow />
        <FurBall cx="52" cy="-18" r="18" shadow />
        <FurBall cx="-44" cy="-60" r="20" shadow />
        <FurBall cx="44" cy="-60" r="20" shadow />
        <FurBall cx="-24" cy="-76" r="18" />
        <FurBall cx="24" cy="-76" r="18" />
        <FurBall cx="0" cy="-80" r="20" />
        <FurBall cx="-8" cy="-50" r="16" />
        <FurBall cx="8" cy="-50" r="16" />
        <ellipse cx="0" cy="-26" rx="36" ry="38" fill="#FDFAF7" />

        {/* ears */}
        <g>
          <ellipse cx="-46" cy="-28" rx="18" ry="28" fill="#D4B896" transform="rotate(-10,-46,-28)" />
          <ellipse cx="-46" cy="-28" rx="12" ry="22" fill="#C4A882" transform="rotate(-10,-46,-28)" />
          <FurBall cx="-52" cy="-20" r="14" shadow />
          <FurBall cx="-50" cy="-36" r="12" shadow />
          <FurBall cx="-42" cy="-44" r="10" shadow />
        </g>
        <g>
          <ellipse cx="46" cy="-28" rx="18" ry="28" fill="#D4B896" transform="rotate(10,46,-28)" />
          <ellipse cx="46" cy="-28" rx="12" ry="22" fill="#C4A882" transform="rotate(10,46,-28)" />
          <FurBall cx="52" cy="-20" r="14" shadow />
          <FurBall cx="50" cy="-36" r="12" shadow />
          <FurBall cx="42" cy="-44" r="10" shadow />
        </g>

        {/* eyes */}
        {wideEyes ? (
          <>
            <circle cx="-18" cy="-32" r="13" fill="white" />
            <circle cx="18" cy="-32" r="13" fill="white" />
            <circle cx="-18" cy="-32" r="9" fill="#3D1F0A" />
            <circle cx="18" cy="-32" r="9" fill="#3D1F0A" />
            <circle cx="-18" cy="-32" r="5" fill="#1A0A00" />
            <circle cx="18" cy="-32" r="5" fill="#1A0A00" />
            <circle cx="-22" cy="-36" r="3" fill="white" opacity="0.9" />
            <circle cx="14" cy="-36" r="3" fill="white" opacity="0.9" />
            <circle cx="-14" cy="-30" r="1.5" fill="white" opacity="0.6" />
            <circle cx="22" cy="-30" r="1.5" fill="white" opacity="0.6" />
          </>
        ) : (
          <>
            <path d="M -28 -34 Q -18 -44 -8 -34" stroke="#3D1F0A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M  8 -34 Q  18 -44  28 -34" stroke="#3D1F0A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M -26 -30 Q -18 -26 -10 -30" stroke="#3D1F0A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d="M  10 -30 Q  18 -26  26 -30" stroke="#3D1F0A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
          </>
        )}

        {/* nose */}
        <g transform="translate(0,4)">
          <ellipse cx="0" cy="0" rx="12" ry="9" fill="#2C1810" />
          <ellipse cx="0" cy="0" rx="10" ry="7.5" fill="#3D241A" />
          <ellipse cx="-3" cy="-3" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.25)" />
          <path d="M -5 2 Q 0 5 5 2" stroke="#1A0A00" strokeWidth="1.5" fill="none" />
        </g>

        {/* cheeks */}
        {showCheeks && (
          <>
            <circle cx="-28" cy="-14" r="12" fill="#FFB8B8" opacity="0.35" />
            <circle cx="28" cy="-14" r="12" fill="#FFB8B8" opacity="0.35" />
          </>
        )}

        {getMouth()}
        {getEyebrows()}
        {getExtras()}
      </g>
    </svg>
  );
};
