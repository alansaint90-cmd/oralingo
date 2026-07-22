import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedPrefixes = ["data:audio/webm", "data:audio/mp4", "data:audio/mpeg", "data:audio/wav", "data:audio/ogg"];

export async function storeAudioDataUrl(userId: string, dataUrl?: string) {
  if (!dataUrl) return null;
  if (!allowedPrefixes.some((prefix) => dataUrl.startsWith(prefix))) {
    throw new Error("Tipo de audio invalido");
  }

  const [header, base64] = dataUrl.split(",");
  if (!base64 || base64.length > 10_000_000) throw new Error("Audio invalido ou muito grande");

  const extension = header.includes("webm") ? "webm" : header.includes("wav") ? "wav" : header.includes("mpeg") ? "mp3" : "ogg";
  const dir = path.join(process.cwd(), "uploads", userId);
  await mkdir(dir, { recursive: true });
  const filename = `${crypto.randomUUID()}.${extension}`;
  await writeFile(path.join(dir, filename), Buffer.from(base64, "base64"));
  return `/api/audio/${userId}/${filename}`;
}
