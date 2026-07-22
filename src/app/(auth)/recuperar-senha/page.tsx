import Link from "next/link";
import { AuthForm } from "@/components/features/AuthForm";

export default function RecoverPage() {
  return <main className="shell app-frame grid-2"><section className="stack"><div className="brand">Oralingo</div><span className="eyebrow">Retomar progresso</span><h1 className="page-title compact">Recupere seu acesso.</h1><p className="lead">Enviaremos as instrucoes quando o provedor de e-mail estiver configurado.</p></section><section className="stack"><AuthForm mode="recover" /><Link className="muted" href="/login">Voltar ao login</Link></section></main>;
}
