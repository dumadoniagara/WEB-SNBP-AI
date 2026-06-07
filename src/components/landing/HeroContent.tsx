"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import type { PointerEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE_OUT } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export function HeroContent() {
  return (
    <motion.div
      className="mx-auto max-w-3xl text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.span
        variants={item}
        className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
        </span>
        Bukan cuma di WhatsApp — sekarang di web
      </motion.span>

      <motion.h1
        variants={item}
        className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl"
      >
        Taklukkan UTBK dengan{" "}
        <span className="text-shimmer">latihan soal cerdas</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
      >
        Drilling soal TPS &amp; Tes Literasi dengan pembahasan instan. Pilih
        materi, atur tingkat kesulitan, dan asah kemampuanmu kapan saja —
        langsung dari browser.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <ButtonLink href="/register" size="lg" className="group w-full sm:w-auto">
          Mulai Latihan Gratis
          <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ButtonLink>
        <ButtonLink href="/login" size="lg" variant="secondary" className="w-full sm:w-auto">
          Saya sudah punya akun
        </ButtonLink>
      </motion.div>

      <motion.p variants={item} className="mt-4 text-sm text-slate-400">
        Gratis untuk memulai • Tanpa kartu kredit
      </motion.p>
    </motion.div>
  );
}

export function HeroPreview() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      className="relative mx-auto mt-16 max-w-2xl"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-brand-900/10 backdrop-blur sm:p-7"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Penalaran Umum
          </span>
          <span className="text-xs font-medium text-slate-400">Soal 3 / 10</span>
        </div>
        <p className="text-base font-medium leading-relaxed text-slate-800">
          Semua mahasiswa rajin belajar. Budi adalah mahasiswa. Maka kesimpulan
          yang pasti benar adalah…
        </p>
        <div className="mt-5 space-y-2.5">
          {[
            { k: "A", t: "Budi pasti lulus ujian", correct: false },
            { k: "B", t: "Budi rajin belajar", correct: true },
            { k: "C", t: "Budi tidak suka belajar", correct: false },
          ].map((o, i) => (
            <motion.div
              key={o.k}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
              className={
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm " +
                (o.correct
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700")
              }
            >
              <span
                className={
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold " +
                  (o.correct ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500")
                }
              >
                {o.k}
              </span>
              {o.t}
              {o.correct && (
                <motion.svg
                  viewBox="0 0 24 24"
                  className="ml-auto h-5 w-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 300, damping: 12 }}
                >
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-5 rounded-xl bg-brand-50/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Pembahasan
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Silogisme: premis umum + premis khusus → kesimpulan yang pasti benar.
          </p>
        </motion.div>
      </motion.div>

      <div className="animate-float absolute -left-6 -top-6 -z-10 h-24 w-24 rounded-2xl bg-violet-400/35 blur-2xl" />
      <div className="animate-float absolute -bottom-8 -right-8 -z-10 h-32 w-32 rounded-full bg-brand-400/40 blur-3xl" style={{ animationDelay: "-2s" }} />
    </motion.div>
  );
}
