import Link from "next/link";
import { BookOpen, Eye, Flame, Mic, Star, TrendingUp, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="shell">
      <nav className="topbar">
        <div className="brand">Oralingo</div>
        <div className="row">
          <Link className="button ghost" href="/login">Entrar</Link>
          <Link className="button secondary" href="/api/auth/demo">Acessar demo</Link>
          <Link className="button" href="/cadastro">Comecar</Link>
        </div>
      </nav>
      <section className="hero">
        <div className="stack">
          <span className="eyebrow"><Flame size={15} /> Treino diario gamificado</span>
          <h1>Suba de nivel falando melhor.</h1>
          <p className="lead">Pratique em missoes curtas, ganhe XP de comunicacao e compare sua evolucao a cada tentativa.</p>
          <div className="row">
            <Link className="button" href="/cadastro"><Mic size={18} /> Iniciar diagnostico</Link>
            <Link className="button secondary" href="/api/auth/demo"><Eye size={18} /> Acessar demo</Link>
            <Link className="button secondary" href="/login">Ja tenho conta</Link>
          </div>
          <div className="metric-grid">
            <div className="card"><Zap /> <strong>60s</strong><p className="muted">missoes rapidas</p></div>
            <div className="card"><Star /> <strong>XP</strong><p className="muted">progresso visivel</p></div>
            <div className="card"><TrendingUp /> <strong>evolucao</strong><p className="muted">antes e depois</p></div>
            <div className="card"><BookOpen /> <strong>trilhas</strong><p className="muted">espaco para novos modulos</p></div>
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
            <Link className="button" href="/api/auth/demo">Continuar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
