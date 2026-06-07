import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan latihan soal UTBK-mu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Daftar gratis
          </Link>
        </>
      }
    >
      <Suspense fallback={<FormSkeleton />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}
