/**
 * SupermarketBg – reusable supermarket environment
 * Supports panX / panY / zoom for simulated camera movement
 */
import React from "react";

type SupermarketBgProps = {
  panX?: number;       // horizontal translate px
  panY?: number;       // vertical translate px
  zoom?: number;       // scale multiplier (1 = normal)
  showFloor?: boolean;
  showCeiling?: boolean;
  brightness?: number; // 0-1 opacity overlay
};

const ShelfColumn: React.FC<{ x: number; shelfColor: string; productColors: string[] }> = ({ x, shelfColor, productColors }) => (
  <g>
    {/* back panel */}
    <rect x={x} y={0} width={200} height={520} fill={shelfColor} />
    {/* shelf planks */}
    {[130, 260, 390].map((y) => (
      <g key={y}>
        <rect x={x - 5} y={y} width={210} height={14} rx="3" fill="#9B7340" />
        <rect x={x - 5} y={y + 12} width={210} height={4} fill="#7A5A28" />
      </g>
    ))}
    {/* products on shelves */}
    {[40, 170, 300].map((y, row) =>
      productColors.slice(row * 3, row * 3 + 3).map((c, ci) => (
        <rect key={ci} x={x + 8 + ci * 60} y={y} width={44} height={y < 170 ? 80 : 70} rx="6" fill={c} opacity="0.85" />
      ))
    )}
    {/* price tag strip */}
    {[143, 273].map((y) => (
      <rect key={y} x={x + 4} y={y} width={192} height={12} fill="#FFFDE7" opacity="0.9" />
    ))}
  </g>
);

export const SupermarketBg: React.FC<SupermarketBgProps> = ({
  panX = 0,
  panY = 0,
  zoom = 1,
  showFloor = true,
  showCeiling = true,
  brightness = 1,
}) => {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
        transformOrigin: "center center",
      }}>
        {/* ── Ceiling ── */}
        {showCeiling && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 140,
            background: "linear-gradient(180deg, #E8E0D4 0%, #F5EFE8 100%)",
          }}>
            {/* fluorescent light strips */}
            {[80, 340, 600, 860].map((x) => (
              <div key={x} style={{
                position: "absolute",
                left: x, top: 20,
                width: 200, height: 22,
                backgroundColor: "#FFFFF0",
                borderRadius: 4,
                boxShadow: "0 0 30px 10px rgba(255,255,220,0.5)",
              }} />
            ))}
            {/* Aisle sign */}
            <div style={{
              position: "absolute",
              top: 60, left: 0, right: 0,
              display: "flex", justifyContent: "center",
            }}>
              <div style={{
                backgroundColor: "#27AE60",
                borderRadius: "0 0 14px 14px",
                padding: "10px 44px 10px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 24, color: "white", letterSpacing: 3 }}>
                  AISLE 5
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 16, color: "#A8E6C1" }}>
                  🫒 OILS &amp; CONDIMENTS
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Back wall / far shelves ── */}
        <div style={{
          position: "absolute",
          top: 130, left: 0, right: 0,
          height: 560,
          backgroundColor: "#E8DECE",
        }}>
          <svg width="1080" height="560" viewBox="0 0 1080 560" style={{ position: "absolute", top: 0, left: 0 }}>
            <ShelfColumn x={0}   shelfColor="#DDD0BE" productColors={["#E8B86D","#7EC850","#D4A8D8","#74B9FF","#FF7675","#FDCB6E","#A29BFE","#55EFC4","#FD79A8"]} />
            <ShelfColumn x={205} shelfColor="#D6C9B6" productColors={["#74B9FF","#FF7675","#55EFC4","#E8B86D","#D4A8D8","#A29BFE","#7EC850","#FDCB6E","#FD79A8"]} />
            <ShelfColumn x={410} shelfColor="#DDD0BE" productColors={["#A29BFE","#FDCB6E","#7EC850","#FF7675","#74B9FF","#E8B86D","#55EFC4","#FD79A8","#D4A8D8"]} />
            <ShelfColumn x={615} shelfColor="#D6C9B6" productColors={["#55EFC4","#D4A8D8","#FDCB6E","#A29BFE","#7EC850","#FF7675","#E8B86D","#74B9FF","#FD79A8"]} />
            <ShelfColumn x={820} shelfColor="#DDD0BE" productColors={["#FD79A8","#7EC850","#74B9FF","#55EFC4","#FDCB6E","#D4A8D8","#FF7675","#A29BFE","#E8B86D"]} />
            {/* perspective vanishing line overlay */}
            <line x1="540" y1="0" x2="0" y2="560" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            <line x1="540" y1="0" x2="1080" y2="560" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </svg>
        </div>

        {/* ── Foreground shelf surface ── */}
        <div style={{
          position: "absolute",
          top: 880, left: 0, right: 0,
          height: 24,
          background: "linear-gradient(180deg, #C4975A 0%, #9B7340 100%)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        }} />
        {/* shelf front face */}
        <div style={{
          position: "absolute",
          top: 904, left: 0, right: 0,
          height: 55,
          background: "linear-gradient(180deg, #9B7340 0%, #7A5A28 100%)",
        }} />
        {/* price tag rail */}
        <div style={{
          position: "absolute",
          top: 912, left: 0, right: 0,
          height: 22,
          backgroundColor: "#FFD700",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
        }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 13, color: "#5D4300", letterSpacing: 0.5 }}>
            🫒 EXTRA VIRGIN OLIVE OIL — COMPARE &amp; CHOOSE
          </span>
        </div>
        {/* shelf back wall strip */}
        <div style={{
          position: "absolute",
          top: 720, left: 0, right: 0,
          height: 170,
          background: "linear-gradient(180deg, #EEE5D8 0%, #E0D4C4 100%)",
          borderBottom: "3px solid #C4A882",
        }} />

        {/* ── Floor ── */}
        {showFloor && (
          <div style={{
            position: "absolute",
            top: 959, left: 0, right: 0,
            height: 1000,
            background: "linear-gradient(180deg, #E8DDD0 0%, #D8CEC0 100%)",
          }}>
            {/* tile grid */}
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <div key={`${row}-${col}`} style={{
                  position: "absolute",
                  left: col * 216, top: row * 165,
                  width: 212, height: 161,
                  border: "2px solid rgba(0,0,0,0.055)",
                  borderRadius: 2,
                }} />
              ))
            )}
            {/* floor reflection */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: 120,
              background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
            }} />
          </div>
        )}

        {/* ── Overhead light glow (aisle center) ── */}
        <div style={{
          position: "absolute",
          top: 0, left: "10%", right: "10%", height: 900,
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,220,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* brightness overlay */}
      {brightness < 1 && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(0,0,0," + (1 - brightness) + ")",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
};
