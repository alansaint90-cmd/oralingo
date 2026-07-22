import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const cookieName = "oralingo_session";
const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? "dev-secret-change-me-with-32-characters");

export type AppSession = {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
};

export async function createSession(session: AppSession) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret);

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

export async function destroySession() {
  (await cookies()).delete(cookieName);
}

export async function getSession(): Promise<AppSession | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AppSession;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Nao autenticado");
  return session;
}

export function hasRole(session: AppSession | null, allowed: AppSession["role"][]) {
  return !!session && allowed.includes(session.role);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, session.userId), eq(users.isDeleted, false)))
    .limit(1);

  return user ?? null;
}
