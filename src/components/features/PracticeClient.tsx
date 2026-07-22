"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldCheck, Target } from "lucide-react";
import { AudioRecorder } from "./AudioRecorder";

type Challenge = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  primarySkill: string;
  preparationTime: number;
  speakingTime: number;
};

export function PracticeClient({ challenge, type, attemptNumber = 1, sessionId }: { challenge: Challenge; type: "diagnostic" | "daily" | "challenge_60"; attemptNumber?: number; sessionId?: string }) {
  const router = useRouter();

  async function startSession() {
    if (sessionId) return sessionId;
    const response = await fetch("/api/sessions", { method: "POST", body: JSON.stringify({ challengeId: challenge.id, type }) });
    const data = await response.json();
    return data.sessionId as string;
  }

  const label = type === "diagnostic" ? "Diagnostico inicial" : type === "daily" ? "Missao diaria" : "Desafio 60";

  return (
    <section className="grid-2">
      <div className="stack">
        <span className="eyebrow">{label}</span>
        <h1 className="page-title compact">{challenge.title}</h1>
        <p className="lead">{challenge.description}</p>
        <div className="lesson-card">
          <Target size={30} color="var(--brand-dark)" />
          <strong>Objetivo da missao</strong>
          <p>{challenge.instructions}</p>
          <div className="grid-2">
            <div className="card"><Clock size={20} /><strong>{challenge.speakingTime}s</strong><p className="muted">tempo de fala</p></div>
            <div className="card"><ShieldCheck size={20} /><strong>{challenge.primarySkill}</strong><p className="muted">habilidade foco</p></div>
          </div>
          <div className="xp-bar"><span style={{ width: type === "challenge_60" ? "60%" : "42%" }} /></div>
        </div>
      </div>
      <SessionRecorder
        maxSeconds={challenge.speakingTime}
        attemptNumber={attemptNumber}
        getSessionId={startSession}
        onDone={(id) => router.push(type === "challenge_60" && attemptNumber > 1 ? `/app/comparacao/${id === "demo-session" ? "demo-comparison" : id}` : `/app/resultado/${id}`)}
      />
    </section>
  );
}

function SessionRecorder({ getSessionId, maxSeconds, attemptNumber, onDone }: { getSessionId: () => Promise<string>; maxSeconds: number; attemptNumber: number; onDone: (sessionId: string) => void }) {
  const [sessionId, setSessionId] = useState("");
  const [ready, setReady] = useState(false);

  async function prepare() {
    const id = await getSessionId();
    setSessionId(id);
    setReady(true);
  }

  return ready ? (
    <AudioRecorder sessionId={sessionId} attemptNumber={attemptNumber} maxSeconds={maxSeconds} autoStop={maxSeconds === 60} onResult={() => onDone(sessionId)} />
  ) : (
    <div className="panel stack">
      <span className="eyebrow">Privacidade</span>
      <p className="lead">Seu audio sera processado apenas para gerar sua analise de comunicacao.</p>
      <button className="button" onClick={prepare}>Comecar missao</button>
    </div>
  );
}
