"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" | "recover" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const payload = Object.fromEntries(formData);
    const path = mode === "register" ? "/api/auth/register" : mode === "recover" ? "/api/auth/recover" : "/api/auth/login";
    const response = await fetch(path, { method: "POST", body: JSON.stringify(payload) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.message ?? "Nao foi possivel continuar");
    if (data.redirectTo) router.push(data.redirectTo);
    else setMessage(data.message);
  }

  return (
    <form className="panel stack" action={submit}>
      <span className="eyebrow">{mode === "login" ? "Voltar ao treino" : mode === "recover" ? "Recuperar acesso" : "Criar perfil"}</span>
      {mode === "register" && <input className="input" name="name" placeholder="Seu nome" required />}
      <input className="input" name="email" type="email" placeholder="E-mail" required />
      {mode !== "recover" && <input className="input" name="password" type="password" placeholder="Senha" minLength={8} required />}
      <button className="button" disabled={loading}>{loading ? "Processando..." : mode === "login" ? "Entrar" : mode === "recover" ? "Enviar instrucoes" : "Criar conta"}</button>
      {message && <p className="muted">{message}</p>}
    </form>
  );
}
