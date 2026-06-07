import { NextRequest, NextResponse } from "next/server";
import { register, login, BackendError } from "@/lib/api";
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
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Kata sandi minimal 6 karakter." },
      { status: 400 },
    );
  }

  try {
    await register(email, password);
    // Auto-login right after a successful registration for a smooth flow.
    const { accessToken } = await login(email, password);
    await setSession(accessToken);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof BackendError) {
      // 409/400 typically means the email is already taken or invalid.
      const status = err.status === 409 || err.status === 400 ? err.status : 502;
      const message =
        status === 502
          ? "Tidak dapat terhubung ke server. Coba lagi nanti."
          : err.message || "Email sudah terdaftar.";
      return NextResponse.json({ message }, { status });
    }
    return NextResponse.json(
      { message: "Tidak dapat terhubung ke server. Coba lagi nanti." },
      { status: 502 },
    );
  }
}
