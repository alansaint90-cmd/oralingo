import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oralingo | Treinador de oratoria com IA",
  description: "Pratique sua fala, receba diagnostico e acompanhe sua evolucao."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#main-content">Pular para o conteudo</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
