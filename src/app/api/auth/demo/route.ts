import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { demoUser, demoUserId } from "@/lib/demo/data";
import { z } from "zod";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/demo", request.url));
}

export async function POST(request: Request) {
  const input = z.object({
    name: z.string().trim().min(2).max(40).regex(/^[\p{L}\p{M}\s'.-]+$/u, "Nome invalido")
  }).parse(await request.json());

  await createSession({
    userId: demoUserId,
    email: demoUser.email,
    name: input.name,
    role: "user"
  });

  return NextResponse.json({ ok: true, redirectTo: "/app/dashboard" });
}
