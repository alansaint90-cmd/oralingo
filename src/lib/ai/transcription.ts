const supportedAudioTypes = new Map([
  ["audio/webm", "webm"],
  ["audio/mp4", "mp4"],
  ["audio/mpeg", "mp3"],
  ["audio/wav", "wav"],
  ["audio/ogg", "ogg"]
]);

function parseAudioDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(audio\/[a-z0-9.+-]+)(?:;[^,]+)?,(.+)$/i);
  if (!match) throw new Error("Audio invalido para transcricao");

  const contentType = match[1].toLowerCase();
  const extension = supportedAudioTypes.get(contentType);
  if (!extension) throw new Error("Formato de audio nao suportado para transcricao");

  return {
    contentType,
    extension,
    buffer: Buffer.from(match[2], "base64")
  };
}

async function transcribeWithOpenAi(audioDataUrl: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const audio = parseAudioDataUrl(audioDataUrl);
  const form = new FormData();
  form.append("file", new Blob([audio.buffer], { type: audio.contentType }), `attempt.${audio.extension}`);
  form.append("model", process.env.OPENAI_TRANSCRIPTION_MODEL ?? "gpt-4o-mini-transcribe");
  form.append("language", "pt");
  form.append("prompt", "Transcreva uma fala em portugues brasileiro de treino de oratoria, mantendo pontuacao natural.");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: form
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { text?: string };
  return data.text?.trim() || null;
}

export async function transcribeAttemptAudio(input: { audioDataUrl?: string; browserTranscript?: string }) {
  const browserTranscript = input.browserTranscript?.trim() ?? "";
  const aiTranscript = input.audioDataUrl ? await transcribeWithOpenAi(input.audioDataUrl) : null;
  const transcript = aiTranscript ?? browserTranscript;

  if (transcript.length < 10) {
    throw new Error("Nao conseguimos transcrever o audio. Digite o que voce falou no campo de transcricao e tente novamente.");
  }

  return transcript;
}
