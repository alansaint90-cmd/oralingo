import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/features/LogoutButton";
import Link from "next/link";
import { BarChart3, Flame, Home, Mic, Sparkles, Trophy } from "lucide-react";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="app-shell app-frame">
      <nav className="app-topbar">
        <Link href="/app/dashboard" className="brand">Oralingo</Link>
        <div className="row">
          <span className="badge"><Flame size={15} /> 4 dias</span>
          <Link href="/app/treino" className="button ghost"><Mic size={18} /> Treino</Link>
          <Link href="/app/desafio-60" className="button ghost"><Trophy size={18} /> Desafio 60</Link>
          <LogoutButton />
        </div>
      </nav>
      <div className="app-grid">
        <aside className="side-nav" aria-label="Navegacao lateral">
          <Link className="side-link" href="/app/dashboard"><Home size={20} /> Inicio</Link>
          <Link className="side-link" href="/app/treino"><Mic size={20} /> Treinar</Link>
          <Link className="side-link" href="/app/desafio-60"><Trophy size={20} /> Desafio</Link>
          <Link className="side-link locked" href="/app/dashboard" aria-label="Trilhas em breve"><Sparkles size={20} /> Trilhas</Link>
          <Link className="side-link locked" href="/app/dashboard" aria-label="Evolucao em breve"><BarChart3 size={20} /> Evolucao</Link>
        </aside>
        <div>{children}</div>
      </div>
      <nav className="bottom-nav" aria-label="Navegacao principal">
        <Link href="/app/dashboard"><Home size={20} /> Inicio</Link>
        <Link href="/app/treino"><Mic size={20} /> Treino</Link>
        <Link href="/app/desafio-60"><Trophy size={20} /> Desafio</Link>
        <Link href="/app/dashboard"><Sparkles size={20} /> Trilhas</Link>
      </nav>
    </main>
  );
}
