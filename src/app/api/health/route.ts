import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "oralingo",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
}
