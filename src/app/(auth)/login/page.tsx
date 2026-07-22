import Link from "next/link";
import { AuthForm } from "@/components/features/AuthForm";
import { Eye } from "lucide-react";

export default function LoginPage() {
  return <main className="shell app-frame grid-2"><section className="stack"><div className="brand">Oralingo</div><span className="eyebrow">Continue sua sequencia</span><h1 className="page-title compact">Entre e volte ao treino.</h1><p className="lead">Seu historico, XP e evolucao ficam salvos para a proxima tentativa.</p><Link className="button secondary" href="/api/auth/demo"><Eye size={18} /> Acessar demo</Link></section><section className="stack"><AuthForm mode="login" /><Link className="button ghost" href="/api/auth/demo">Entrar como demo</Link><Link className="muted" href="/recuperar-senha">Esqueci minha senha</Link><Link className="muted" href="/cadastro">Criar conta</Link></section></main>;
}
