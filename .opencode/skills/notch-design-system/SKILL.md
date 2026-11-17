---
name: notch-design-system
description: Use when creating, reviewing, or refactoring NotchContainer, notch-corner, entalhe, concentric notch geometry, paddingOuter, innerRadius, or notch-related UI in lp-conf.
---

# Notch Design System — lp-conf

Use esta skill sempre que a tarefa envolver `NotchContainer`, o mixin `notch-corner`, entalhes concêntricos, colarinhos, filetes côncavos ou qualquer UI que pareça esculpida na superfície da seção.

## Fonte de verdade

Leia o código antes de propor mudanças:

- `src/components/Notch/NotchContainer.tsx` — componente público.
- `src/components/Notch/types.ts` — props e tipos.
- `src/components/Notch/useNotch.ts` — memoização e variáveis CSS.
- `src/components/Notch/notchUtils.ts` — fórmulas concêntricas.
- `src/components/Notch/biarc.ts` — geometria da variante `smooth`.
- `src/components/Notch/NotchContainer.module.scss` — estilos base.
- `src/styles/_mixins.scss` — mixins `notch-variables`, `notch-concentric` e `notch-corner`.
- `docs/notch-design-system.md` — manual completo com exemplos.

## Modelo mental

O entalhe é composto por:

1. **Canto convexo** no container externo (`border-radius`).
2. **Dois filetes côncavos** (`::before` e `::after`) que fazem a concordância com a superfície adjacente.
3. **Colarinho** (`paddingOuter`) entre o elemento interno e a curva externa.
4. **Offset** (`offsetX`/`offsetY`) entre o entalhe e a borda da seção, imagem ou dock.

Nenhum componente deve definir raio ou filete arbitrariamente. Toda a geometria deriva da pílula interna, dos paddings e dos tokens.

## Fórmulas canônicas

Para pílulas e círculos:

```text
innerRadius = altura da pílula / 2
radius      = innerRadius + paddingOuter
fillet      = max(0, paddingInner + innerRadius - offset)
```

`paddingInner` é o padding voltado para a borda externa. Quando omitido, `calculateConcentricNotch` usa `paddingOuter`. Quando `paddingInner = offset`, o filete resultante é igual a `innerRadius`.

Para retângulos arredondados, `innerRadius` é o `border-radius` real do elemento interno, não necessariamente metade da altura. Exemplo atual: o Header usa `innerRadius = 32` com uma pílula de `56px` de altura e `border-radius: 32px`.

### Equação de fechamento da caixa

Em containers com dimensão fixa:

```text
dimensão da caixa = offset + raio + filete
filete            = dimensão da caixa - offset - raio
```

Se a soma ultrapassar a dimensão da caixa, aparecem “chifres” ou degraus retos. Em anéis secundários, recalcule o filete analiticamente; não reutilize o filete do anel primário.

## Matriz de quadrantes

| `placement` | Curva convexa | Abas côncavas | Padding do container |
| --- | --- | --- | --- |
| `top-left` | `border-bottom-right-radius` | Direita (`top: 0; left: 100%`) e abaixo (`top: 100%; left: 0`) | `offsetY paddingOuter paddingOuter offsetX` |
| `top-right` | `border-bottom-left-radius` | Esquerda (`top: 0; right: 100%`) e abaixo (`top: 100%; right: 0`) | `offsetY offsetX paddingOuter paddingOuter` |
| `bottom-left` | `border-top-right-radius` | Direita (`bottom: 0; left: 100%`) e acima (`bottom: 100%; left: 0`) | `paddingOuter paddingOuter offsetY offsetX` |
| `bottom-right` | `border-top-left-radius` | Esquerda (`bottom: 0; right: 100%`) e acima (`bottom: 100%; right: 0`) | `paddingOuter offsetX offsetY paddingOuter` |

Erro histórico: no `bottom-right`, a curva fica no topo e à esquerda. Aplicar padding à direita afasta o botão da quina externa e elimina o colarinho onde ele é necessário.

## `top-center` e variante `smooth`

`NotchContainer` também aceita `placement="top-center"`. Para a transição suave usada no carrossel:

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
</NotchContainer>
```

- `variant="smooth"` só tem efeito visual com `placement="top-center"`.
- `angle` é a angulação máxima da rampa (graus ou string com `deg`).
- `radius` é o raio convexo inferior desejado.
- `smoothHeight` é a altura líquida da aba; quando omitido, é derivado de `2 * innerRadius + paddingOuter`.
- A geometria é gerada por bi-arcos SVG em `biarc.ts` e memoizada em `useNotch`.
- As asas SVG são decorativas (`aria-hidden`), com `pointer-events: none`.

## Padding, offset e tokens

- `paddingOuter` canônico: **12px** no desktop. No mobile pode ser proporcional (o ThemeToggle usa 8px).
- `offsetX`/`offsetY`: distância até a superfície adjacente. Em entalhes ancorados na janela/Hero, use `var(--layout-stage-margin)` (8px).
- `--layout-stage-margin` é offset, não colarinho. Não confunda os dois.
- Tokens relevantes em `src/styles/_tokens.scss`: `--layout-stage-margin`, `--radius-max`, `--color-background`, `--ease-smooth`, `--duration-slow`.
- Variáveis CSS geradas: `--notch-radius`, `--notch-fillet`, `--notch-offset-x`, `--notch-offset-y`, `--notch-bg`, `--notch-aa`, `--notch-angle`, `--notch-shadow`, `--notch-smooth-total-height`.

## Transição de cor

O componente base `NotchContainer.module.scss` usa:

```scss
transition: --notch-bg 0.4s ease, background-color 0.4s ease;
```

Quando o entalhe precisa acompanhar a cor viva da Hero/Carrossel, o wrapper do consumidor deve declarar a transição sincronizada:

```scss
transition:
  --notch-bg 0.6s cubic-bezier(0.22, 1, 0.36, 1),
  background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
```

Isso já é feito em `Header`, `ThemeToggle`, `WhatsAppCTA` e `Carrosel`. Não assuma que a transição de 0.6s vem do componente base.

## Padrão de implementação

```tsx
import { NotchContainer } from "@/components/Notch";
import styles from "./MeuBotao.module.scss";

export function MeuBotao() {
  return (
    <NotchContainer
      as="div"
      placement="bottom-right"
      concentric={{
        innerRadius: 24,
        paddingOuter: 12,
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

```scss
.notchWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // bottom-right: colarinho no topo e à esquerda
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

## Exemplos atuais no projeto

- **Header**: `top-left`, `innerRadius=32`, `paddingOuter=12`, `paddingInner=var(--layout-stage-margin)`, offset `var(--layout-stage-margin)`.
- **ThemeToggle**: `top-right`, `innerRadius=28`, `paddingOuter=12` no desktop e `8` no mobile, offset `var(--layout-stage-margin)`.
- **WhatsAppCTA**: `bottom-right`, `innerRadius=24`, `paddingOuter=12`, `paddingInner=0`, offsets `0`.
- **CarroselProgress**: `top-center`, `variant="smooth"`, `angle=48`, `radius=32`, `smoothHeight=32`, `offsetY=0`.
- **Carrosel / ThemeToggleCollar**: anel secundário decorativo; recalcule o filete pela equação de fechamento e confira as dimensões reais no SCSS.

## Ancoragem e colisões

- Entalhe na borda da janela/Hero: ancore em `top: 0; left: 0` (ou `right: 0`) e use offsets iguais a `var(--layout-stage-margin)`.
- Entalhe em elemento interno (foto, canvas, dock): ancore nas bordas do elemento e use `offsetX/offsetY` iguais a 0 quando as bordas externas coincidirem.
- Respeite o `z-index` de docks e barras contínuas. O WhatsAppCTA, por exemplo, usa `z-index: 25` para ficar acima da dock.
- Verifique o respiro vertical: `bottom: 1.5rem` deixa 8px acima da dock de 16px.

## Checklist de validação

- [ ] `innerRadius` corresponde à metade da altura (pílula/círculo) ou ao `border-radius` real (retângulo).
- [ ] `paddingOuter` está em 12px no desktop ou proporcional no mobile.
- [ ] O colarinho está nos lados internos do recorte, e os lados externos usam offset.
- [ ] O filete foi derivado da fórmula, não copiado de outro componente.
- [ ] A equação de fechamento da caixa foi conferida em containers fixos.
- [ ] A transição de 0.6s está no wrapper quando há sincronização de cor.
- [ ] Não há colisão com docks, barras ou bordas da janela.
- [ ] `top-center` usa `variant="smooth"` e as props corretas.
- [ ] `npm run check`, `npm run typecheck` e `npm run build` passam.
- [ ] Nenhum link absoluto `file:///` foi introduzido.
