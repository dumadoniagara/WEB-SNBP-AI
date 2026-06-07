"use client";

import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

const COLORS = ["#6366f1", "#a855f7", "#f59e0b", "#10b981", "#ec4899", "#38bdf8"];

/**
 * Lightweight CSS confetti burst — no canvas, no deps. Renders `count` pieces
 * that fall and spin once. Mount it when you want the celebration to fire.
 */
export function Confetti({ count = 70 }: { count?: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.4,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
        rounded: Math.random() > 0.5,
      })),
    [count],
  );

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-full overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
