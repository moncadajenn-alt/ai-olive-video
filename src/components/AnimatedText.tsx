import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type AnimatedTextProps = {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  highlightWords?: string[];
  highlightColor?: string;
  style?: React.CSSProperties;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 52,
  color = "#2D3436",
  highlightWords = [],
  highlightColor = "#FDCB6E",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const translateY = interpolate(entrance, [0, 1], [30, 0], { extrapolateLeft: "clamp" });
  const scaleVal = interpolate(entrance, [0, 1], [0.85, 1], { extrapolateLeft: "clamp" });

  const words = text.split(" ");

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scaleVal})`,
        textAlign: "center",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 800,
        fontSize,
        color,
        lineHeight: 1.2,
        letterSpacing: "-0.5px",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const isHighlighted = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        );
        return (
          <span key={i}>
            {isHighlighted ? (
              <span
                style={{
                  backgroundColor: highlightColor,
                  borderRadius: 8,
                  padding: "0 6px",
                  color: "#2D3436",
                }}
              >
                {word}
              </span>
            ) : (
              word
            )}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

type SubtitleBadgeProps = {
  text: string;
  delay?: number;
  icon?: string;
};

export const SubtitleBadge: React.FC<SubtitleBadgeProps> = ({ text, delay = 0, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const scale = interpolate(entrance, [0, 1], [0.5, 1], { extrapolateLeft: "clamp" });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 24,
        padding: "14px 28px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        transform: `scale(${scale})`,
        opacity,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 36,
        color: "#2D3436",
      }}
    >
      {icon && <span style={{ fontSize: 32 }}>{icon}</span>}
      {text}
    </div>
  );
};
