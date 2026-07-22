"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { key: "mainGoal", title: "Qual e o seu principal objetivo?", max: 1, options: ["Falar melhor em publico.", "Melhorar minha comunicacao profissional.", "Vender e persuadir melhor.", "Gravar videos e produzir conteudo.", "Participar melhor de reunioes.", "Melhorar minha comunicacao de forma geral."] },
  { key: "difficulties", title: "Qual e sua maior dificuldade atualmente?", max: 2, options: ["Nervosismo ao falar.", "Nao consigo organizar minhas ideias.", "Falo rapido demais.", "Tenho muitos vicios de linguagem.", "Tenho dificuldade para ser objetivo.", "Tenho dificuldade para convencer as pessoas.", "Nao tenho confianca ao falar."] },
  { key: "communicationLevel", title: "Como voce avalia sua comunicacao hoje?", max: 1, options: ["Iniciante.", "Intermediaria.", "Boa.", "Avancada."] },
  { key: "communicationContexts", title: "Onde voce mais precisa se comunicar melhor?", max: 8, options: ["Apresentacoes.", "Reunioes.", "Vendas.", "Entrevistas.", "Redes sociais e videos.", "Conversas profissionais.", "Palestras.", "Comunicacao cotidiana."] }
] as const;

type Answers = { mainGoal?: string; difficulties: string[]; communicationLevel?: string; communicationContexts: string[] };

export function OnboardingFlow() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ difficulties: [], communicationContexts: [] });
  const [loading, setLoading] = useState(false);
  const step = steps[index];

  function toggle(option: string) {
    if (step.max === 1) {
      setAnswers((current) => ({ ...current, [step.key]: option }));
      return;
    }
    const key = step.key as "difficulties" | "communicationContexts";
    setAnswers((current) => {
      const exists = current[key].includes(option);
      const next = exists ? current[key].filter((item) => item !== option) : current[key].length < step.max ? [...current[key], option] : current[key];
      return { ...current, [key]: next };
    });
  }

  async function next() {
    if (index < steps.length - 1) return setIndex(index + 1);
    setLoading(true);
    const response = await fetch("/api/onboarding", { method: "POST", body: JSON.stringify(answers) });
    const data = await response.json();
    setLoading(false);
    if (response.ok) router.push(data.redirectTo);
  }

  const selected = step.max === 1 ? answers[step.key as "mainGoal" | "communicationLevel"] : answers[step.key as "difficulties" | "communicationContexts"];
  const canContinue = Array.isArray(selected) ? selected.length > 0 : !!selected;

  return (
    <section className="grid-2">
      <div className="stack">
        <span className="eyebrow">Mapa de nivel</span>
        <h1 className="page-title compact">{step.title}</h1>
        <p className="lead">Etapa {index + 1} de {steps.length}. Uma pergunta por vez para montar seu diagnostico inicial.</p>
        <div className="xp-bar"><span style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div>
      </div>
      <div className="panel stack">
        {step.options.map((option) => {
          const active = Array.isArray(selected) ? selected.includes(option) : selected === option;
          return <button className={`choice ${active ? "active" : ""}`} key={option} onClick={() => toggle(option)}>{option}</button>;
        })}
        <button className="button" disabled={!canContinue || loading} onClick={next}>{index === steps.length - 1 ? "Desbloquear diagnostico" : "Continuar"}</button>
      </div>
    </section>
  );
}
