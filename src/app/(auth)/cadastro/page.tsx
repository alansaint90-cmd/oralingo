import Link from "next/link";
import { AuthForm } from "@/components/features/AuthForm";

export default function RegisterPage() {
  return <main className="shell app-frame grid-2"><section className="stack"><div className="brand">Oralingo</div><span className="eyebrow">Novo jogador</span><h1 className="page-title compact">Seu treino de comunicacao comeca aqui.</h1><p className="lead">Crie seu perfil, desbloqueie o diagnostico inicial e avance em missoes curtas.</p></section><section className="stack"><AuthForm mode="register" /><Link className="button ghost" href="/api/auth/demo">Ver demo antes</Link><Link className="muted" href="/login">Ja tenho conta</Link></section></main>;
}
