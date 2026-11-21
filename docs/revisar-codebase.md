# Revisão Arquitetural e Diagnóstico Crítico da Codebase (`lp-conf`)

> **Documento**: `docs/revisar-codebase.md`
> **Escopo de Comparação**: Branch atual (`refactoring/menu-editorial-layout` + working tree) vs. Branch `dev`
> **Referências Normativas Internas**: `docs/agents/code-review-workflow.md`, `docs/notch-design-system.md` e `AGENTS.md`
> **Status**: Diagnóstico concluído (somente leitura; código produtivo inalterado)

---

## Sumário Executivo

Esta auditoria avalia cada seção e camada transversal da landing page `lp-conf`, verificando a aderência estrita ao **Design System (Tokens e Mixins)**, ao **Sistema de Entalhe Concêntrico (Notch Design System)**, às **Regras Inegociáveis do Projeto** (zero gambiarras, zero magic numbers, HTML semântico, TypeScript estrito) e à **Matriz de Fontes Aprovadas** definida em `docs/agents/code-review-workflow.md`.

Foram identificados **23 achados técnicos** distribuídos entre a camada global e as seções **Navegação de Topo (`Header` / `ThemeToggle`)**, **Hero & Carrossel (`Hero` / `Carrosel`)**, **O Atelier (`About`)** e **Cardápio & Coleções (`Menu`)**.

---

## 0. Camada Transversal / Global (`App`, `index.html`, `styles/`, `utils/`)

### Achado 0.1 — Violação de Acessibilidade Cinética: `<MotionConfig reducedMotion="never">`
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e na branch atual (`refactoring/menu-editorial-layout`).
- **Arquivos Relacionados**:
  - `src/App.tsx` (linha 40)
  - `src/utils/scrollToSection.ts` (linha 7)
  - `src/components/Carrosel/CarroselDock/CarroselDock.module.scss` (linhas 88, 115, 220)
- **Descrição do Problema**:
  O componente raiz `<App />` envolve toda a aplicação com `<MotionConfig reducedMotion="never">`. Essa propriedade instrui explicitamente a biblioteca Motion 14 a **ignorar** a preferência de acessibilidade do sistema operacional (`prefers-reduced-motion: reduce`).
- **Por que está errado (Justificativa Técnica)**:
  Embora partes do CSS (`CarroselDock.module.scss`) e do utilitário de scroll (`scrollToSection.ts`) verifiquem `prefers-reduced-motion: reduce`, todos os componentes animados via Motion (`Header`, `ThemeToggleButton`, `Carrosel`, `WhatsAppCTA`, `MenuExpandButton`, `MenuHeader`, `MenuFeaturedStage`, `WhatsAppButton`) continuam executando animações de mola (`spring`), translações (`x`, `y`), rotações, escalas e micro-parallax em JavaScript, expondo usuários com distúrbios vestibulares a gatilhos visuais.
- **Fontes Referenciadas**:
  - *WCAG 2.2 Level AA — Criterion 2.3.3 (Animation from Interactions)* e *WCAG 2.2 Motion Actuation & Reduced Motion* (`docs/agents/code-review-workflow.md`, Seções 2.3 e 2.7).
  - *Motion 14 Documentation (Matt Perry)* — configuração de acessibilidade com `reducedMotion="user"` ou hook `useReducedMotion()`.

---

### Achado 0.2 — Duplicação de Utilitários e Fragmentação de Fonte Única de Verdade (WhatsApp)
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e acentuado na branch atual (`WhatsAppButton.tsx` migrou para `constants.ts` enquanto a Hero permanece em `whatsapp.ts`).
- **Arquivos Relacionados**:
  - `src/utils/whatsapp.ts` (linhas 1–14)
  - `src/utils/constants.ts` (linhas 1–28)
  - `src/components/Carrosel/Carrosel.tsx` (linha 15)
  - `src/components/Carrosel/WhatsAppCTA/WhatsAppCTA.tsx` (linhas 4–8)
  - `src/sections/About.tsx` (linhas 2–7)
  - `src/components/Menu/WhatsAppButton.tsx` (linha 4)
- **Descrição do Problema**:
  Existem dois módulos distintos com a mesma responsabilidade:
  1. `src/utils/whatsapp.ts` define `DEFAULT_WHATSAPP_PHONE = "5511999999999"` e `buildWhatsAppUrl(phone, message)`.
  2. `src/utils/constants.ts` redefine `DEFAULT_WHATSAPP_PHONE = "5511999999999"` e `getWhatsAppUrl(phone, message)`.
- **Por que está errado (Justificativa Técnica)**:
  Viola o princípio DRY (*Don't Repeat Yourself*) e a modularidade de funções puras utilitárias. Qualquer alteração futura no número de telefone padrão ou na formatação da URL exigirá manutenção sincronizada em dois arquivos diferentes, sob risco de divergência funcional entre o CTA da Hero e os CTAs de `About` e `Menu`.
- **Fontes Referenciadas**:
  - *Refactoring (Martin Fowler)* — eliminação de código duplicado e consolidação de módulos (`docs/agents/code-review-workflow.md`, Seção 2.9).
  - *Google Engineering Practices: Code Review Guidelines* — consistência e manutenibilidade (`docs/agents/code-review-workflow.md`, Seção 2.9).

---

### Achado 0.3 — Divergência de `theme-color` no `index.html` e Hexadecimal Fora do Padrão Canônico
- **Severidade**: Baixa
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `index.html` (linhas 49, 51–66)
  - `src/components/ThemeToggle/useTheme.ts` (linhas 7–8)
  - `src/styles/_tokens.scss` (linhas 4–5, 111)
- **Descrição do Problema**:
  1. Em `index.html` (linha 49), a meta tag `<meta name="theme-color" content="#101412" />` é inicializada com `#101412`, um valor hexadecimal que não pertence à paleta do projeto (`#f8f4e8` no tema claro; `#003049` no tema escuro). Além disso, o script inline anti-FOUC no `<head>` (linhas 51–66) aplica `data-theme="dark"`, mas não sincroniza a meta tag `theme-color` antes da hidratação do React.
  2. Em `src/components/ThemeToggle/useTheme.ts` (linha 7), a constante `THEME_META_LIGHT = "#F8F4E8"` utiliza letras maiúsculas, divergindo da norma documentada em `src/styles/_tokens.scss` (`// --- Paleta Semântica (hex minúsculo canônico) ---`).
- **Por que está errado (Justificativa Técnica)**:
  Causa um flash cromático na barra de status de navegadores móveis (iOS Safari / Android Chrome) durante o carregamento inicial até a execução do `useEffect` de `useTheme.ts`, além de quebrar a padronização léxica de cores.
- **Fontes Referenciadas**:
  - *Modern CSS Standards (W3C / web.dev)* e *Design System Tokens (`src/styles/_tokens.scss`)* (`docs/agents/code-review-workflow.md`, Seção 2.4).
  - *Google Engineering Practices: Code Review Guidelines* — consistência de código (`docs/agents/code-review-workflow.md`, Seção 2.9).

---

### Achado 0.4 — Skip Link Órfão (Ausente no DOM) e Landmark `<footer>` Vazio
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/styles/globals.scss` (linhas 28–43)
  - `src/App.tsx` (linhas 43, 52)
  - `src/App.module.scss` (linhas 5–7)
- **Descrição do Problema**:
  1. `src/styles/globals.scss` declara a regra completa `.skip-link`, e `src/App.tsx` configura `<main className={styles.main} id="conteudo" tabIndex={-1}>` para receber foco programático. Entretanto, **não existe o elemento `<a href="#conteudo" className="skip-link">Pular para o conteúdo</a>`** em `App.tsx` nem em `index.html`.
  2. `src/App.tsx` renderiza `<footer className={styles.footer} />` sem nenhum conteúdo filho.
- **Por que está errado (Justificativa Técnica)**:
  Usuários de teclado e tecnologias assistivas são obrigados a percorrer todos os links do `Header`, o `ThemeToggle` e os controles da Hero antes de alcançar o conteúdo principal. Adicionalmente, um `<footer>` vazio expõe um landmark `contentinfo` inútil na árvore de acessibilidade.
- **Fontes Referenciadas**:
  - *WCAG 2.2 Level AA — Criterion 2.4.1 (Bypass Blocks)* (`docs/agents/code-review-workflow.md`, Seção 2.7).
  - *WAI-ARIA Authoring Practices Guide (Landmark Regions)* (`docs/agents/code-review-workflow.md`, Seção 2.7).

---

## 1. Navegação Global & Controles de Topo (`Header` e `ThemeToggle`)

### Achado 1.1 — Não Uso de Mixins e Tokens do Design System (Breakpoints Hardcoded, Focus Ring e Magic Numbers)
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Header/Header.module.scss` (linhas 4, 7, 13–20, 36–40, 45, 50, 57–59, 65–66, 83–89, 106–110)
  - `src/components/ThemeToggle/ThemeToggle.module.scss` (linhas 2–4, 13–14, 30–35, 45–50)
  - `src/styles/_mixins.scss` (linhas 4–16, 28–33)
  - `src/styles/_tokens.scss` (linhas 28–48, 99–104)
- **Descrição do Problema**:
  1. **Violação do Mixin de Breakpoint**: `src/styles/_mixins.scss` define `$breakpoints: ("mobile": 40rem)` e bloqueia outros valores com `@error "Breakpoint '#{$breakpoint}' não permitido. Use 'mobile'."`. Em vez de usar `@include mixins.respond-to("mobile")`, `Header.module.scss` usa `@media (max-width: 640px)` (linha 110) e `ThemeToggle.module.scss` usa `@media (max-width: 900px)` (linha 45).
  2. **Não uso do `@mixin focus-ring`**: Ambos os arquivos recriam manualmente `&:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }` em vez de invocar `@include mixins.focus-ring()`.
  3. **Não uso de tokens de transição, raio e espaçamento**: Uso literal de `0.6s cubic-bezier(0.22, 1, 0.36, 1)` (em vez de `var(--duration-slow) var(--ease-smooth)`), `0.25s cubic-bezier(0.16, 1, 0.3, 1)` (em vez de `var(--ease-spring)`), `0.4s ease` (em vez de `var(--duration-normal)`), `border-radius: 999px` (em vez de `var(--radius-pill)`), e valores mágicos como `height: 56px` (disponível como `var(--space-7)`), `height: 48px` (`var(--space-6)`), `padding: 0 2rem` (`var(--space-4)`).
- **Por que está errado (Justificativa Técnica)**:
  Além de violar a regra `"Zero gambiarras, magic numbers"` do `AGENTS.md`, a discrepância entre `@media (max-width: 900px)` no `ThemeToggle` e `@media (max-width: 640px)` no `Header` cria uma janela inconsistente (de `641px` a `900px`) onde o botão de tema no canto superior direito já diminuiu para `44px` (`paddingOuter: 8px`), mas o Header no canto superior esquerdo continua com altura de desktop (`56px`, `paddingOuter: 12px`).
- **Fontes Referenciadas**:
  - *Sass Official Guidelines* e *CUBE CSS / BEM nos SCSS Modules (Andy Bell)* (`docs/agents/code-review-workflow.md`, Seção 2.4).
  - *Refactoring UI (Adam Wathan & Steve Schoger)* — consistência de escala espacial e tokens (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

### Achado 1.2 — Ausência da Transição Sincronizada de `0.6s` no Wrapper do Entalhe do `Header`
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Header/Header.module.scss` (linhas 73–95)
  - `src/components/Notch/NotchContainer.module.scss` (linha 8)
  - `docs/notch-design-system.md` (Seções 2, 6.3, 8 e 9)
- **Descrição do Problema**:
  Em `Header.module.scss`, a classe `.header` (passada para o `NotchContainer`) não declara a transição sincronizada de `--notch-bg` e `background-color` de `0.6s cubic-bezier(0.22, 1, 0.36, 1)`, herdando apenas `transition: --notch-bg 0.4s ease, background-color 0.4s ease;` da classe base `.notch`. Enquanto isso, o `<nav>` interno declara `transition: background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1);`.
- **Por que está errado (Justificativa Técnica)**:
  O manual `docs/notch-design-system.md` (Seção 9 — Erros comuns) adverte explicitamente: *"Assumir que a transição de 0.6s vem do componente base; ela precisa estar no wrapper"*. Embora a Seção 6.3 afirme que isso já seria feito em `Header`, o código real de `Header.module.scss` omitiu a propriedade em `.header`.
- **Fontes Referenciadas**:
  - *Manual Canônico do Sistema de Entalhe Concêntrico (`docs/notch-design-system.md`, Seções 2, 6.3, 8 [item 6] e 9)*.

---

### Achado 1.3 — Link de Navegação Principal Quebrado (`href="#encomende"`)
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Header/Header.tsx` (linhas 26–30)
  - `src/App.tsx` (linhas 43–51)
- **Descrição do Problema**:
  A constante `NAV_LINKS` define `{ href: "#encomende", label: "Encomende Já" }`. Contudo, as únicas seções renderizadas em `App.tsx` possuem os IDs `#inicio` (`Hero`), `#conheca` (`About`) e `#cardapio` (`Menu`).
- **Por que está errado (Justificativa Técnica)**:
  Tanto no Header ancorado quanto no Header flutuante (`floatingHeader`), clicar na chamada principal de ação do menu (`"Encomende Já"`) apenas altera o hash da URL para `#encomende` sem realizar nenhum deslocamento na página, frustrando o fluxo de conversão.
- **Fontes Referenciadas**:
  - *Nielsen Norman Group* — heurísticas de visibilidade de status, controle do usuário e prevenção de erros (`docs/agents/code-review-workflow.md`, Seção 2.5).
  - *CXL & Baymard Institute* — padrões de CTA e redução de atrito cognitivo (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

## 2. Seção Hero & Carrossel (`Hero`, `Carrosel`, `CarroselProgress`, `CarroselDock`, `WhatsAppCTA`, `HeroHighlights`)

### Achado 2.1 — Violação de Core Web Vitals (LCP e CLS) na Imagem Principal da Hero
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Carrosel/Carrosel.tsx` (linhas 274–285)
- **Descrição do Problema**:
  O elemento `<motion.img>` que renderiza a foto principal do doce na Hero (`currentSlide?.image`) não define `fetchPriority="high"`, `loading="eager"`, `decoding="async"` nem atributos `width` e `height`.
- **Por que está errado (Justificativa Técnica)**:
  Esta imagem é o maior elemento visual acima da dobra (**LCP — Largest Contentful Paint**). Sem `fetchPriority="high"`, o navegador não prioriza o download da imagem do primeiro slide sobre imagens secundárias (especialmente agravado pelo fato de `MenuFeaturedStage.tsx` usar `loading="eager"` na 3ª seção).
- **Fontes Referenciadas**:
  - *Google web.dev — Core Web Vitals (LCP: pré-carregamento e prioridade do Hero `fetchpriority="high"`)* (`docs/agents/code-review-workflow.md`, Seção 2.6).

---

### Achado 2.2 — Quebra Geométrica do Entalhe Concêntrico no Mobile (`WhatsAppCTA`)
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Carrosel/WhatsAppCTA/WhatsAppCTA.tsx` (linhas 51–73)
  - `src/components/Carrosel/WhatsAppCTA/WhatsAppCTA.module.scss` (linhas 3–19, 50–66)
  - `src/components/ThemeToggle/ThemeToggle.tsx` (linhas 38–42)
  - `docs/notch-design-system.md` (Seções 2 e 8)
- **Descrição do Problema**:
  Em `WhatsAppCTA.module.scss`, dentro de `@include mixins.respond-to("mobile")` (linhas 50–60), o padding do wrapper `.ctaNotch` diminui de `12px 0 0 12px` para `8px 0 0 8px` e a altura da pílula `.ctaButton` diminui de `48px` para `40px` (o que reduz seu `innerRadius` real de `24px` para `20px`). Porém, em `WhatsAppCTA.tsx` (linhas 51–52), o `NotchContainer` recebe números estáticos de desktop: `innerRadius = 24` e `paddingOuter = 12`.
- **Por que está errado (Justificativa Técnica)**:
  Como `innerRadius` e `paddingOuter` são passados como `number` (`24` e `12`), `calculateConcentricNotch` resolve estaticamente `--notch-radius: 36px` e `--notch-fillet: 24px` inline no atributo `style`. No mobile (`<= 40rem`), a caixa real passa a ter pílula de `40px` (`innerRadius = 20px`) e colarinho de `8px` (`paddingOuter = 8px`), o que exigiria `--notch-radius: 28px` e `--notch-fillet: 20px`. Isso rompe a continuidade G1 da curva no mobile. Em `ThemeToggle`, isso foi resolvido usando custom properties CSS (`innerRadius: "var(--toggle-inner-radius, 28px)"`), padrão que não foi seguido em `WhatsAppCTA`.
- **Fontes Referenciadas**:
  - *Manual Canônico do Sistema de Entalhe Concêntrico (`docs/notch-design-system.md`, Seção 2 — Fórmula matemática concêntrica e Seção 8 — Checklist itens 1, 2 e 4)*.

---

### Achado 2.3 — Gambiarra de Acoplamento CSS/JS por Magic Numbers Espelhados (`Carrosel.tsx` vs. `Carrosel.module.scss`)
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Carrosel/Carrosel.tsx` (linhas 21–30, 53, 156–175)
  - `src/components/Carrosel/Carrosel.module.scss` (linhas 3–11, 159–178)
- **Descrição do Problema**:
  As dimensões de layout da Hero estão declaradas em duplicidade como constantes numéricas no TypeScript e como variáveis CSS no SCSS:
  - `PROGRESS_SEGMENT_WIDTH = 38` vs. `--progress-segment-width: 38px`
  - `PROGRESS_SEGMENT_GAP = 6` vs. `--progress-segment-gap: 6px`
  - `PROGRESS_PAD_X = 10` vs. `--progress-pad-x: 10px`
  - `PROGRESS_NOTCH_HEIGHT = 32` vs. `--progress-notch-height: 32px`
  - `CANVAS_EDGE_INSET = 8` vs. `--canvas-edge-inset: 8px`
  - `CONTENT_SPLIT_OFFSET_RATIO = 0.05` (calculado manualmente como `55% - 50%`) vs. `--content-width: 55%`
  Além disso, `Carrosel.module.scss` utiliza `@media (max-width: 900px)` hardcoded na linha 159, fora do mixin `respond-to("mobile")`.
- **Por que está errado (Justificativa Técnica)**:
  Cria fragilidade estrutural (*Shotgun Surgery* / *Divergent Change*): alterar qualquer medida ou proporção de coluna no SCSS desalinha imediatamente a geometria SVG de `.imageNotchCollar` calculada no JS.
- **Fontes Referenciadas**:
  - *Refactoring (Martin Fowler)* — eliminação de números mágicos duplicados e acoplamento implícito (`docs/agents/code-review-workflow.md`, Seção 2.9).
  - *AGENTS.md* — *"Zero gambiarras, magic numbers..."*.

---

### Achado 2.4 — Animação de Propriedades de Layout (`height` e `width`) na Thread Principal (`CarroselDock`)
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Carrosel/CarroselDock/CarroselDock.tsx` (linhas 182–190)
  - `src/components/Carrosel/CarroselDock/CarroselDock.module.scss` (linhas 64, 108–113)
- **Descrição do Problema**:
  1. Em `CarroselDock.tsx`, o container `.dockItems` anima diretamente `animate={{ height: isOpen ? 68 : 18 }}` via física de mola.
  2. Em `CarroselDock.module.scss`, `.dockHandle` transiciona `height: 0.2s ease` e `.handleBar` transiciona `width` e `height`.
- **Por que está errado (Justificativa Técnica)**:
  Animar `height` e `width` invalida o cálculo geométrico da árvore DOM a cada frame (60/120fps), disparando etapas de **Layout (Reflow)** e **Paint** na CPU em vez de operar exclusivamente na GPU via Compositor Thread (`transform` e `opacity`).
- **Fontes Referenciadas**:
  - *High Performance Animations & FLIP (Paul Lewis / Chrome Team)* — *"animações restritas a `transform` e `opacity`, sem layout/paint desnecessários"* (`docs/agents/code-review-workflow.md`, Seção 2.3).
  - *Google web.dev — Core Web Vitals (INP / Main Thread Blocking)* (`docs/agents/code-review-workflow.md`, Seção 2.6).

---

### Achado 2.5 — Não Uso de Tokens/Mixins e Área de Toque Inferior ao Mínimo WCAG nos Controles do Carrossel
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Carrosel/CarroselProgress/CarroselProgress.module.scss` (linhas 24, 30–45)
  - `src/components/Carrosel/CarroselDock/CarroselDock.module.scss` (linhas 41, 50–71, 76, 104, 197, 209–213)
  - `src/components/Carrosel/WhatsAppCTA/WhatsAppCTA.module.scss` (linhas 13–44)
- **Descrição do Problema**:
  1. **Target Size insuficiente**: Em `CarroselProgress.module.scss`, `.segmentButton` tem `height: 20px` (e não possui estilo `:focus-visible` customizado). Em `CarroselDock.module.scss`, `.dockHandle` tem `height: 16px` quando fechado e `height: 10px` quando aberto. Ambos estão abaixo do requisito mínimo de `24x24px` da WCAG 2.2 AA (e longe dos `48px` definidos em `@mixin button-base`).
  2. **Valores hardcoded fora dos tokens**:
     - `WhatsAppCTA.module.scss` usa `color: #25d366;` literal na linha 42 (ignorando `var(--color-whatsapp)` de `_tokens.scss`), `border-radius: 100px` (em vez de `var(--radius-pill)`), e recria estilos de botão e `:focus-visible` manualmente em vez de usar `@include mixins.button-base` / `@include mixins.focus-ring`.
     - `CarroselDock.module.scss` usa `border-radius: 20px 20px 0 0` (em vez de `var(--radius-md)`), `border-radius: 9999px` / `999px` (em vez de `var(--radius-pill)`), e `0.25s cubic-bezier(0.22, 1, 0.36, 1)` literal (em vez de `var(--ease-smooth)`).
- **Por que está errado (Justificativa Técnica)**:
  Dificulta a interação em dispositivos móveis ou para usuários com limitações motoras finas, além de espalhar valores mágicos que já possuem tokens semânticos equivalentes em `_tokens.scss`.
- **Fontes Referenciadas**:
  - *WCAG 2.2 Level AA — Criterion 2.5.8 (Target Size Minimum)* e *Criterion 2.4.7 (Focus Visible)* (`docs/agents/code-review-workflow.md`, Seção 2.7).
  - *CUBE CSS / BEM (Andy Bell)* e *Design System Tokens (`src/styles/_tokens.scss`)* (`docs/agents/code-review-workflow.md`, Seção 2.4).

---

### Achado 2.6 — `aria-live="polite"` Mal Posicionado e Ativo Durante Autoplay no Carrossel
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Carrosel/Carrosel.tsx` (linhas 82–93, 211–216, 251–256)
- **Descrição do Problema**:
  O atributo `aria-live="polite"` foi aplicado na `<motion.div className={styles.canvas}>` (linha 253), que envolve apenas a imagem e o `WhatsAppCTA`, deixando de fora a coluna `.content` (onde estão o título `<h1>`, o eyebrow, a descrição e os highlights do slide). Além disso, o atributo permanece sempre `"polite"`, mesmo enquanto o autoplay troca os slides automaticamente a cada 8 segundos.
- **Por que está errado (Justificativa Técnica)**:
  Segundo o padrão de Carrossel da WAI-ARIA, uma região `aria-live` ativa durante a rotação automática interrompe verbalmente o leitor de tela a cada 8 segundos, mesmo quando o usuário já rolou a página e está lendo a seção `About` ou `Menu`. Quando o anúncio ocorre, ele lê apenas a mudança da imagem no `.canvas`, omitindo o título e o texto do slide.
- **Fontes Referenciadas**:
  - *WAI-ARIA Authoring Practices Guide (APG) — Carousel Pattern* (`docs/agents/code-review-workflow.md`, Seção 2.7).

---

## 3. Seção O Atelier (`About`, `ServiceTierCard`, `MenuExpandButton`)

### Achado 3.1 — Gambiarra de Scroll com `fallbackToBottom: true` para Seção Inexistente (`#encomende`)
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/sections/About.tsx` (linhas 44–54)
  - `src/utils/scrollToSection.ts` (linhas 5–15)
- **Descrição do Problema**:
  O card central em destaque (*"Grandes Encomendas & Celebrações"*) configura seu CTA `"Solicitar Orçamento de Evento"` com:
  ```tsx
  onActionClick={() => scrollToSection("#encomende", { fallbackToBottom: true })}
  ```
  Como não existe nenhum elemento `#encomende` na página, `scrollToSection` executa `window.scrollTo({ top: document.body.scrollHeight, behavior })`, rolando a janela até o limite inferior do documento (final da seção `Menu`).
- **Por que está errado (Justificativa Técnica)**:
  `fallbackToBottom: true` é uma gambiarra arquitetural para ocultar a ausência da seção de encomendas. Para o usuário final, clicar em *"Solicitar Orçamento de Evento"* e ser arremessado para o rodapé vazio abaixo do cardápio quebra o modelo mental de navegação e prejudica diretamente a conversão.
- **Fontes Referenciadas**:
  - *Regras Inegociáveis de Execução — Item 4 ("Zero gambiarras")* (`docs/agents/code-review-workflow.md`, Seção 3).
  - *Nielsen Norman Group* e *CXL & Baymard Institute* — clareza de fluxo e resposta previsível a CTAs (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

### Achado 3.2 — Violação de DRY: Duplicação Integral de `MenuExpandButton` dentro de `MenuFeaturedStage`
- **Severidade**: Média
- **Estado nas Branches**: **Introduzido na branch atual (`refactoring/menu-editorial-layout`)**.
- **Arquivos Relacionados**:
  - `src/components/About/MenuExpandButton.tsx` (linhas 6–42)
  - `src/components/About/MenuExpandButton.module.scss` (linhas 3–64)
  - `src/components/Menu/MenuFeaturedStage.tsx` (linhas 19–27, 93–111)
  - `src/components/Menu/MenuFeaturedStage.module.scss` (linhas 140–182, 193–200)
- **Descrição do Problema**:
  Na branch atual, para estilizar o botão `"Encomendar / Ver Opções"` no painel editorial de `MenuFeaturedStage`, todo o código de `MenuExpandButton` (da seção `About`) foi copiado e colado:
  - As variantes Motion `buttonVariants` (`tap: { scale: 0.97 }`) e `arrowVariants` (`hover: { x: 3 }, tap: { scale: 0.95 }`) e a transição `spring` (`stiffness: 450, damping: 28`).
  - A estrutura JSX de `<motion.button>` com `<span className={styles.ctaLabel}>` e `<motion.span className={styles.arrowBadge}><ArrowRight size={14} strokeWidth={2.2} /></motion.span>`.
  - Todo o bloco SCSS de `.expandButton` (renomeado para `.orderCtaButton`) e `.arrowBadge`, consumindo os mesmos tokens `--padding-expand-button`, `--font-expand-button` e `--badge-size-compact`.
- **Por que está errado (Justificativa Técnica)**:
  Viola o isolamento atômico de componentes e a composição limpa do Design System. Um padrão visual e cinético utilizado em múltiplas seções (`About` e `Menu`) deve ser extraído para um componente compartilhado de UI (ou no mínimo um `@mixin` canônico em `src/styles/_mixins.scss`), evitando manutenção duplicada.
- **Fontes Referenciadas**:
  - *Thinking in React & Component Composition* e *Patterns.dev (Addy Osmani & Lydia Hallie)* (`docs/agents/code-review-workflow.md`, Seção 2.1).
  - *Refactoring (Martin Fowler — Extract Component)* (`docs/agents/code-review-workflow.md`, Seção 2.9).

---

### Achado 3.3 — Truncamento Rígido de Texto (`-webkit-line-clamp: 3` e `max-height: 70%`) nos Cards de Serviço
- **Severidade**: Baixa
- **Estado nas Branches**: Presente em `dev` e na branch atual.
- **Arquivos Relacionados**:
  - `src/components/About/ServiceTierCard.module.scss` (linhas 41–49, 124–133)
- **Descrição do Problema**:
  A classe `.cardDescription` impõe `-webkit-line-clamp: 3; overflow: hidden;` e o container `.glassOverlay` limita `max-height: 70%` dentro de um card com `aspect-ratio: 3.5 / 4.2`.
- **Por que está errado (Justificativa Técnica)**:
  Em viewports intermediárias (tablets / janelas divididas) ou quando o usuário configura zoom de fonte no navegador (até 200% conforme exigido pela WCAG), o texto explicativo do serviço é truncado com reticências sem qualquer mecanismo para ler o conteúdo completo, ou o conteúdo interno de `.glassOverlay` sofre corte vertical.
- **Fontes Referenciadas**:
  - *WCAG 2.2 Level AA — Criterion 1.4.4 (Resize Text)* e *Criterion 1.4.10 (Reflow)* (`docs/agents/code-review-workflow.md`, Seção 2.7).
  - *Refactoring UI (Adam Wathan & Steve Schoger)* (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

### Achado 3.4 — Pesos Tipográficos Não Suportados pela Font Stack (`450`, `650`, `850`) e Sintaxe CSS Legada
- **Severidade**: Baixa
- **Estado nas Branches**: Presente em `dev` e expandido na branch atual.
- **Arquivos Relacionados**:
  - `src/styles/globals.scss` (linha 14)
  - `src/sections/About.module.scss` (linha 60: `font-weight: 450`)
  - `src/components/About/MenuExpandButton.module.scss` (linha 24: `font-weight: 650`)
  - `src/components/Menu/MenuFeaturedStage.module.scss` (linhas 59 e 106: `font-weight: 850`; linha 158: `font-weight: 650`)
  - `src/components/About/ServiceTierCard.module.scss` (linhas 66–67: `rgba(0, 0, 0, 0.5)`)
- **Descrição do Problema**:
  1. `globals.scss` define `font-family: "Segoe UI", system-ui, sans-serif;`. Nenhuma fonte variável foi importada em `index.html` ou `globals.scss`. Pesos fracionados como `450`, `650` e `850` não existem na família estática `Segoe UI` (que possui apenas 300, 400, 600, 700), sendo arredondados pelo motor de renderização de forma diferente conforme o sistema operacional.
  2. Em `ServiceTierCard.module.scss` (linhas 66–67), utiliza-se `rgba(0, 0, 0, 0.5)` com vírgulas, divergindo do padrão CSS Color 4 (`rgb(0 0 0 / 0.5)`) utilizado em `_tokens.scss`.
- **Por que está errado (Justificativa Técnica)**:
  Gera falsa precisão tipográfica no código e inconsistência visual entre Windows, macOS e Android/iOS.
- **Fontes Referenciadas**:
  - *Modern CSS Standards (W3C / web.dev)* (`docs/agents/code-review-workflow.md`, Seção 2.4).
  - *Refactoring UI (Adam Wathan & Steve Schoger)* — hierarquia tipográfica previsível (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

## 4. Seção Cardápio & Coleções (`Menu`, `MenuHeader`, `MenuSelectorRail`, `MenuFeaturedStage`, `WhatsAppButton`)

> **Nota sobre a branch atual**: Os arquivos desta seção concentram a totalidade do `git diff dev` na branch `refactoring/menu-editorial-layout`.

### Achado 4.1 — Implementação Incompleta e Inválida do Padrão WAI-ARIA `tablist` / `tab` em `MenuHeader`
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` (quando ficava em `MenuSelectorRail`) e **mantido sem correção ao ser movido para `MenuHeader.tsx` na branch atual**.
- **Arquivos Relacionados**:
  - `src/components/Menu/MenuHeader.tsx` (linhas 58–82)
  - `src/sections/Menu.tsx` (linhas 58–80)
- **Descrição do Problema**:
  O grupo de botões de categoria em `MenuHeader.tsx` declara `role="tablist"` no container `<motion.div>` e `role="tab"` + `aria-selected={isActive}` em cada `<button>`, porém:
  1. **Não implementa navegação por setas (`ArrowLeft` / `ArrowRight` / `Home` / `End`)** nem gerenciamento de foco (*roving `tabIndex={isActive ? 0 : -1}`*).
  2. **Não declara `aria-controls`** nos elementos `role="tab"`, e o container de conteúdo abaixo (`.bentoShowcase`) **não possui `role="tabpanel"`** nem `aria-labelledby`.
- **Por que está errado (Justificativa Técnica)**:
  Ao anunciar `role="tab"`, leitores de tela (NVDA, JAWS, VoiceOver) informam ao usuário que ele está em um componente de abas onde a tecla `Tab` sai do grupo e as setas direcionais alternam entre as abas. Como isso não foi implementado em `MenuHeader` (diferente de `CarroselDock`, onde foi implementado), o contrato de interação WAI-ARIA é quebrado.
- **Fontes Referenciadas**:
  - *WAI-ARIA Authoring Practices Guide (APG) — Tabs Pattern* (`docs/agents/code-review-workflow.md`, Seção 2.7).
  - *WCAG 2.2 Level AA — Criterion 2.1.1 (Keyboard)* e *Criterion 4.1.2 (Name, Role, Value)* (`docs/agents/code-review-workflow.md`, Seção 2.7).

---

### Achado 4.2 — Conflito Semântico no `MenuSelectorRail`: `<button role="option">` com `<img alt>` + Texto Duplicado
- **Severidade**: Média
- **Estado nas Branches**: Presente em `dev` e **modificado na branch atual (`refactoring/menu-editorial-layout`)**.
- **Arquivos Relacionados**:
  - `src/components/Menu/MenuSelectorRail.tsx` (linhas 43–75)
- **Descrição do Problema**:
  Em `MenuSelectorRail.tsx`, uma `<div role="listbox">` renderiza elementos `<button type="button" role="option" aria-selected={isSelected}>`. Dentro de cada botão há:
  ```tsx
  <div className={styles.thumbFrame}>
    <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
  </div>
  <span className={styles.thumbLabel}>{item.name}</span>
  ```
- **Por que está errado (Justificativa Técnica)**:
  1. **Nome Acessível Poluído/Duplicado**: Como a `<img>` possui `alt={item.alt}` e o botão também possui `<span className={styles.thumbLabel}>{item.name}</span>`, o algoritmo de *Accessible Name Computation* concatena ambos. O leitor de tela lê: *"Doce autoral vermelho com cacau e cereja Cacau & Cereja Selvagem, opção selecionada, 1 de 6"*. Como a imagem completa com `alt={item.alt}` já é exibida ao lado em `MenuFeaturedStage`, a miniatura do rail é puramente ilustrativa do rótulo `{item.name}` e deveria ter `alt=""`.
  2. **Semântica de `listbox` vs. Controle de Palco**: Um `role="listbox"` é um widget de formulário equivalente a um `<select>`. Quando uma lista de miniaturas controla qual artigo detalhado é exibido em um painel adjacente (`MenuFeaturedStage`), sem `aria-controls` vinculando a opção ao palco, usuários de leitor de tela não são informados sobre qual região da página foi atualizada ao selecionar um item.
- **Fontes Referenciadas**:
  - *WAI-ARIA Authoring Practices Guide (APG) — Listbox Pattern & Accessible Name Computation* (`docs/agents/code-review-workflow.md`, Seção 2.7).
  - *WCAG 2.2 Level AA — Criterion 1.1.1 (Non-text Content)* (`docs/agents/code-review-workflow.md`, Seção 2.7).

---

### Achado 4.3 — Gambiarra de `setTimeout(..., 500)` + `window.open` em `<button>` no `WhatsAppButton` (Risco de Bloqueio de Pop-up)
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e **mantido na branch atual (`refactoring/menu-editorial-layout`)**.
- **Arquivos Relacionados**:
  - `src/components/Menu/WhatsAppButton.tsx` (linhas 25–51)
  - `src/components/Carrosel/WhatsAppCTA/WhatsAppCTA.tsx` (linhas 74–86 — referência de comparação)
- **Descrição do Problema**:
  Em vez de renderizar um elemento semântico `<a href={whatsappUrl} target="_blank" rel="noopener noreferrer">` (como feito em `WhatsAppCTA.tsx` e `Carrosel.tsx`), `WhatsAppButton.tsx` renderiza um `<button type="button">` cujo `onClick` agenda um `window.setTimeout` de `500ms` para chamar `window.open(whatsappUrl, "_blank", "noopener,noreferrer")`.
- **Por que está errado (Justificativa Técnica)**:
  1. **Bloqueio Nativo de Pop-ups**: Navegadores modernos (especialmente Safari no iOS/macOS e Firefox com proteção rígida) exigem *Transient User Activation* síncrona para permitir `window.open`. Ao atrasar a chamada em `500ms` via `setTimeout`, a chamada sai do contexto direto do evento de clique confiável e pode ser bloqueada silenciosamente como pop-up indesejado.
  2. **HTML Semanticamente Incorreto**: A regra rápida do `AGENTS.md` proíbe *"HTML semanticamente incorreto"*. Um controle cuja única ação é navegar para uma URL externa (`https://wa.me/...`) deve ser um hiperlink `<a>`, preservando recursos nativos do navegador (preview de URL, abrir com botão do meio, copiar endereço do link).
  3. **Inconsistência Visual entre Entalhes de WhatsApp**: Tanto `WhatsAppCTA` (na Hero) quanto `WhatsAppButton` (no `MenuFeaturedStage`) são botões de pedido via WhatsApp posicionados dentro de um `NotchContainer placement="bottom-right"` sobre a foto do doce. Porém, um usa `<motion.a>` com fundo `var(--color-background)` e SVG oficial do WhatsApp, enquanto o outro usa `<button>` verde com ícone `MessageCircle` do Lucide.
- **Fontes Referenciadas**:
  - *AGENTS.md — Regras rápidas ("Zero gambiarras... ou HTML semanticamente incorreto")*.
  - *CXL & Baymard Institute* — remoção de obstáculos técnicos no clique de conversão (`docs/agents/code-review-workflow.md`, Seção 2.5).
  - *WAI-ARIA Authoring Practices Guide & HTML Living Standard (Links vs. Buttons)* (`docs/agents/code-review-workflow.md`, Seção 2.7).

---

### Achado 4.4 — Acoplamento Semântico Indevido: Uso do Token `--color-text-slide-1` na Seção `Menu`
- **Severidade**: Média
- **Estado nas Branches**: **Introduzido na branch atual (`refactoring/menu-editorial-layout`)**.
- **Arquivos Relacionados**:
  - `src/components/Menu/MenuFeaturedStage.module.scss` (linha 50)
  - `src/components/Menu/WhatsAppButton.module.scss` (linha 39)
  - `src/styles/_tokens.scss` (linhas 12–19)
- **Descrição do Problema**:
  Na branch atual, para definir a cor branca do texto sobre fundos escuros fixos na seção `Menu`, dois arquivos passaram a utilizar `color: var(--color-text-slide-1);`:
  1. `.priceGlassOverlay` em `MenuFeaturedStage.module.scss` (linha 50), sobre `background-color: var(--card-overlay-neutral-base)`.
  2. `&.whatsappTriggered` em `WhatsAppButton.module.scss` (linha 39), sobre `background-color: var(--color-whatsapp-dark)`.
- **Por que está errado (Justificativa Técnica)**:
  `--color-text-slide-1` pertence ao domínio exclusivo de `// --- Superfícies Dinâmicas dos Slides ---` da Hero. Reutilizá-lo na seção `Menu` como substituto genérico para `#ffffff` acopla o cardápio ao tema cromático do Slide 1 do carrossel. Caso o Slide 1 da Hero passe a ter superfície clara e texto escuro no futuro, o preço do cardápio e o texto do botão do WhatsApp ficarão escuros sobre fundo escuro (quebra de contraste WCAG AA). O Design System deve definir um token semântico próprio para texto sobre overlays escuros (ex.: `--color-text-on-overlay: #ffffff`).
- **Fontes Referenciadas**:
  - *CUBE CSS / BEM nos SCSS Modules (Andy Bell)* e *Sass Official Guidelines* — semântica e isolamento de tokens (`docs/agents/code-review-workflow.md`, Seção 2.4).
  - *Refactoring UI (Adam Wathan & Steve Schoger)* (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

### Achado 4.5 — `NotchContainer` em `MenuFeaturedStage` com Unidades Mistas (`px` fixos no TSX vs. `rem` no SCSS) e Sem Transição Sincronizada
- **Severidade**: Média
- **Estado nas Branches**: **Introduzido na branch atual (`refactoring/menu-editorial-layout`)**.
- **Arquivos Relacionados**:
  - `src/components/Menu/MenuFeaturedStage.tsx` (linhas 57–71)
  - `src/components/Menu/MenuFeaturedStage.module.scss` (linhas 75–84)
  - `src/components/Menu/WhatsAppButton.module.scss` (linha 9)
  - `src/sections/Menu.module.scss` (linha 11)
  - `docs/notch-design-system.md` (Seções 2, 6.3 e 8)
- **Descrição do Problema**:
  1. **Descompasso de unidades (`px` vs `rem`)**: Em `MenuFeaturedStage.tsx`, o `NotchContainer` é configurado com números em pixels:
     ```tsx
     concentric={{ innerRadius: 24, paddingOuter: 12, paddingInner: 0 }}
     ```
     Entretanto, o botão filho `.whatsappBtn` define `height: 3rem` (`WhatsAppButton.module.scss`, linha 9) e o wrapper `.ctaNotchWrapper` define `padding: var(--space-1-5) 0 0 var(--space-1-5)` (`0.75rem`, em `MenuFeaturedStage.module.scss`, linha 83). Se o usuário alterar o tamanho de fonte padrão do navegador (ex.: `1rem = 20px`), o botão terá `60px` de altura (`innerRadius` real = `30px`) e o colarinho terá `15px` (`paddingOuter` real = `15px`), mas o `NotchContainer` continuará aplicando `--notch-radius: 36px` e `--notch-fillet: 24px` calculados em `px` fixos.
  2. **Divergência na curva de transição de tema**: `Menu.module.scss` define `transition: background-color var(--duration-normal) var(--ease-smooth)` (`0.4s cubic-bezier(0.22, 1, 0.36, 1)`), mas `.ctaNotchWrapper` não declara `transition`, herdando `0.4s ease` de `NotchContainer.module.scss`. Ao alternar entre Light e Dark mode, o fundo do entalhe (`--notch-bg: var(--color-surface)`) e o fundo da seção `Menu` (`background-color: var(--color-surface)`) interpolam com curvas de tempo diferentes.
- **Por que está errado (Justificativa Técnica)**:
  Quebra a invariante matemática concêntrica (`raio externo = innerRadius + paddingOuter`) quando `rem != 16px` e gera artefato visual na borda do entalhe durante a transição de tema.
- **Fontes Referenciadas**:
  - *Manual Canônico do Sistema de Entalhe Concêntrico (`docs/notch-design-system.md`, Seções 2, 6.3 e 8)*.
  - *Modern CSS Standards (W3C / web.dev)* (`docs/agents/code-review-workflow.md`, Seção 2.4).

---

### Achado 4.6 — Gambiarra de Scroll em `handleScrollToOrder` para IDs Inexistentes (`#encomende-${tier}`)
- **Severidade**: Alta
- **Estado nas Branches**: Presente em `dev` e mantido na branch atual.
- **Arquivos Relacionados**:
  - `src/sections/Menu.tsx` (linhas 45–56)
  - `src/components/Menu/MenuFeaturedStage.tsx` (linha 96)
  - `src/utils/scrollToSection.ts` (linhas 5–15)
- **Descrição do Problema**:
  Ao clicar no botão `"Encomendar / Ver Opções"` em `MenuFeaturedStage`, a função `handleScrollToOrder` executa:
  ```tsx
  const tierTargetSelector = `#encomende-${tier}`;
  const genericTargetSelector = "#encomende";

  if (document.querySelector(tierTargetSelector)) {
    scrollToSection(tierTargetSelector);
  } else if (document.querySelector(genericTargetSelector)) {
    scrollToSection(genericTargetSelector);
  } else {
    scrollToSection(tierTargetSelector, { fallbackToBottom: true });
  }
  ```
- **Por que está errado (Justificativa Técnica)**:
  Nenhum dos seletores (`#encomende-pedidos-whatsapp`, `#encomende-encomendas` ou `#encomende`) existe no DOM. Como o usuário já está na última seção da página (`Menu`), o fallback `window.scrollTo({ top: document.body.scrollHeight })` apenas desloca a tela alguns pixels para baixo até o fim da própria seção `Menu`, tornando o botão `"Encomendar / Ver Opções"` funcionalmente inócuo. (Nota: na seção `About`, os cards existem com os IDs `#servico-delivery`, `#servico-encomendas` e `#servico-presentes`, que também não coincidem com `#encomende-${tier}`).
- **Fontes Referenciadas**:
  - *Regras Inegociáveis de Execução — Item 4 ("Zero gambiarras")* (`docs/agents/code-review-workflow.md`, Seção 3).
  - *Nielsen Norman Group* e *CXL & Baymard Institute* (`docs/agents/code-review-workflow.md`, Seção 2.5).

---

### Achado 4.7 — Caracteres Bullet (`"• "`) Hardcoded no JSX e `loading="eager"` Abaixo da Dobra
- **Severidade**: Baixa
- **Estado nas Branches**:
  - Bullets `"• "` hardcoded no JSX: **Introduzido na branch atual (`refactoring/menu-editorial-layout`)**.
  - `loading="eager"` na imagem do Menu: Presente em `dev` e mantido na branch atual.
- **Arquivos Relacionados**:
  - `src/components/Menu/MenuHeader.tsx` (linha 51)
  - `src/components/Menu/MenuFeaturedStage.tsx` (linhas 45, 84)
  - `src/sections/About.tsx` (linha 28 — referência de comparação)
- **Descrição do Problema**:
  1. Em `MenuHeader.tsx` (`• Cardápio & Coleções`) e `MenuFeaturedStage.tsx` (`• {item.subtitle}`), o caractere `"• "` foi inserido diretamente na string de texto de elementos que utilizam `@include mixins.eyebrow-editorial`. Na seção `About.tsx` (linha 28), o mesmo mixin `@include mixins.eyebrow-editorial` é utilizado sem bullet (`Nossa Filosofia`).
  2. Em `MenuFeaturedStage.tsx` (linha 45), a tag `<img>` da terceira seção da página está configurada com `loading="eager"`.
- **Por que está errado (Justificativa Técnica)**:
  1. O caractere `"•"` solto no nó de texto sem `aria-hidden="true"` (ou pseudoelemento CSS `::before`) é verbalizado por leitores de tela antes do título e quebra a padronização visual do mixin `eyebrow-editorial` entre as seções `About` e `Menu`.
  2. Configurar `loading="eager"` em uma imagem da 3ª seção força o navegador a baixá-la imediatamente no carregamento inicial da página, disputando largura de banda com a imagem principal da Hero (LCP).
- **Fontes Referenciadas**:
  - *Google web.dev — Core Web Vitals (LCP & Resource Prioritization)* (`docs/agents/code-review-workflow.md`, Seção 2.6).
  - *WCAG 2.2 Level AA* e *CUBE CSS / BEM (Andy Bell)* (`docs/agents/code-review-workflow.md`, Seções 2.4 e 2.7).

---

## Matriz Consolidada de Rastreabilidade

| ID | Seção / Escopo | Arquivos Afetados | Origem | Severidade | Fonte Principal Violada |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **0.1** | Global | `src/App.tsx` | `dev` + atual | **Alta** | WCAG 2.2 (2.3.3) / Motion 14 Docs |
| **0.2** | Global (`utils`) | `src/utils/whatsapp.ts`, `src/utils/constants.ts` | `dev` + atual | **Média** | Martin Fowler (Refactoring / DRY) |
| **0.3** | Global (`theme`) | `index.html`, `src/components/ThemeToggle/useTheme.ts` | `dev` + atual | **Baixa** | Design System Tokens (`_tokens.scss`) |
| **0.4** | Global (`HTML`) | `src/App.tsx`, `src/styles/globals.scss` | `dev` + atual | **Média** | WCAG 2.2 (2.4.1 Bypass Blocks) / WAI-ARIA |
| **1.1** | Topo (`Header`/`Toggle`) | `Header.module.scss`, `ThemeToggle.module.scss` | `dev` + atual | **Média** | Sass Guidelines / CUBE CSS / `_mixins.scss` |
| **1.2** | Topo (`Header`) | `src/components/Header/Header.module.scss` | `dev` + atual | **Média** | `docs/notch-design-system.md` (Seção 6.3) |
| **1.3** | Topo (`Header`) | `src/components/Header/Header.tsx` | `dev` + atual | **Alta** | Nielsen Norman Group / CXL & Baymard |
| **2.1** | Hero (`Carrosel`) | `src/components/Carrosel/Carrosel.tsx` | `dev` + atual | **Alta** | Google web.dev — Core Web Vitals (LCP) |
| **2.2** | Hero (`WhatsAppCTA`) | `WhatsAppCTA.tsx`, `WhatsAppCTA.module.scss` | `dev` + atual | **Alta** | `docs/notch-design-system.md` (Seções 2 e 8) |
| **2.3** | Hero (`Carrosel`) | `Carrosel.tsx`, `Carrosel.module.scss` | `dev` + atual | **Média** | Martin Fowler (Refactoring) / `AGENTS.md` |
| **2.4** | Hero (`CarroselDock`) | `CarroselDock.tsx`, `CarroselDock.module.scss` | `dev` + atual | **Média** | Paul Lewis (High Performance Animations / FLIP) |
| **2.5** | Hero (Controles) | `CarroselProgress.module.scss`, `CarroselDock.module.scss`, `WhatsAppCTA.module.scss` | `dev` + atual | **Média** | WCAG 2.2 (2.5.8 Target Size) / `_tokens.scss` |
| **2.6** | Hero (`Carrosel`) | `src/components/Carrosel/Carrosel.tsx` | `dev` + atual | **Média** | WAI-ARIA APG (Carousel Pattern) |
| **3.1** | About | `src/sections/About.tsx`, `src/utils/scrollToSection.ts` | `dev` + atual | **Alta** | Regras Inegociáveis (Zero Gambiarras) / NN/g |
| **3.2** | About & Menu | `MenuExpandButton.*`, `MenuFeaturedStage.*` | **Branch Atual** | **Média** | Thinking in React / Patterns.dev / DRY |
| **3.3** | About (`Card`) | `src/components/About/ServiceTierCard.module.scss` | `dev` + atual | **Baixa** | WCAG 2.2 (1.4.4 Resize Text) / Refactoring UI |
| **3.4** | About & Menu | `About.module.scss`, `MenuExpandButton.module.scss`, `ServiceTierCard.module.scss`, `MenuFeaturedStage.module.scss` | `dev` + atual | **Baixa** | Modern CSS Standards (W3C / web.dev) |
| **4.1** | Menu (`MenuHeader`) | `src/components/Menu/MenuHeader.tsx`, `src/sections/Menu.tsx` | `dev` + **Atual** | **Alta** | WAI-ARIA APG (Tabs Pattern) / WCAG 2.1.1 |
| **4.2** | Menu (`SelectorRail`) | `src/components/Menu/MenuSelectorRail.tsx` | **Branch Atual** | **Média** | WAI-ARIA APG (Listbox) / WCAG 1.1.1 |
| **4.3** | Menu (`WhatsAppButton`) | `src/components/Menu/WhatsAppButton.tsx` | `dev` + atual | **Alta** | `AGENTS.md` (HTML Semântico) / CXL & Baymard |
| **4.4** | Menu | `MenuFeaturedStage.module.scss`, `WhatsAppButton.module.scss` | **Branch Atual** | **Média** | CUBE CSS / Arquitetura de Design Tokens |
| **4.5** | Menu (`FeaturedStage`) | `MenuFeaturedStage.tsx`, `MenuFeaturedStage.module.scss`, `WhatsAppButton.module.scss` | **Branch Atual** | **Média** | `docs/notch-design-system.md` (Seções 2 e 6.3) |
| **4.6** | Menu | `src/sections/Menu.tsx` | `dev` + atual | **Alta** | Regras Inegociáveis (Zero Gambiarras) / NN/g |
| **4.7** | Menu | `MenuHeader.tsx`, `MenuFeaturedStage.tsx` | **Branch Atual** | **Baixa** | Google Core Web Vitals (LCP) / CUBE CSS |
