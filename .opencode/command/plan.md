---
description: Cria um plano técnico detalhado em .opencode/plans sem editar código.
agent: plan
---

Você está no fluxo de planejamento do projeto `lp-conf`.

Demanda do usuário:

$ARGUMENTS

Procedimento obrigatório:

1. Leia `docs/agents/developer-workflow.md` e, se a demanda envolver revisão ou refatoração, `docs/agents/code-review-workflow.md`.
2. Se houver ambiguidade de intenção, use a ferramenta `question` para entrevistar o usuário, uma pergunta por vez.
3. Produza um plano em `.opencode/plans/<slug>.md` com:
   - contexto e objetivo;
   - diagnóstico do código atual;
   - alternativas consideradas e justificativa contra over-engineering;
   - arquivos afetados;
   - passos de implementação em fases;
   - comandos de validação;
   - riscos e rollback;
   - checklist de conclusão.
4. Se a demanda envolver `NotchContainer`, `notch-corner` ou entalhes, carregue a skill `notch-design-system` e siga `docs/notch-design-system.md`.
5. Não edite arquivos de código de produção. A única escrita permitida é o artefato do plano em `.opencode/plans/`.
6. Aguarde aprovação explícita do usuário antes de qualquer implementação.
