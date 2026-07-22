import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { loginSchema } from "@/lib/validators/auth";
import { createSession } from "@/lib/auth/session";
import { trackEvent } from "@/lib/analytics/events";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const [user] = await db.select().from(users).where(and(eq(users.email, input.email), eq(users.isDeleted, false))).limit(1);
    if (!user) throw new Error("Credenciais invalidas");

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) throw new Error("Credenciais invalidas");

    await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
    await trackEvent(user.id, "usuario_retornou_para_treinar");

    return NextResponse.json({ ok: true, redirectTo: user.onboardingCompleted ? "/app/dashboard" : "/app/onboarding" });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Falha no login" }, { status: 401 });
  }
}
