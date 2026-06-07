import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 group", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 3 4 7v5c0 4.4 3.2 7.6 8 9 4.8-1.4 8-4.6 8-9V7l-8-4Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="m8.5 12 2.5 2.5 4.5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">
        SNBP<span className="text-brand-600">·AI</span>
      </span>
    </Link>
  );
}
