"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DemoNameForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/demo", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message ?? "Digite um nome valido para continuar.");
      return;
    }

    router.push(data.redirectTo);
  }

  return (
    <form className="panel stack" onSubmit={submit}>
      <span className="eyebrow">Entrada rapida</span>
      <label className="stack">
        <strong>Seu nome</strong>
        <input
          className="input"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          maxLength={40}
          placeholder="Ex: Allan"
          required
          autoFocus
        />
      </label>
      <button className="button" disabled={loading}>{loading ? "Entrando..." : "Acessar painel demo"}</button>
      {message && <p className="muted" role="alert">{message}</p>}
    </form>
  );
}
