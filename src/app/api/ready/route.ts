import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function databaseErrorMessage(error: unknown) {
  if (error instanceof AggregateError) {
    const firstError = error.errors.find((item) => item instanceof Error) as Error | undefined;
    return firstError?.message || firstError?.name || "Database unavailable";
  }

  if (error instanceof Error) return error.message || error.name;
  return "Database unavailable";
}

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
      message: databaseErrorMessage(error),
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
