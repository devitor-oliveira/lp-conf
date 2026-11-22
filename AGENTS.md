# lp-conf — Instruções do Projeto

Landing page SPA de confeitaria artesanal com React 19, TypeScript 6, Vite 8, Motion 14, SCSS Modules, Lucide React e Biome.

## Agentes disponíveis

- `developer` — Engenheiro Frontend Líder. Use para arquitetura, refatoração, UI/UX, acessibilidade, animações e implementação de seções.
- `code-review` — Senior Frontend Architect & Code Reviewer. Use para auditoria, revisão crítica, refatoração faseada e validação de UI/UX, acessibilidade e performance.

## Comandos

- `/plan` — cria um plano técnico detalhado como artefato da conversa sem editar código.
- `/grill-me` — conduz uma entrevista de alinhamento, uma pergunta por vez, antes de planejar ou implementar.

## Skill

- `notch-design-system` — carregue ao criar, revisar ou refatorar `NotchContainer`, `notch-corner`, entalhes concêntricos ou qualquer UI baseada no sistema de entalhe.

## Regras rápidas

- **Artefatos de planos**: planos devem ser criados apenas como artefatos da conversa; não espelhe artefatos de planos dentro do projeto como arquivos markdown (ex.: `.opencode/plans/*.md`), a menos que seja explicitamente solicitado.
- TypeScript estrito: proibido `any`, `@ts-ignore` cosmético e `as unknown as`.
- Zero gambiarras, magic numbers, `!important` desnecessário ou HTML semanticamente incorreto.
- **`button-base` é extensível**: `@mixin button-base` (`src/styles/_mixins.scss`) é um estilo de base, não definitivo; sobrescritas pontuais de estilos dessa base por botões ou componentes específicos são válidas e não devem ser classificadas automaticamente como erro.
- **Reduced Motion centralizado**: o controle de `reducedMotion` concentra-se no `<MotionConfig>` em `src/App.tsx` e permanece desativado (`reducedMotion="never"`) durante o desenvolvimento para testes; não altere essa configuração nem adicione controles locais de `reducedMotion` a menos que explicitamente ordenado.
- Validação obrigatória antes de concluir: `npm run check`, `npm run typecheck`, `npm run build`.
- Branch base de integração: `dev`. Features usam `feat/<escopo>`; refatorações usam `refactoring/<escopo>`; correções usam `fix/<escopo>`.
- Trabalhe em worktree isolado em `.worktrees/<feature>` quando a tarefa exigir paralelismo.
- **Conflitos de merge**: sempre que `git merge` resultar em conflito, **interrompa imediatamente** qualquer edição de resolução, reporte os arquivos afetados e explique o motivo da divergência ao usuário sem exceção, aguardando instrução explícita antes de resolver ou abortar.
- Servidor local dedicado na porta 3001: `npm run dev -- --port 3001`.
- Antes de tocar em entalhes, leia `docs/notch-design-system.md` ou carregue a skill `notch-design-system`.
- Não edite a pasta `agent/`: ela é o arquivo legado do Antigravity.

## Documentos canônicos

- `docs/agents/developer-workflow.md`
- `docs/agents/code-review-workflow.md`
- `docs/notch-design-system.md`

Após alterar `opencode.json`, agentes, comandos ou skills, reinicie o opencode para carregar a nova configuração.
