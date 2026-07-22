import { NextResponse } from "next/server";
import { recoverSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  recoverSchema.parse(await request.json());
  return NextResponse.json({
    ok: true,
    message: "Se o e-mail existir, enviaremos instrucoes de recuperacao quando o provedor estiver configurado."
  });
}
