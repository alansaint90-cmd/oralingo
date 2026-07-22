"use client";

import { Mic, Pause, Play, RotateCcw, Send, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RecorderState = "ready" | "recording" | "paused" | "finished" | "sending" | "error";

type Props = {
  sessionId: string;
  attemptNumber: number;
  maxSeconds: number;
  autoStop?: boolean;
  onResult: (result: unknown) => void;
};

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
};

export function AudioRecorder({ sessionId, attemptNumber, maxSeconds, autoStop, onResult }: Props) {
  const [state, setState] = useState<RecorderState>("ready");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);

  useEffect(() => {
    if (state !== "recording") return;
    const timer = setInterval(() => {
      setSeconds((current) => {
        if (autoStop && current + 1 >= maxSeconds) {
          stop();
          return maxSeconds;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state, autoStop, maxSeconds]);

  async function start() {
    try {
      setError("");
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setState("finished");
      };
      recorder.start();
      setSeconds(0);
      setState("recording");

      const Recognition = (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
      if (Recognition) {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "pt-BR";
        recognition.onresult = (event) => {
          const text = Array.from(event.results).map((result) => result[0].transcript).join(" ");
          setTranscript(text);
        };
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch {
      setState("error");
      setError("Microfone bloqueado ou indisponivel.");
    }
  }

  function pause() {
    mediaRef.current?.pause();
    setState("paused");
  }

  function resume() {
    mediaRef.current?.resume();
    setState("recording");
  }

  function stop() {
    recognitionRef.current?.stop();
    mediaRef.current?.stop();
  }

  function reset() {
    setState("ready");
    setSeconds(0);
    setAudioUrl("");
    setTranscript("");
    setError("");
    chunksRef.current = [];
  }

  async function submit() {
    if (seconds < 5) return setError("A gravacao precisa ter pelo menos 5 segundos.");
    if (!transcript.trim()) return setError("Nao conseguimos transcrever. Digite abaixo o que voce falou para enviar a analise.");
    setState("sending");
    const blob = chunksRef.current.length ? new Blob(chunksRef.current, { type: "audio/webm" }) : null;
    const audioDataUrl = blob ? await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    }) : undefined;
    const response = await fetch("/api/attempts", {
      method: "POST",
      body: JSON.stringify({ sessionId, attemptNumber, durationSeconds: seconds, transcript, audioDataUrl })
    });
    const data = await response.json();
    if (!response.ok) {
      setState("error");
      setError(data.message ?? "Falha na analise.");
      return;
    }
    onResult(data);
  }

  return (
    <div className="recorder panel">
      <div className="spread">
        <div className="stack">
          <span className="eyebrow">{state === "recording" ? "Ao vivo" : state === "sending" ? "IA analisando" : "Estudio de fala"}</span>
          <strong>{state === "recording" ? "Gravando sua tentativa" : state === "sending" ? "Gerando feedback" : "Prepare sua resposta"}</strong>
        </div>
        <span className="badge">{seconds}s / {maxSeconds}s</span>
      </div>
      <div className="xp-bar"><span style={{ width: `${Math.min(100, (seconds / maxSeconds) * 100)}%` }} /></div>
      <div className="pulse" aria-hidden="true" />
      {audioUrl && <audio controls src={audioUrl} />}
      <textarea className="input" rows={5} value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="A transcricao aparece aqui. Se o navegador nao transcrever automaticamente, digite sua fala para receber a analise." />
      <div className="row">
        {state === "ready" && <button className="button" onClick={start}><Mic size={18} /> Gravar</button>}
        {state === "recording" && <button className="button ghost" onClick={pause}><Pause size={18} /> Pausar</button>}
        {state === "paused" && <button className="button" onClick={resume}><Play size={18} /> Continuar</button>}
        {(state === "recording" || state === "paused") && <button className="button secondary" onClick={stop}><Square size={18} /> Encerrar</button>}
        {state === "finished" && <button className="button ghost" onClick={reset}><RotateCcw size={18} /> Gravar novamente</button>}
        {state === "finished" && <button className="button" onClick={submit}><Send size={18} /> Enviar para analise</button>}
      </div>
      {error && <p className="muted">{error}</p>}
      {state === "sending" && <p className="muted">Transcrevendo, calculando XP e preparando seu feedback...</p>}
    </div>
  );
}
