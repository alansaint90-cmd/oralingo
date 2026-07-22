import { DemoNameForm } from "@/components/features/DemoNameForm";

export default function DemoPage() {
  return (
    <main className="shell app-frame grid-2">
      <section className="stack">
        <div className="brand">Oralingo</div>
        <span className="eyebrow">Modo demo</span>
        <h1 className="page-title compact">Como devemos te chamar?</h1>
        <p className="lead">Esse nome aparece no painel da demo para deixar a experiencia mais proxima de um uso real.</p>
      </section>
      <DemoNameForm />
    </main>
  );
}
