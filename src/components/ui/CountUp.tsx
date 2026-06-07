"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/utils";

/**
 * Counts from 0 to `value` once it scrolls into view. `suffix` lets you append
 * "%", "+", etc. Non-numeric displays (e.g. "∞") fall back to static text.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1.4,
  className,
  fallback,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  fallback?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {fallback ?? `${display.toLocaleString("id-ID")}${suffix}`}
    </span>
  );
}
