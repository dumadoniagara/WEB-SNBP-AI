import { NextRequest, NextResponse } from "next/server";
import { login, BackendError } from "@/lib/api";
import { setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ message: "Email dan kata sandi wajib diisi." }, { status: 400 });
  }

  try {
    const { accessToken } = await login(email, password);
    await setSession(accessToken);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof BackendError && err.status === 401) {
      return NextResponse.json({ message: "Email atau kata sandi salah." }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Tidak dapat terhubung ke server. Coba lagi nanti." },
      { status: 502 },
    );
  }
}
