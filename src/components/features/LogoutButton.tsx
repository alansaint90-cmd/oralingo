"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return <button className="button ghost" onClick={async () => { const res = await fetch("/api/auth/logout", { method: "POST" }); const data = await res.json(); router.push(data.redirectTo); }}><LogOut size={18} /> Sair</button>;
}
