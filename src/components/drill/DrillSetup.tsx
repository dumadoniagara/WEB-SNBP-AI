"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Topic, Difficulty } from "@/lib/types";

const DIFFICULTIES: { value: Difficulty | "ALL"; label: string; hint: string }[] = [
  { value: "ALL", label: "Campuran", hint: "Semua tingkat" },
  { value: "EASY", label: "Mudah", hint: "Pemanasan" },
  { value: "MEDIUM", label: "Sedang", hint: "Standar UTBK" },
  { value: "HARD", label: "Sulit", hint: "Tantangan" },
];

const COUNTS = [5, 10, 15, 20];

export function DrillSetup({ topics }: { topics: Topic[] }) {
  const router = useRouter();
  const [subTestId, setSubTestId] = useState<number | "ALL">("ALL");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [count, setCount] = useState(10);
  const [starting, setStarting] = useState(false);

  const flatSubTests = useMemo(
    () =>
      topics.flatMap((t) =>
        (t.subTests ?? []).map((st) => ({ ...st, topicName: t.name, topicCode: t.code })),
      ),
    [topics],
  );

  function start() {
    setStarting(true);
    const params = new URLSearchParams();
    params.set("count", String(count));
    if (subTestId !== "ALL") params.set("subTestId", String(subTestId));
    if (difficulty !== "ALL") params.set("difficulty", difficulty);
    router.push(`/drill?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      {/* Sub-test */}
      <section>
        <SectionLabel index={1} title="Pilih materi" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectCard
            active={subTestId === "ALL"}
            onClick={() => setSubTestId("ALL")}
            title="Semua Materi"
            subtitle="Drilling acak dari seluruh bank soal"
            badge="MIX"
          />
          {flatSubTests.map((st) => (
            <SelectCard
              key={st.id}
              active={subTestId === st.id}
              onClick={() => setSubTestId(st.id)}
              title={st.name}
              subtitle={st.topicName}
              badge={st.topicCode}
            />
          ))}
        </div>
      </section>

      {/* Difficulty */}
      <section>
        <SectionLabel index={2} title="Tingkat kesulitan" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                difficulty === d.value
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <div className="text-sm font-semibold text-slate-900">{d.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{d.hint}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Count */}
      <section>
        <SectionLabel index={3} title="Jumlah soal" />
        <div className="mt-4 grid grid-cols-4 gap-3">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCount(c)}
              className={cn(
                "rounded-xl border py-4 text-center transition-all",
                count === c
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <div className="text-xl font-bold text-slate-900">{c}</div>
              <div className="text-xs text-slate-500">soal</div>
            </button>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 z-10">
        <Button onClick={start} size="lg" className="w-full shadow-xl" disabled={starting}>
          {starting ? "Menyiapkan soal…" : "Mulai Drilling"}
          {!starting && (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
        {index}
      </span>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  title,
  subtitle,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all",
        active
          ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900">{title}</span>
        <span className="block truncate text-xs text-slate-500">{subtitle}</span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-md px-2 py-1 text-[10px] font-bold",
          active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500",
        )}
      >
        {badge}
      </span>
    </button>
  );
}
