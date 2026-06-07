import { ButtonLink } from "@/components/ui/Button";
import { Navbar, Footer } from "@/components/landing/Navbar";
import { Aurora } from "@/components/landing/Aurora";
import { HeroContent, HeroPreview } from "@/components/landing/HeroContent";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { getTopics } from "@/lib/api";
import type { Topic } from "@/lib/types";

// Landing content depends on the live question catalog, so render dynamically.
export const dynamic = "force-dynamic";

const FALLBACK_TOPICS: Pick<Topic, "name" | "code" | "description" | "subTests">[] = [
  {
    name: "TPS",
    code: "TPS",
    description: "Tes Potensi Skolastik",
    subTests: [
      { name: "Penalaran Umum" },
      { name: "Pengetahuan Kuantitatif" },
      { name: "Pemahaman Bacaan & Menulis" },
      { name: "Pengetahuan & Pemahaman Umum" },
    ] as Topic["subTests"],
  },
  {
    name: "Tes Literasi",
    code: "LITERASI",
    description: "Literasi & Penalaran Matematika",
    subTests: [
      { name: "Literasi Bahasa Indonesia" },
      { name: "Literasi Bahasa Inggris" },
      { name: "Penalaran Matematika" },
    ] as Topic["subTests"],
  },
];

export default async function LandingPage() {
  let topics = FALLBACK_TOPICS as Topic[];
  try {
    const live = await getTopics();
    if (live?.length) topics = live;
  } catch {
    // Backend offline — fall back to the static showcase.
  }

  const subtestCount = topics.reduce((n, t) => n + (t.subTests?.length ?? 0), 0);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats subtestCount={subtestCount} topicCount={topics.length} />
        <Features />
        <HowItWorks />
        <Materi topics={topics} />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Aurora />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <HeroContent />
        <HeroPreview />
      </div>
    </section>
  );
}

/* ------------------------------- Stats -------------------------------- */

function Stats({ subtestCount, topicCount }: { subtestCount: number; topicCount: number }) {
  const stats = [
    { value: topicCount, label: "Kelompok Tes" },
    { value: subtestCount, label: "Sub-tes UTBK" },
    { value: 0, fallback: "∞", label: "Soal acak setiap sesi" },
    { value: 0, fallback: "24/7", label: "Akses kapan saja" },
  ];
  return (
    <section className="border-y border-slate-200 bg-white">
      <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 sm:grid-cols-4 sm:px-6">
        {stats.map((s) => (
          <RevealItem key={s.label} className="px-2 py-8 text-center">
            <div className="text-3xl font-extrabold text-brand-600 sm:text-4xl">
              <CountUp value={s.value} fallback={s.fallback} />
            </div>
            <div className="mt-1 text-sm text-slate-500">{s.label}</div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ------------------------------ Features ------------------------------ */

const FEATURES = [
  {
    title: "Pembahasan Instan",
    desc: "Setiap soal dilengkapi pembahasan jelas agar kamu paham, bukan sekadar menghafal jawaban.",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
  {
    title: "Atur Tingkat Kesulitan",
    desc: "Mulai dari mudah hingga sulit. Sesuaikan drilling dengan kemampuan dan targetmu.",
    icon: "M3 6h18M7 12h10m-7 6h4",
  },
  {
    title: "Fokus per Sub-tes",
    desc: "Latih sub-tes yang masih lemah — Penalaran Umum, Kuantitatif, Literasi, dan lainnya.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3",
  },
  {
    title: "Soal Selalu Acak",
    desc: "Urutan dan pilihan soal diacak setiap sesi, melatih pemahaman bukan pola hafalan.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    title: "Skor & Evaluasi",
    desc: "Lihat skor di akhir sesi dan ketahui soal mana yang benar atau salah secara langsung.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Akses Multi-platform",
    desc: "Tersedia di WhatsApp dan kini di web. Latihan berlanjut, di perangkat apa pun.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
];

function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Fitur"
          title="Semua yang kamu butuhkan untuk lolos PTN"
          subtitle="Dirancang agar latihanmu efektif, terarah, dan terukur."
        />
      </Reveal>
      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <RevealItem
            key={f.title}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={f.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ----------------------------- How it works --------------------------- */

function HowItWorks() {
  const steps = [
    { n: "01", title: "Buat akun gratis", desc: "Daftar dengan email dalam hitungan detik. Tanpa biaya." },
    { n: "02", title: "Pilih materi & kesulitan", desc: "Tentukan sub-tes, jumlah soal, dan tingkat kesulitan." },
    { n: "03", title: "Drilling & pelajari", desc: "Jawab soal, lihat pembahasan instan, dan cek skormu." },
  ];
  return (
    <section id="cara-kerja" className="scroll-mt-20 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Cara Kerja"
            title="Mulai dalam tiga langkah"
            subtitle="Dari daftar sampai latihan pertama, kurang dari satu menit."
          />
        </Reveal>
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.14}>
          {steps.map((s) => (
            <RevealItem
              key={s.n}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-shadow duration-300 hover:shadow-lg"
            >
              <span className="text-5xl font-black text-brand-100">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------- Materi ------------------------------- */

function Materi({ topics }: { topics: Topic[] }) {
  return (
    <section id="materi" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Materi"
          title="Lengkap mengikuti struktur UTBK"
          subtitle="Latih setiap kelompok tes dan sub-tes sesuai kurikulum resmi."
        />
      </Reveal>
      <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.12}>
        {topics.map((topic) => (
          <RevealItem
            key={topic.code}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{topic.name}</h3>
              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                {topic.code}
              </span>
            </div>
            {topic.description && (
              <p className="mt-1 text-sm text-slate-500">{topic.description}</p>
            )}
            <ul className="mt-5 grid gap-2.5">
              {topic.subTests?.map((st, i) => (
                <li key={st.id ?? i} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-600">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {st.name}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ------------------------------ Final CTA ----------------------------- */

function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <Reveal direction="up">
        <div className="animate-gradient relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-brand-700 px-6 py-16 text-center shadow-2xl shadow-brand-900/30 sm:px-12">
          <div className="bg-dots absolute inset-0 opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Siap menaklukkan UTBK?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Gabung sekarang dan mulai latihan soal pertamamu hari ini. Gratis.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/register"
                size="lg"
                className="w-full bg-white text-brand-700 shadow-none hover:bg-brand-50 sm:w-auto"
              >
                Daftar Gratis Sekarang
              </ButtonLink>
              <ButtonLink
                href="/login"
                size="lg"
                variant="ghost"
                className="w-full text-white hover:bg-white/10 sm:w-auto"
              >
                Masuk
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ Helpers ------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
    </div>
  );
}
