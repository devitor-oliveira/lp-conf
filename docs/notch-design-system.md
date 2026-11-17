# Manual Canônico do Sistema de Entalhe Concêntrico (Notch Design System)

> **Status**: documento de referência normativa e padrão arquitetural
> **Escopo**: todos os componentes, seções e botões que utilizam `NotchContainer` ou o mixin `notch-corner`.

---

## 1. Princípios fundamentais

O sistema de entalhes concêntricos é o coração da identidade visual do atelier. Ele cria curvas contínuas, orgânicas e artesanais onde elementos de interface parecem esculpidos diretamente na superfície de fundo.

Para que as curvas sejam visualmente impecáveis e tangentes (continuidade G1), **nenhum componente deve definir valores de raio ou filete de forma arbitrária**. Toda a geometria deve derivar analiticamente das dimensões da pílula interna e dos tokens do design system.

---

## 2. Fórmula matemática concêntrica

Para qualquer pílula ou botão envolvido por um entalhe:

```text
innerRadius = altura da pílula / 2
raio externo do entalhe = innerRadius + paddingOuter
filete côncavo tangente = max(0, paddingInner + innerRadius - offset)
```

Quando `paddingInner = offset`, o filete resultante é igual a `innerRadius`.

Para retângulos arredondados, `innerRadius` é o `border-radius` real do elemento interno, não necessariamente metade da altura. Exemplo atual: o Header usa `innerRadius = 32` com uma pílula de `56px` de altura e `border-radius: 32px`.

### Tokens canônicos

- **`paddingOuter` = 12px**: espessura contínua e universal da “gola” (colarinho) do entalhe no desktop. No mobile pode ser proporcional (o ThemeToggle usa 8px).
- **`offsetX` / `offsetY`**: distância até a superfície adjacente. Em entalhes ancorados na janela/Hero, use `var(--layout-stage-margin)` (8px).
- **`--layout-stage-margin`**: token de offset, não de colarinho. Não confunda com `paddingOuter`.
- **Transição sincronizada**: `--notch-bg 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1)` nos wrappers que acompanham a cor da Hero/Carrossel.

---

## 3. Matriz de quadrantes e regra de simetria do padding

> **Erro histórico prevenido**: no entalhe `bottom-right`, a curva de recorte na imagem fica no **topo** e na **esquerda**. Aplicar padding na direita afasta o botão da quina externa e elimina o colarinho onde ele é necessário.

Cada quadrante de `placement` projeta sua concavidade para o interior da seção e apoia sua quina externa na borda adjacente:

```text
┌────────────────────────────────────────────────────────┐
│ [top-left]                                [top-right]  │
│ Curva: Bottom-Right                       Curva: Bottom-Left
│ Colarinho: Dir + Baixo                    Colarinho: Esq + Baixo
│ Externo: Top + Esq                        Externo: Top + Dir
│                                                        │
│ [bottom-left]                          [bottom-right]  │
│ Curva: Top-Right                          Curva: Top-Left
│ Colarinho: Dir + Cima                     Colarinho: Esq + Cima
│ Externo: Baixo + Esq                      Externo: Baixo + Dir
└────────────────────────────────────────────────────────┘
```

### Tabela de configuração por posição

| `placement`        | Curva convexa                | Abas côncavas (`::before` / `::after`)                                  | Padding no container SCSS                            |
| :----------------- | :--------------------------- | :---------------------------------------------------------------------- | :--------------------------------------------------- |
| **`top-left`**     | `border-bottom-right-radius` | Direita (`top: 0; left: 100%`)<br>Abaixo (`top: 100%; left: 0`)         | `padding: offsetY paddingOuter paddingOuter offsetX` |
| **`top-right`**    | `border-bottom-left-radius`  | Esquerda (`top: 0; right: 100%`)<br>Abaixo (`top: 100%; right: 0`)      | `padding: offsetY offsetX paddingOuter paddingOuter` |
| **`bottom-left`**  | `border-top-right-radius`    | Direita (`bottom: 0; left: 100%`)<br>Acima (`bottom: 100%; left: 0`)    | `padding: paddingOuter paddingOuter offsetY offsetX` |
| **`bottom-right`** | `border-top-left-radius`     | Esquerda (`bottom: 0; right: 100%`)<br>Acima (`bottom: 100%; right: 0`) | `padding: paddingOuter offsetX offsetY paddingOuter` |

### `top-center` e variante `smooth`

`NotchContainer` também aceita `placement="top-center"`. A variante `smooth` é usada no `CarroselProgress` e gera asas SVG com bi-arcos:

```tsx
<NotchContainer
  as="div"
  placement="top-center"
  variant="smooth"
  angle={48}
  radius={32}
  smoothHeight={32}
  offsetY={0}
>
  {/* conteúdo */}
</NotchContainer>;
```

- `variant="smooth"` só tem efeito visual com `placement="top-center"`.
- `angle` é a angulação máxima da rampa (graus ou string com `deg`).
- `radius` é o raio convexo inferior desejado.
- `smoothHeight` é a altura líquida da aba; quando omitido, é derivado de `2 * innerRadius + paddingOuter`.
- A geometria é gerada em `src/components/Notch/biarc.ts` e memoizada em `src/components/Notch/useNotch.ts`.
- As asas SVG são decorativas (`aria-hidden`) e usam `pointer-events: none`.

---

## 4. Sistemas de múltiplos anéis e a equação de fechamento da caixa

> **Equação de fechamento obrigatória**
> Em qualquer container com largura/altura fixas, para que as abas côncavas `::before` e `::after` encontrem a curva convexa sem degraus retos nem transbordar em “chifres” pontiagudos:
>
> ```text
> dimensão da caixa = offset + raio + filete
> filete            = dimensão da caixa - offset - raio
> ```

### Anel primário e anel secundário

1. **Anel primário (elemento → entalhe)**:
   - Exemplos: `Header`, `ThemeToggle` e `WhatsAppCTA`.
   - O container envolve diretamente um botão ou pílula. As dimensões são flexíveis e o filete pode seguir a regra canônica `filete = innerRadius`.
2. **Anel secundário (entalhe → colarinho decorativo externo)**:
   - Exemplo: `.themeToggleCollar` em `Carrosel`.
   - Ele envolve o ThemeToggle inteiro para recortar a foto do doce com a cor da Hero.
   - Recalcule o filete analiticamente com a equação de fechamento. Não reutilize o filete do anel primário e não copie valores antigos de 80px: confira as dimensões reais em `ThemeToggle.module.scss` e `Carrosel.module.scss`.

---

## 5. Ancoragem em relação a seções e docks

Ao posicionar um entalhe no layout, avalie se ele está na **borda externa da janela** ou na **moldura de um elemento interno**:
1. **Entalhe na borda da janela / Hero**:
   - Exemplos: `Header` e `ThemeToggle`.
   - Ancorado em `top: 0; left: 0` (ou `right: 0`).
   - Usa `offsetX = offsetY = "var(--layout-stage-margin)"`.
2. **Entalhe em elemento interno com margens / dock**:
   - Exemplo: `WhatsAppCTA` recortando a foto (`.canvasFrame`).
   - A foto possui `inset: var(--canvas-edge-inset) var(--canvas-edge-inset) 1.5rem var(--canvas-edge-inset)`.
   - Na base existe a dock com altura de 16px e `z-index: 20`.
   - O entalhe deve ser ancorado em:
     - `right: var(--canvas-edge-inset)` (8px);
     - `bottom: 1.5rem` (24px), proporcionando 8px de respiro acima da dock;
     - `z-index: 25`, com prioridade física e de eventos sobre a dock;
     - `offsetX = offsetY = 0`, pois as bordas externas coincidem com a foto.

---

## 6. Implementação canônica em código

### 6.1. Componente TSX

```tsx
import { NotchContainer } from "@/components/Notch";
import styles from "./MeuBotao.module.scss";

export interface MeuBotaoProps {
  color?: string;
  innerRadius?: number | string;
  paddingOuter?: number | string;
}

export function MeuBotao({ color, innerRadius = 24, paddingOuter = 12 }: MeuBotaoProps) {
  return (
    <NotchContainer
      as="div"
      placement="bottom-right"
      color={color}
      concentric={{
        innerRadius,
        paddingOuter,
        paddingInner: 0,
      }}
      offsetX={0}
      offsetY={0}
      className={styles.notchWrapper}
    >
      <button type="button" className={styles.buttonPill}>
        Meu Botão
      </button>
    </NotchContainer>
  );
}
```

### 6.2. Módulo SCSS

```scss
@use "@/styles/mixins" as mixins;

.notchWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // Para bottom-right: colarinho no topo e à esquerda.
  padding: 12px 0 0 12px;
  transition:
    --notch-bg 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.buttonPill {
  height: 48px;
  border-radius: 100px;
  background-color: var(--color-background);
  color: var(--color-text);
}
```

### 6.3. Transição de cor

O componente base `src/components/Notch/NotchContainer.module.scss` usa:

```scss
transition: --notch-bg 0.4s ease, background-color 0.4s ease;
```

Quando o entalhe precisa acompanhar a cor viva da Hero/Carrossel, o wrapper do consumidor deve declarar a transição sincronizada de 0.6s. Isso já é feito em `Header`, `ThemeToggle`, `WhatsAppCTA` e `Carrosel`.

---

## 7. Exemplos atuais no projeto

- **Header**: `top-left`, `innerRadius=32`, `paddingOuter=12`, `paddingInner=var(--layout-stage-margin)`, offset `var(--layout-stage-margin)`.
- **ThemeToggle**: `top-right`, `innerRadius=28`, `paddingOuter=12` no desktop e `8` no mobile, offset `var(--layout-stage-margin)`.
- **WhatsAppCTA**: `bottom-right`, `innerRadius=24`, `paddingOuter=12`, `paddingInner=0`, offsets `0`.
- **CarroselProgress**: `top-center`, `variant="smooth"`, `angle=48`, `radius=32`, `smoothHeight=32`, `offsetY=0`.
- **Carrosel / ThemeToggleCollar**: anel secundário decorativo; recalcule o filete pela equação de fechamento e confira as dimensões reais no SCSS.

---

## 8. Checklist de validação obrigatório

- [ ] **1. Raio base (`innerRadius`)**: é exatamente igual à metade da altura (pílula/círculo) ou ao `border-radius` real (retângulo)?
- [ ] **2. Colarinho (`paddingOuter`)**: está em 12px no desktop ou proporcional no mobile?
- [ ] **3. Orientação do padding**: o colarinho de 12px está nos lados internos do recorte, e os lados externos usam offset?
- [ ] **4. Filete**: foi derivado da fórmula e não copiado de outro componente?
- [ ] **5. Equação de fechamento**: em containers fixos, `dimensão = offset + raio + filete`?
- [ ] **6. Transição sincronizada**: o wrapper usa `--notch-bg 0.6s cubic-bezier(0.22, 1, 0.36, 1)` quando há sincronização de cor?
- [ ] **7. Conflito com docks ou barras**: o posicionamento vertical e o `z-index` evitam colisões?
- [ ] **8. `top-center`**: usa `variant="smooth"` com `angle`, `radius` e `smoothHeight` corretos?
- [ ] **9. Verificação no Biome e TypeScript**: `npm run check` e `npm run typecheck` sem erros?
- [ ] **10. Build**: `npm run build` bem-sucedido?

---

## 9. Erros comuns

- Copiar `filletSize` de outro componente sem recalcular com o offset e o padding corretos.
- Usar `paddingOuter` no lugar de `offsetX`/`offsetY` (ou vice-versa).
- Aplicar padding no lado errado do quadrante e eliminar o colarinho.
- Assumir que a transição de 0.6s vem do componente base; ela precisa estar no wrapper.
- Usar `variant="smooth"` com placement diferente de `top-center`.
- Introduzir links absolutos `file:///` ou valores mágicos fora dos tokens.
