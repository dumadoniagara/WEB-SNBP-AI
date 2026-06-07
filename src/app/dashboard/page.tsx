import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { DrillSetup } from "@/components/drill/DrillSetup";
import { getSessionUser, getToken } from "@/lib/auth";
import { getTopics } from "@/lib/api";
import type { Topic } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const token = await getToken();
  if (!user || !token) redirect("/login");

  let topics: Topic[] = [];
  let loadError = false;
  try {
    topics = await getTopics();
  } catch {
    loadError = true;
  }

  return (
    <>
      <AppHeader email={user.email} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="animate-in">
          <p className="text-sm font-medium text-brand-600">Halo, siap latihan? 👋</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Susun sesi drilling-mu
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Pilih materi, tingkat kesulitan, dan jumlah soal. Setiap sesi
            menyajikan soal acak lengkap dengan pembahasan.
          </p>
        </div>

        <div className="mt-10">
          {loadError ? (
            <ErrorState />
          ) : topics.length === 0 ? (
            <EmptyState />
          ) : (
            <DrillSetup topics={topics} />
          )}
        </div>
      </main>
    </>
  );
}

function ErrorState() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-amber-900">Tidak dapat memuat materi</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-amber-700">
        Server soal sedang tidak dapat dihubungi. Pastikan backend SNBP-AI
        berjalan, lalu muat ulang halaman ini.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">Belum ada materi</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        Bank soal masih kosong. Hubungi admin untuk menambahkan soal terlebih
        dahulu.
      </p>
    </div>
  );
}
