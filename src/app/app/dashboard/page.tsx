import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/services/queries";
import { BookOpen, Flame, Lock, Mic, ShieldCheck, Sparkles, Star, Trophy, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const { user, profile, progress } = await getDashboardData(session.userId);
  if (!user?.onboardingCompleted) redirect("/app/onboarding");

  const skills = [
    ["Clareza", progress?.clarityScore ?? 0],
    ["Objetividade", progress?.objectivityScore ?? 0],
    ["Estrutura", progress?.structureScore ?? 0],
    ["Persuasao", progress?.persuasionScore ?? 0],
    ["Confianca percebida", progress?.perceivedConfidenceScore ?? 0]
  ];
  const currentScore = Math.min(100, profile?.currentScore ?? 0);
  const currentLevel = Math.max(1, Math.min(5, Math.floor(currentScore / 20) + 1));
  const nextLevel = Math.min(5, currentLevel + 1);

  return (
    <section className="stack-lg">
      <div className="panel stack dashboard-hero-panel">
        <div className="spread">
          <div>
            <span className="eyebrow"><Flame size={15} /> Sequencia: {progress?.streakDays ?? 0} dias</span>
            <h1 className="page-title compact">Ola, {user.name}. Sua missao esta pronta.</h1>
            <p className="lead profile-level-name">{profile?.currentProfileName ?? "Comunicador em evolucao"}</p>
          </div>
          <Link className="button" href="/app/treino"><Zap size={18} /> Treinar agora</Link>
        </div>
        <div className="level-progress" aria-label={`Progresso: ${currentScore} de 100 pontos. Proximo nivel: ${nextLevel}.`}>
          <div className="level-progress-track">
            <span style={{ width: `${currentScore}%` }} />
            <div className="level-marker current" style={{ left: `clamp(19px, ${currentScore}%, calc(100% - 19px))` }} title={`Nivel ${currentLevel}: ${currentScore}/100`}>
              <Star size={16} />
            </div>
            <div className="level-marker next" title={`Proximo nivel ${nextLevel}`}>
              <Trophy size={16} />
            </div>
          </div>
          <div className="level-progress-labels">
            <strong>Nivel {currentLevel}</strong>
            <span>{currentScore}/100 XP</span>
            <strong>Proximo nivel {nextLevel}</strong>
          </div>
        </div>
      </div>
      <div className="metric-grid">
        <div className="card"><span className="muted">Nota atual</span><h2 className="big-number">{profile?.currentScore ?? 0}</h2></div>
        <div className="card"><span className="muted">Treinos</span><h2 className="big-number">{progress?.totalTrainings ?? 0}</h2></div>
        <div className="card"><span className="muted">Melhor nota</span><h2 className="big-number">{progress?.bestScore ?? 0}</h2></div>
        <div className="card"><span className="muted">XP estimado</span><h2 className="big-number">{(progress?.totalTrainings ?? 0) * 90 + (profile?.currentScore ?? 0)}</h2></div>
      </div>
      <div className="mission-path">
        <Link className="lesson-card" href="/app/diagnostico"><ShieldCheck size={28} color="var(--blue)" /><strong>Diagnostico</strong><p className="muted">Mapa inicial da sua comunicacao.</p></Link>
        <Link className="lesson-card" href="/app/treino"><Mic size={28} color="var(--brand-dark)" /><strong>Treino Diario</strong><p className="muted">Uma missao adaptada ao seu perfil.</p></Link>
        <Link className="lesson-card" href="/app/desafio-60"><Trophy size={28} color="var(--yellow)" /><strong>Desafio 60</strong><p className="muted">Repita e compare sua evolucao.</p></Link>
      </div>
      <div className="grid-2">
        <div className="panel stack">
          <div className="spread"><h2>Habilidades</h2><span className="badge"><Star size={14} /> Nivel 4</span></div>
          {skills.map(([label, value]) => <div className="stack" key={label}><div className="spread"><span>{label}</span><strong>{value}</strong></div><div className="skill-bar"><span style={{ width: `${value}%` }} /></div></div>)}
        </div>
        <div className="panel stack">
          <div className="spread"><h2>Novas areas</h2><span className="badge"><Sparkles size={14} /> Em breve</span></div>
          <div className="lesson-card locked"><BookOpen size={24} /><strong>Trilhas por objetivo</strong><p className="muted">Publico, vendas, videos, reunioes e entrevistas.</p></div>
          <div className="lesson-card locked"><Lock size={24} /><strong>Conquistas e ligas</strong><p className="muted">Espaco reservado para badges, ranking privado e desafios semanais.</p></div>
        </div>
      </div>
    </section>
  );
}
