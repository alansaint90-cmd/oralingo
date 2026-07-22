import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userProgress, users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validators/auth";
import { createSession } from "@/lib/auth/session";
import { trackEvent } from "@/lib/analytics/events";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(input.password, 12);
    const [user] = await db.insert(users).values({
      name: input.name,
      email: input.email,
      passwordHash
    }).returning();

    await db.update(users).set({ modifiedBy: user.id }).where(eq(users.id, user.id));
    await db.insert(userProgress).values({ userId: user.id, modifiedBy: user.id });
    await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
    await trackEvent(user.id, "usuario_cadastrado");

    return NextResponse.json({ ok: true, redirectTo: "/app/onboarding" });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Falha no cadastro" }, { status: 400 });
  }
}
