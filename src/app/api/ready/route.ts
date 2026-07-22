import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query("select 1");
    return NextResponse.json({
      ok: true,
      service: "oralingo",
      database: "ready",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      service: "oralingo",
      database: "unavailable",
      message: error instanceof Error ? error.message : "Database unavailable",
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
