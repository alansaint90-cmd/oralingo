"use client";

import { useState } from "react";

export function AdminChallengeForm() {
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    const payload = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      instructions: String(formData.get("instructions")),
      category: String(formData.get("category")),
      primarySkill: String(formData.get("primarySkill")),
      difficulty: String(formData.get("difficulty")),
      preparationTime: Number(formData.get("preparationTime")),
      speakingTime: Number(formData.get("speakingTime")),
      active: formData.get("active") === "on"
    };
    const response = await fetch("/api/challenges", { method: "POST", body: JSON.stringify(payload) });
    setMessage(response.ok ? "Desafio criado." : "Nao foi possivel criar o desafio.");
  }

  return (
    <form className="panel stack" action={submit}>
      <h2>Novo desafio</h2>
      <input className="input" name="title" placeholder="Titulo" required />
      <input className="input" name="description" placeholder="Contexto" required />
      <input className="input" name="instructions" placeholder="Instrucao" required />
      <div className="grid-2">
        <input className="input" name="category" placeholder="Categoria" required />
        <input className="input" name="primarySkill" placeholder="Habilidade principal" required />
        <input className="input" name="difficulty" placeholder="Nivel" required />
        <input className="input" name="preparationTime" type="number" defaultValue={30} required />
        <input className="input" name="speakingTime" type="number" defaultValue={60} required />
      </div>
      <label className="row"><input name="active" type="checkbox" defaultChecked /> Ativo</label>
      <button className="button">Criar desafio</button>
      {message && <p className="muted">{message}</p>}
    </form>
  );
}
