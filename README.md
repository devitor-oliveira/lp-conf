# Landing page starter

Base para uma única landing page SPA com React 19, TypeScript **6.0.3**, Vite 8, Motion, SCSS Modules, Lucide React e Biome.

## Requisitos e execução

- Node.js 24 LTS e npm (a versão principal está indicada em `.nvmrc`).
- Após clonar ou copiar o projeto: `npm ci`.
- Inicie o desenvolvimento com `npm run dev` e abra a URL exibida pelo Vite.

| Comando                | Finalidade                                 |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Servidor de desenvolvimento                |
| `npm run typecheck`    | Verificação de tipos sem gerar arquivos    |
| `npm run lint`         | Lint com Biome                             |
| `npm run format`       | Formatação com Biome                       |
| `npm run format:check` | Conferir formatação                        |
| `npm run check`        | Lint, formatação e organização de imports  |
| `npm run check:fix`    | Aplicar correções seguras                  |
| `npm run build`        | Verificar tipos e gerar `dist/`            |
| `npm run preview`      | Servir o build localmente para conferência |

O TypeScript está fixado na versão 6. O lockfile registra as versões resolvidas das dependências. O Vite transpila TypeScript, enquanto `typecheck` executa a validação completa.

## Estrutura

```text
public/                  Favicon e imagem social estática
src/
  sections/              Seções Hero e Features, com SCSS Modules
  styles/                Tokens, reset, mixins e estilos globais
  App.tsx                Layout, navegação e composição da página
  main.tsx               Entrada React
index.html               Fonte única dos metadados
biome.json               Lint, formatação e imports
vite.config.ts           React e alias @/
```

Crie componentes compartilhados em `src/components/` conforme necessário. Use `Nome.module.scss` para estilos locais, `@use` para Sass e `@/` para imports a partir de `src/`. Mixins não emitem CSS por conta própria; os tokens globais são carregados apenas na entrada.

## Personalização

1. Altere conteúdo e marca em `src/App.tsx` e `src/sections/`.
2. Ajuste cores e medidas em `src/styles/_tokens.scss`.
3. Atualize título, descrição, canonical, Open Graph e Twitter Card no `index.html`. Substitua **todas** as ocorrências de `https://example.com` pelo domínio real.
4. Substitua `public/favicon.svg` e `public/og-image.png`. O card de exemplo tem 1200 × 630 px; atualize também textos alternativos e dimensões se necessário.
5. Execute `npm run check` e `npm run build` antes de publicar.

Os metadados são estáticos e estão presentes no HTML inicial, inclusive para robôs de compartilhamento que não executam JavaScript. Não duplique essas tags nos componentes React. O conteúdo da página é renderizado no cliente, sem SSR ou pré-renderização.

## Animação, rolagem e acessibilidade

- Motion é importado de `motion/react`. `MotionConfig` respeita movimento reduzido; o Hero também desativa a animação inicial com `useReducedMotion`.
- Smooth scroll usa CSS nativo apenas quando o usuário não solicita redução de movimento. A rolagem por mouse e toque mantém o comportamento nativo.
- A navegação usa âncoras reais, com espaço superior definido por `scroll-padding-top`. Se adicionar cabeçalho fixo, ajuste esse valor à altura dele.
- A base inclui link para pular ao conteúdo, foco visível, landmarks e ícones decorativos ocultos de leitores de tela.
- A página demonstrativa usa fontes do sistema e não faz requisições a serviços externos.

## Editor

O projeto recomenda a extensão oficial do Biome no VS Code e configura formatação ao salvar. Selecione a versão de TypeScript do workspace no editor.

## Publicação

Publique o diretório `dist/` gerado por `npm run build` em uma hospedagem estática. Esta base usa uma única URL com âncoras e não precisa de roteador. Se publicar em um subdiretório, configure `base` no Vite e ajuste os caminhos dos assets no HTML. Confira o HTML publicado e teste as prévias sociais com o domínio real.
