# Regras de negocio - Oralingo MVP

## Experiencias centrais

- Todo novo usuario deve concluir onboarding antes do dashboard.
- O diagnostico inicial usa um desafio fixo de ate 60 segundos.
- O treino diario escolhe um desafio ativo a partir do perfil do usuario, sem exigir geracao por IA.
- O Desafio 60 usa o mesmo desafio, tempo e criterios para a segunda tentativa.
- Tentativas sao salvas separadamente e comparadas por nota geral e habilidades.

## Analise de fala

- Metricas objetivas: duracao, quantidade de palavras, palavras por minuto, repeticoes e ocorrencias de vicios de linguagem.
- Avaliacoes interpretativas: clareza, objetividade, estrutura, persuasao e confianca percebida.
- Inferencias da IA devem ser apresentadas como orientacoes de treino, nao como verdade cientifica.
- Se a IA externa falhar ou nao estiver configurada, a aplicacao usa uma avaliacao local validada para preservar a experiencia.

## Privacidade

- O audio e processado para gerar feedback de comunicacao.
- Chaves de IA ficam somente no backend.
- Dados de sessoes, tentativas e progresso sao filtrados por usuario autenticado.
- Exclusao futura de gravacoes deve ser implementada como soft delete e nao como remocao fisica de registros.

## Gamificacao

- A interface deve priorizar missoes curtas, progresso visivel, sequencia de treino e evolucao entre tentativas.
- Novas funcionalidades devem encaixar em trilhas, conquistas, desafios semanais ou modulos bloqueados/desbloqueados.
- Elementos de gamificacao nao devem esconder o feedback principal de comunicacao.
