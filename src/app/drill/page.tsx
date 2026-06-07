import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/AppHeader";
import { DrillSession } from "@/components/drill/DrillSession";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Drilling" };
export const dynamic = "force-dynamic";

export default async function DrillPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string; subTestId?: string; difficulty?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const sp = await searchParams;
  const count = Math.min(Math.max(Number(sp.count) || 10, 1), 50);

  return (
    <>
      <AppHeader email={user.email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Dashboard
        </Link>
        <div className="mt-6">
          <DrillSession count={count} subTestId={sp.subTestId} difficulty={sp.difficulty} />
        </div>
      </main>
    </>
  );
}
