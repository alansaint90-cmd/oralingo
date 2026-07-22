import { redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth/session";
import { getAdminStats } from "@/lib/services/queries";
import { AdminChallengeForm } from "@/components/features/AdminChallengeForm";
import { BrandName } from "@/components/ui/BrandName";

export default async function AdminPage() {
  const session = await getSession();
  if (!hasRole(session, ["admin", "super_admin"])) redirect("/app/dashboard");
  const stats = await getAdminStats();

  return (
    <main className="shell app-frame stack-lg">
      <div className="topbar"><div className="brand"><BrandName suffix="Admin" /></div></div>
      <div className="metric-grid">
        <div className="card"><span>Usuarios</span><h2 className="big-number">{stats.users}</h2></div>
        <div className="card"><span>Treinos</span><h2 className="big-number">{stats.sessions}</h2></div>
        <div className="card"><span>Tentativas</span><h2 className="big-number">{stats.attempts}</h2></div>
      </div>
      <AdminChallengeForm />
      <div className="panel">
        <table className="table">
          <thead><tr><th>Desafio</th><th>Habilidade</th><th>Status</th></tr></thead>
          <tbody>{stats.challenges.map((challenge) => <tr key={challenge.id}><td>{challenge.title}</td><td>{challenge.primarySkill}</td><td>{challenge.active ? "Ativo" : "Inativo"}</td></tr>)}</tbody>
        </table>
      </div>
    </main>
  );
}
