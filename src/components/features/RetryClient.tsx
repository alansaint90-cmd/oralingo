"use client";

import { useState } from "react";
import { PracticeClient } from "./PracticeClient";

type Challenge = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  primarySkill: string;
  preparationTime: number;
  speakingTime: number;
};

export function RetryClient({ challenge, sessionId, nextAttempt }: { challenge: Challenge; sessionId: string; nextAttempt: number }) {
  const [retry, setRetry] = useState(false);
  if (retry) return <PracticeClient challenge={challenge} type="challenge_60" sessionId={sessionId} attemptNumber={nextAttempt} />;
  return <div className="panel stack"><span className="eyebrow">Segunda tentativa</span><strong>Desbloqueie sua evolucao</strong><p className="muted">Use a orientacao acima, mantenha o mesmo tema e fale novamente com o mesmo tempo.</p><button className="button" onClick={() => setRetry(true)}>Tentar novamente</button></div>;
}
