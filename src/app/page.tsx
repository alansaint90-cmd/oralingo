import Link from "next/link";
import { BookOpen, Flame, Mic, Star, TrendingUp, Zap } from "lucide-react";
import { BrandName } from "@/components/ui/BrandName";

export default function HomePage() {
  return (
    <main className="shell">
      <nav className="topbar landing-topbar">
        <div className="brand"><BrandName /></div>
        <div className="row landing-actions">
          <Link className="button ghost" href="/login">Entrar</Link>
          <Link className="button" href="/cadastro">Cadastrar</Link>
          <Link className="button secondary" href="/demo">Acessar demo</Link>
        </div>
      </nav>
      <section className="hero">
        <div className="stack">
          <span className="eyebrow"><Flame size={15} /> Treino diario gamificado</span>
          <h1>Suba de nivel falando melhor.</h1>
          <p className="lead">Pratique em missoes curtas, ganhe XP de comunicacao e compare sua evolucao a cada tentativa.</p>
          <div className="row">
            <Link className="button" href="/cadastro"><Mic size={18} /> Iniciar diagnostico</Link>
          </div>
          <div className="metric-grid">
            <div className="card metric-card"><span><Zap /> <strong>60s</strong></span><p className="muted">missoes rapidas</p></div>
            <div className="card metric-card"><span><Star /> <strong>XP</strong></span><p className="muted">progresso visivel</p></div>
            <div className="card metric-card"><span><TrendingUp /> <strong>evolucao</strong></span><p className="muted">antes e depois</p></div>
            <div className="card metric-card"><span><BookOpen /> <strong>trilhas</strong></span><p className="muted">espaco para novos modulos</p></div>
          </div>
        </div>
        <div className="phone-preview">
          <div className="phone-screen">
            <div className="spread"><strong>Oralingo</strong><span className="badge">Nivel 4</span></div>
            <div className="phone-pill"><span /></div>
            <div className="lesson-card"><span className="eyebrow">Missao de hoje</span><strong>Venda sua ideia</strong><p>60 segundos para convencer com clareza.</p></div>
            <div className="grid-2">
              <div className="card"><strong>XP</strong><p className="big-number">740</p></div>
              <div className="card"><strong>Streak</strong><p className="big-number">4</p></div>
            </div>
            <Link className="button" href="/demo">Continuar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
