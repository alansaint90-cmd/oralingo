import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { demoUser, demoUserId } from "@/lib/demo/data";

export async function GET(request: Request) {
  await createSession({
    userId: demoUserId,
    email: demoUser.email,
    name: demoUser.name,
    role: "user"
  });

  return NextResponse.redirect(new URL("/app/dashboard", request.url));
}
