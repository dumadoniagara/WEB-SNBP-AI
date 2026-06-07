"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/types";

interface Props {
  count: number;
  subTestId?: string;
  difficulty?: string;
}

type Status = "loading" | "ready" | "error" | "empty";

const DIFF_BADGE: Record<string, string> = {
  EASY: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD: "bg-red-100 text-red-700",
};

const DIFF_LABEL: Record<string, string> = {
  EASY: "Mudah",
  MEDIUM: "Sedang",
  HARD: "Sulit",
};

export function DrillSession({ count, subTestId, difficulty }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  // questionId -> selected optionKey
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    const params = new URLSearchParams();
    params.set("count", String(count));
    if (subTestId) params.set("subTestId", subTestId);
    if (difficulty) params.set("difficulty", difficulty);
    try {
      const res = await fetch(`/api/questions/random?${params.toString()}`);
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data: Question[] = await res.json();
      if (!data.length) {
        setStatus("empty");
        return;
      }
      setQuestions(data);
      setCurrent(0);
      setAnswers({});
      setRevealed({});
      setFinished(false);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [count, subTestId, difficulty]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <MessageState kind="error" onRetry={load} />;
  if (status === "empty") return <MessageState kind="empty" onRetry={load} />;

  const score = questions.reduce((n, q) => {
    const picked = answers[q.id];
    const correct = q.options.find((o) => o.isCorrect)?.optionKey;
    return n + (picked && picked === correct ? 1 : 0);
  }, 0);

  if (finished) {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        score={score}
        onRetry={load}
      />
    );
  }

  const q = questions[current];
  const isRevealed = !!revealed[q.id];
  const picked = answers[q.id];
  const correctKey = q.options.find((o) => o.isCorrect)?.optionKey;
  const answeredCount = Object.keys(revealed).length;
  const isLast = current === questions.length - 1;

  function choose(optionKey: string) {
    if (isRevealed) return;
    setAnswers((a) => ({ ...a, [q.id]: optionKey }));
    setRevealed((r) => ({ ...r, [q.id]: true }));
  }

  return (
    <div className="space-y-6">
      <ProgressHeader
        current={current}
        total={questions.length}
        answered={answeredCount}
      />

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 animate-in" key={q.id}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {q.subTestName}
          </span>
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", DIFF_BADGE[q.difficulty])}>
            {DIFF_LABEL[q.difficulty] ?? q.difficulty}
          </span>
          {q.year && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              {q.year}
            </span>
          )}
        </div>

        <p className="whitespace-pre-line text-base leading-relaxed text-slate-800 sm:text-lg">
          {q.content}
        </p>
        {q.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={q.imageUrl}
            alt="Ilustrasi soal"
            className="mt-4 max-h-80 rounded-xl border border-slate-200 object-contain"
          />
        )}

        <div className="mt-6 space-y-3">
          {q.options.map((opt) => {
            const isPicked = picked === opt.optionKey;
            const isCorrect = opt.optionKey === correctKey;
            const state = !isRevealed
              ? "idle"
              : isCorrect
                ? "correct"
                : isPicked
                  ? "wrong"
                  : "muted";
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.optionKey)}
                disabled={isRevealed}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                  state === "idle" &&
                    "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40",
                  state === "correct" && "border-emerald-400 bg-emerald-50",
                  state === "wrong" && "border-red-400 bg-red-50",
                  state === "muted" && "border-slate-200 bg-white opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold",
                    state === "idle" && "bg-slate-100 text-slate-600",
                    state === "correct" && "bg-emerald-500 text-white",
                    state === "wrong" && "bg-red-500 text-white",
                    state === "muted" && "bg-slate-100 text-slate-400",
                  )}
                >
                  {opt.optionKey}
                </span>
                <span className="flex-1 pt-0.5 text-sm text-slate-800">{opt.content}</span>
                {state === "correct" && <CheckIcon className="mt-1 h-5 w-5 text-emerald-500" />}
                {state === "wrong" && <XIcon className="mt-1 h-5 w-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {isRevealed && (
          <div className="mt-5 animate-in">
            <div
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold",
                picked === correctKey
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700",
              )}
            >
              {picked === correctKey ? "✓ Jawaban benar!" : `✗ Kurang tepat. Jawaban benar: ${correctKey}`}
            </div>
            {q.explanation && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Pembahasan
                </p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {q.explanation}
                </p>
              </div>
            )}
            {q.source && (
              <p className="mt-2 text-xs text-slate-400">Sumber: {q.source}</p>
            )}
          </div>
        )}
      </article>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          ← Sebelumnya
        </Button>

        {isLast ? (
          <Button onClick={() => setFinished(true)} disabled={!isRevealed}>
            Selesai &amp; Lihat Skor
          </Button>
        ) : (
          <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
            Selanjutnya →
          </Button>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Progress header -------------------------- */

function ProgressHeader({
  current,
  total,
  answered,
}: {
  current: number;
  total: number;
  answered: number;
}) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-900">
          Soal {current + 1} <span className="text-slate-400">/ {total}</span>
        </span>
        <span className="text-slate-500">{answered} terjawab</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------ Results ------------------------------- */

function ResultsScreen({
  questions,
  answers,
  score,
  onRetry,
}: {
  questions: Question[];
  answers: Record<number, string>;
  score: number;
  onRetry: () => void;
}) {
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const { title, note, tone } = grade(pct);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm animate-in">
        <div className="bg-gradient-to-br from-brand-600 to-violet-700 px-6 py-10 text-white">
          <p className="text-sm font-medium text-brand-100">Sesi selesai!</p>
          <div className="mx-auto mt-4 grid h-32 w-32 place-items-center rounded-full bg-white/15 backdrop-blur">
            <div>
              <div className="text-4xl font-extrabold">{pct}%</div>
              <div className="text-xs text-brand-100">
                {score} / {total} benar
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold">{title}</h2>
          <p className={cn("mt-1 text-sm", tone)}>{note}</p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100">
          <Stat label="Benar" value={score} valueClass="text-emerald-600" />
          <Stat label="Salah" value={total - score} valueClass="text-red-600" />
          <Stat label="Total" value={total} valueClass="text-slate-900" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRetry} size="lg" className="w-full">
          Ulangi Sesi Baru
        </Button>
        <ButtonLink href="/dashboard" variant="outline" size="lg" className="w-full">
          Kembali ke Dashboard
        </ButtonLink>
      </div>

      {/* Review */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Tinjau Jawaban</h3>
        <div className="mt-4 space-y-3">
          {questions.map((q, i) => {
            const picked = answers[q.id];
            const correctKey = q.options.find((o) => o.isCorrect)?.optionKey;
            const isCorrect = picked === correctKey;
            return (
              <details
                key={q.id}
                className="group rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-start gap-3 list-none">
                  <span
                    className={cn(
                      "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white",
                      isCorrect ? "bg-emerald-500" : "bg-red-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-700 line-clamp-2 group-open:line-clamp-none">
                    {q.content}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold",
                      isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                    )}
                  >
                    {isCorrect ? "Benar" : "Salah"}
                  </span>
                </summary>
                <div className="mt-3 space-y-1.5 pl-9 text-sm">
                  <p className="text-slate-500">
                    Jawabanmu:{" "}
                    <span className={isCorrect ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                      {picked ?? "—"}
                    </span>{" "}
                    · Kunci: <span className="font-semibold text-emerald-600">{correctKey}</span>
                  </p>
                  {q.explanation && (
                    <p className="rounded-lg bg-slate-50 p-3 text-slate-600">{q.explanation}</p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: number; valueClass: string }) {
  return (
    <div className="px-2 py-5">
      <div className={cn("text-2xl font-bold", valueClass)}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function grade(pct: number): { title: string; note: string; tone: string } {
  if (pct >= 80)
    return { title: "Luar biasa! 🎉", note: "Pertahankan momentum ini.", tone: "text-emerald-200" };
  if (pct >= 60)
    return { title: "Kerja bagus! 👏", note: "Sedikit lagi menuju sempurna.", tone: "text-brand-100" };
  if (pct >= 40)
    return { title: "Terus berlatih! 💪", note: "Tinjau pembahasan dan coba lagi.", tone: "text-amber-100" };
  return { title: "Jangan menyerah! 🌱", note: "Setiap latihan membuatmu lebih kuat.", tone: "text-amber-100" };
}

/* ------------------------------- States ------------------------------- */

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="rounded-2xl border border-slate-200 bg-white p-7">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
        <div className="mt-5 space-y-2.5">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-slate-400">Menyiapkan soal untukmu…</p>
    </div>
  );
}

function MessageState({ kind, onRetry }: { kind: "error" | "empty"; onRetry: () => void }) {
  const copy =
    kind === "error"
      ? {
          title: "Gagal memuat soal",
          body: "Server soal sedang tidak dapat dihubungi. Coba lagi sebentar.",
        }
      : {
          title: "Tidak ada soal yang cocok",
          body: "Belum ada soal untuk kombinasi materi & kesulitan ini. Coba ubah pilihanmu.",
        };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-400">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{copy.title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">{copy.body}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={onRetry}>Coba Lagi</Button>
        <ButtonLink href="/dashboard" variant="outline">
          Ubah Pilihan
        </ButtonLink>
      </div>
    </div>
  );
}

/* ------------------------------- Icons -------------------------------- */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
