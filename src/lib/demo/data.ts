import type { SpeechAnalysis } from "@/lib/db/schema";

export const demoUserId = "demo-user";
export const demoSessionId = "demo-session";

export const demoUser = {
  id: demoUserId,
  name: "Allan Demo",
  email: "demo@oralingo.local",
  onboardingCompleted: true
};

export const demoProfile = {
  currentScore: 74,
  currentProfileName: "Comunicador em evolucao",
  mainGoal: "Melhorar minha comunicacao profissional.",
  difficulties: ["Tenho dificuldade para ser objetivo.", "Tenho muitos vicios de linguagem."]
};

export const demoProgress = {
  totalTrainings: 8,
  streakDays: 4,
  bestScore: 81,
  clarityScore: 76,
  objectivityScore: 68,
  structureScore: 72,
  persuasionScore: 79,
  perceivedConfidenceScore: 73
};

export const demoDiagnosticChallenge = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "Apresente-se com clareza",
  description: "Apresente-se durante ate 60 segundos. Conte quem voce e, o que faz e algo importante sobre voce.",
  instructions: "Fale como se estivesse conhecendo uma pessoa importante para sua carreira.",
  category: "diagnostico",
  primarySkill: "Clareza",
  difficulty: "iniciante",
  preparationTime: 0,
  speakingTime: 60,
  active: true
};

export const demoDailyChallenge = {
  id: "00000000-0000-4000-8000-000000000002",
  title: "Venda sua ideia",
  description: "Imagine que voce encontrou uma pessoa importante para o seu negocio em um elevador.",
  instructions: "Voce tem ate 60 segundos para explicar sua ideia e despertar interesse suficiente para conseguir uma reuniao.",
  category: "daily",
  primarySkill: "Objetividade e Persuasao",
  difficulty: "intermediario",
  preparationTime: 20,
  speakingTime: 60,
  active: true
};

export const demoChallenge60 = {
  id: "00000000-0000-4000-8000-000000000003",
  title: "Comunicacao muda carreiras",
  description: "Voce tem 60 segundos para convencer alguem de que aprender a se comunicar bem pode mudar uma carreira.",
  instructions: "Use 30 segundos para organizar suas ideias. Depois apresente problema, beneficio e convite a acao.",
  category: "desafio_60",
  primarySkill: "Persuasao",
  difficulty: "iniciante",
  preparationTime: 30,
  speakingTime: 60,
  active: true
};

export const demoAnalysis: SpeechAnalysis = {
  nota_geral: 74,
  clareza: 76,
  objetividade: 68,
  estrutura: 72,
  persuasao: 79,
  confianca_percebida: 73,
  pontos_fortes: ["Voce transmite a ideia central com energia e boa intencao comunicativa."],
  pontos_melhoria: ["Chegue ao argumento principal mais cedo e reduza introducoes longas."],
  vicios_linguagem: [{ palavra: "ne", quantidade: 4 }, { palavra: "assim", quantidade: 3 }],
  resumo_feedback: "Sua fala tem boa presenca, mas pode ganhar impacto com uma abertura mais direta e pausas mais conscientes.",
  orientacao_principal: "Na proxima tentativa, apresente sua ideia principal nos primeiros 10 segundos e use pausas no lugar de palavras de preenchimento.",
  exercicio_recomendado: "Repita o desafio usando uma frase de abertura, dois argumentos curtos e uma conclusao objetiva."
};

export const demoImprovedAnalysis: SpeechAnalysis = {
  ...demoAnalysis,
  nota_geral: 81,
  clareza: 84,
  objetividade: 82,
  estrutura: 79,
  persuasao: 80,
  confianca_percebida: 80,
  vicios_linguagem: [{ palavra: "ne", quantidade: 1 }],
  resumo_feedback: "A segunda tentativa chegou ao ponto principal mais rapido e organizou melhor os argumentos.",
  orientacao_principal: "Mantenha essa abertura direta e fortaleça o fechamento com uma frase de acao."
};
