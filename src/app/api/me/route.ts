import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/services/queries";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ ok: false, message: "Nao autenticado" }, { status: 401 });
  }

  const data = await getDashboardData(session.userId);
  return NextResponse.json({ ok: true, session, ...data });
}
