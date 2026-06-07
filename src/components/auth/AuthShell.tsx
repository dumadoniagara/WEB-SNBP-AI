import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-4 py-8 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-600">
            ← Kembali
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm animate-in">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
          </div>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 lg:block">
        <div className="bg-dots absolute inset-0 opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div />
          <div className="max-w-md">
            <blockquote className="text-2xl font-semibold leading-snug">
              “Latihan yang konsisten hari ini adalah kursi PTN-mu besok.”
            </blockquote>
            <p className="mt-6 text-brand-100">
              Drilling soal UTBK kapan saja, dengan pembahasan instan di setiap
              langkah.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "TPS", l: "Potensi Skolastik" },
                { v: "Literasi", l: "Bahasa & Matematika" },
                { v: "24/7", l: "Akses penuh" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-lg font-bold">{s.v}</div>
                  <div className="mt-0.5 text-xs text-brand-100">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-brand-200">© {new Date().getFullYear()} SNBP·AI</p>
        </div>
      </div>
    </div>
  );
}
