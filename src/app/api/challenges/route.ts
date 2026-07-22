import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { getSession, hasRole } from "@/lib/auth/session";
import { challengeSchema } from "@/lib/validators/attempts";
import { z } from "zod";

export async function GET() {
  const rows = await db.select().from(challenges).where(and(eq(challenges.active, true), eq(challenges.isDeleted, false))).orderBy(desc(challenges.createdAt));
  return NextResponse.json({ ok: true, challenges: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!hasRole(session, ["admin", "super_admin"])) return NextResponse.json({ ok: false, message: "Sem permissao" }, { status: 403 });
  const input = challengeSchema.parse(await request.json());
  const [created] = await db.insert(challenges).values({ ...input, modifiedBy: session!.userId }).returning();
  return NextResponse.json({ ok: true, challenge: created });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!hasRole(session, ["admin", "super_admin"])) return NextResponse.json({ ok: false, message: "Sem permissao" }, { status: 403 });

  const input = challengeSchema.partial().extend({
    id: z.string().uuid()
  }).parse(await request.json());

  const { id, ...data } = input;
  const [updated] = await db.update(challenges).set({
    ...data,
    updatedAt: new Date(),
    modifiedBy: session!.userId
  }).where(and(eq(challenges.id, id), eq(challenges.isDeleted, false))).returning();

  if (!updated) return NextResponse.json({ ok: false, message: "Desafio nao encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, challenge: updated });
}
