import { spawn } from "node:child_process";
import { bootstrapDatabase } from "./backend/bootstrap-db.mjs";

await bootstrapDatabase();

const server = spawn("node", ["server.js"], {
  stdio: "inherit",
  env: process.env
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
