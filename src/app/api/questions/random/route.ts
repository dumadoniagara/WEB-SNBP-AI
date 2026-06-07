import { NextRequest, NextResponse } from "next/server";
import { getRandomQuestions } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { Difficulty } from "@/lib/types";

/**
 * Proxy for drilling questions. Although the backend endpoint is public, we
 * gate it behind a session here so drilling stays a logged-in-only feature.
 */
export async function GET(req: NextRequest) {
  if (!(await getToken())) {
    return NextResponse.json({ message: "Tidak terautentikasi." }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const rawCount = Number(sp.get("count") ?? 10);
  const count = Math.min(Math.max(Number.isFinite(rawCount) ? rawCount : 10, 1), 50);

  const subTestIdRaw = sp.get("subTestId");
  const subTestId = subTestIdRaw ? Number(subTestIdRaw) : undefined;

  const diff = sp.get("difficulty");
  const difficulty =
    diff === "EASY" || diff === "MEDIUM" || diff === "HARD"
      ? (diff as Difficulty)
      : undefined;

  try {
    const questions = await getRandomQuestions({
      count,
      subTestId: subTestId && Number.isFinite(subTestId) ? subTestId : undefined,
      difficulty,
    });
    return NextResponse.json(questions);
  } catch {
    return NextResponse.json(
      { message: "Gagal memuat soal. Coba lagi nanti." },
      { status: 502 },
    );
  }
}
