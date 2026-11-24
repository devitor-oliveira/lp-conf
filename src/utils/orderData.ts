import { ATELIER_CONTACT_INFO } from "./constants";
import { MENU_ITEMS } from "./mockdata";
import { WHATSAPP_PRESET_MESSAGES } from "./whatsapp";

export type OrderServiceTier = "pedidos-whatsapp" | "presentes" | "encomendas";

export interface OrderSelectIntentDetail {
  readonly tier: OrderServiceTier;
  readonly productName?: string;
}

export const ORDER_SELECT_TIER_EVENT = "lp-conf:select-order-tier";

export interface OrderOccasionOption {
  readonly value: OrderServiceTier;
  readonly label: string;
  readonly shortHint: string;
  readonly whatsappMessage: string;
}

export const ORDER_OCCASION_OPTIONS: readonly OrderOccasionOption[] = [
  {
    value: "encomendas",
    label: "Eventos & Lotes",
    shortHint: "Casamentos, celebrações e lotes corporativos (30 a 500+ un.)",
    whatsappMessage: WHATSAPP_PRESET_MESSAGES.encomendas,
  },
  {
    value: "pedidos-whatsapp",
    label: "Pronta-Entrega",
    shortHint: "Unidades frescas do dia com entrega em SP ou retirada no ateliê",
    whatsappMessage: WHATSAPP_PRESET_MESSAGES.delivery,
  },
  {
    value: "presentes",
    label: "Caixas para Presente",
    shortHint: "Embalagens rígidas climatizadas para envio em todo o Brasil",
    whatsappMessage: WHATSAPP_PRESET_MESSAGES.presentes,
  },
] as const;

export interface OrderMenuOption {
  readonly value: string;
  readonly label: string;
  readonly matchProductName?: string;
  readonly unitsPerBox?: number;
}

export interface OrderQuantityOption {
  readonly value: string;
  readonly label: string;
}

export interface OrderMessageContext {
  readonly name: string;
  readonly email: string;
  readonly occasionLabel: string;
  readonly productLabel: string;
  readonly quantityLabel: string;
  readonly eventDate?: string;
}

export interface OrderPresetMessage {
  readonly id: string;
  readonly label: string;
  readonly buildText: (ctx: OrderMessageContext) => string;
}

const GIFT_BOX_UNITS_BY_ID: Readonly<Record<string, number>> = {
  "caixa-degustacao-8": 8,
  "caixa-luxo-16": 16,
};

const singleAuthorItems: readonly OrderMenuOption[] = MENU_ITEMS.filter(
  (item) => item.targetServiceTier === "pedidos-whatsapp",
).map((item) => ({
  value: item.id,
  label: item.name,
  matchProductName: item.name,
}));

const giftBoxItems: readonly OrderMenuOption[] = MENU_ITEMS.filter(
  (item) => item.targetServiceTier === "presentes",
).map((item) => {
  const unitsPerBox = GIFT_BOX_UNITS_BY_ID[item.id];
  return {
    value: item.id,
    label: unitsPerBox
      ? `${item.name} — ${unitsPerBox} un./caixa`
      : `${item.name} (${item.portionsInfo})`,
    matchProductName: item.name,
    unitsPerBox,
  };
});

const eventItems: readonly OrderMenuOption[] = MENU_ITEMS.filter(
  (item) => item.targetServiceTier === "encomendas",
).map((item) => ({
  value: item.id,
  label: item.name,
  matchProductName: item.name,
}));

export const ORDER_MENU_OPTIONS_BY_TIER: Record<OrderServiceTier, readonly OrderMenuOption[]> = {
  encomendas: [
    ...eventItems,
    {
      value: "selecao-completa-sabores",
      label: "Seleção mista dos 3 sabores ícones",
    },
    ...singleAuthorItems,
  ],
  "pedidos-whatsapp": [
    ...singleAuthorItems,
    {
      value: "selecao-mista-dia",
      label: "Seleção mista de sabores do dia",
    },
  ],
  presentes: [
    ...giftBoxItems,
    {
      value: "recomendacao-presente",
      label: "Quero recomendação do atelier (8 ou 16 un./caixa)",
    },
  ],
};

interface GiftBoxQuantityDescriptor {
  readonly value: string;
  readonly baseLabel: string;
  readonly minBoxes: number;
  readonly maxBoxes?: number;
  readonly isOpenEnd?: boolean;
  readonly extraTag?: string;
}

const GIFT_BOX_QUANTITY_DESCRIPTORS: readonly GiftBoxQuantityDescriptor[] = [
  { value: "1-caixa", baseLabel: "1 caixa", minBoxes: 1, maxBoxes: 1 },
  { value: "2-caixas", baseLabel: "2 caixas", minBoxes: 2, maxBoxes: 2 },
  { value: "3-a-5-caixas", baseLabel: "3 a 5 caixas", minBoxes: 3, maxBoxes: 5 },
  { value: "6-a-10-caixas", baseLabel: "6 a 10 caixas", minBoxes: 6, maxBoxes: 10 },
  {
    value: "10-mais-caixas",
    baseLabel: "10+ caixas",
    minBoxes: 10,
    isOpenEnd: true,
    extraTag: "corporativo",
  },
];

const FALLBACK_MIN_BOX_UNITS = 8;
const FALLBACK_MAX_BOX_UNITS = 16;

function formatBoxQuantityLabel(
  descriptor: GiftBoxQuantityDescriptor,
  unitsPerBox?: number,
): string {
  const { baseLabel, minBoxes, maxBoxes, isOpenEnd, extraTag } = descriptor;

  if (unitsPerBox) {
    if (isOpenEnd) {
      const suffix = extraTag ? ` • ${extraTag}` : "";
      return `${baseLabel} (${minBoxes * unitsPerBox}+ un.${suffix})`;
    }
    if (maxBoxes && maxBoxes === minBoxes) {
      return `${baseLabel} (${minBoxes * unitsPerBox} un.)`;
    }
    if (maxBoxes) {
      return `${baseLabel} (${minBoxes * unitsPerBox} a ${maxBoxes * unitsPerBox} un.)`;
    }
  }

  if (isOpenEnd) {
    return extraTag ? `${baseLabel} (${extraTag})` : baseLabel;
  }
  if (maxBoxes && maxBoxes === minBoxes && minBoxes === 1) {
    return `${baseLabel} (${FALLBACK_MIN_BOX_UNITS} ou ${FALLBACK_MAX_BOX_UNITS} un.)`;
  }
  if (maxBoxes) {
    return `${baseLabel} (${minBoxes * FALLBACK_MIN_BOX_UNITS} a ${maxBoxes * FALLBACK_MAX_BOX_UNITS} un.)`;
  }
  return baseLabel;
}

export const ORDER_QUANTITY_OPTIONS_BY_TIER: Record<
  OrderServiceTier,
  readonly OrderQuantityOption[]
> = {
  encomendas: [
    { value: "30 unidades", label: "30 unidades" },
    { value: "50 unidades", label: "50 unidades" },
    { value: "100 unidades", label: "100 unidades" },
    { value: "200 unidades", label: "200 unidades" },
    { value: "300+ unidades (evento grande)", label: "300+ unidades (evento grande)" },
  ],
  "pedidos-whatsapp": [
    { value: "1 a 4 unidades", label: "1 a 4 unidades" },
    { value: "6 unidades", label: "6 unidades" },
    { value: "8 unidades", label: "8 unidades" },
    { value: "12 unidades", label: "12 unidades" },
    { value: "16+ unidades", label: "16+ unidades" },
  ],
  presentes: GIFT_BOX_QUANTITY_DESCRIPTORS.map((descriptor) => ({
    value: descriptor.value,
    label: formatBoxQuantityLabel(descriptor),
  })),
};

export function getQuantityOptionsForTier(
  tier: OrderServiceTier,
  unitsPerBox?: number,
): readonly OrderQuantityOption[] {
  if (tier !== "presentes") {
    return ORDER_QUANTITY_OPTIONS_BY_TIER[tier];
  }

  return GIFT_BOX_QUANTITY_DESCRIPTORS.map((descriptor) => ({
    value: descriptor.value,
    label: formatBoxQuantityLabel(descriptor, unitsPerBox),
  }));
}

function formatEventDateBr(isoDate?: string): string | undefined {
  if (!isoDate) return undefined;
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function buildMessageEnvelope(body: string, ctx: OrderMessageContext): string {
  const trimmedName = ctx.name.trim();
  const trimmedEmail = ctx.email.trim();
  const formattedDate = formatEventDateBr(ctx.eventDate);

  const greeting = trimmedName ? `Olá! Meu nome é ${trimmedName}.` : "Olá!";
  const dateSegment = formattedDate ? ` Data prevista: ${formattedDate}.` : "";
  const emailSegment = trimmedEmail ? ` E-mail para retorno: ${trimmedEmail}.` : "";

  return `${greeting} ${body}${dateSegment}${emailSegment}`;
}

export const ORDER_PRESET_MESSAGES_BY_TIER: Record<
  OrderServiceTier,
  readonly OrderPresetMessage[]
> = {
  encomendas: [
    {
      id: "orcamento-degustacao",
      label: "Solicitar orçamento + degustação guiada",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de solicitar um orçamento para ${ctx.quantityLabel} de ${ctx.productLabel} e consultar disponibilidade para degustação guiada.`,
          ctx,
        ),
    },
    {
      id: "mesa-casamento",
      label: "Montar mesa para casamento ou festa",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Estamos planejando uma celebração e gostaríamos de orçamento para cerca de ${ctx.quantityLabel} (${ctx.productLabel}), com orientações de entrega e montagem.`,
          ctx,
        ),
    },
    {
      id: "lote-corporativo",
      label: "Encomenda corporativa com nota fiscal",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de cotar ${ctx.quantityLabel} (${ctx.productLabel}) para um evento corporativo, com informações sobre faturamento e nota fiscal.`,
          ctx,
        ),
    },
  ],
  "pedidos-whatsapp": [
    {
      id: "disponibilidade-hoje",
      label: "Consultar disponibilidade para hoje",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de verificar a disponibilidade hoje para ${ctx.quantityLabel} de ${ctx.productLabel} e confirmar o tempo de entrega.`,
          ctx,
        ),
    },
    {
      id: "retirada-atelier",
      label: "Reservar para retirada no ateliê",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de reservar ${ctx.quantityLabel} de ${ctx.productLabel} para retirada presencial no ateliê em Pinheiros.`,
          ctx,
        ),
    },
    {
      id: "duvida-sabores",
      label: "Tirar dúvida sobre sabores frescos do dia",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Tenho interesse em ${ctx.quantityLabel} de ${ctx.productLabel} e gostaria de confirmar os sabores disponíveis na fornada de hoje.`,
          ctx,
        ),
    },
  ],
  presentes: [
    {
      id: "presente-dedicatoria",
      label: "Presente com dedicatória manuscrita",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de encomendar ${ctx.quantityLabel} de ${ctx.productLabel} para presentear, incluindo dedicatória manuscrita no cartão.`,
          ctx,
        ),
    },
    {
      id: "envio-climatizado",
      label: "Consultar envio climatizado para outro estado",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de encomendar ${ctx.quantityLabel} de ${ctx.productLabel} e calcular o prazo de envio climatizado para meu CEP.`,
          ctx,
        ),
    },
    {
      id: "presentes-corporativos",
      label: "Presentes corporativos personalizados",
      buildText: (ctx) =>
        buildMessageEnvelope(
          `Gostaria de cotar ${ctx.quantityLabel} de ${ctx.productLabel} para presenteação corporativa, com detalhes sobre personalização e prazos.`,
          ctx,
        ),
    },
  ],
};

export interface OrderFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const ORDER_FAQ_ITEMS: readonly OrderFaqItem[] = [
  {
    id: "faq-antecedencia",
    question: "Qual a antecedência recomendada para grandes eventos e lotes?",
    answer:
      "Para mesas de doces completas e casamentos (acima de 100 unidades), recomendamos agendar com 15 a 30 dias de antecedência para garantir a degustação e reserva de agenda. Para caixas de presente e pequenos lotes (até 50 unidades), o prazo mínimo é de 48 horas.",
  },
  {
    id: "faq-climatizacao",
    question: "Como funciona a embalagem climatizada para presentes e entregas?",
    answer:
      "Todas as caixas para presente e entregas de longa distância são acondicionadas em embalagens rígidas com isolamento térmico e lacre de segurança, preservando a textura aveludada do cacau e o frescor botânico até o destino final.",
  },
  {
    id: "faq-restricoes",
    question: "Há opções com restrições alimentares ou doçura reduzida?",
    answer:
      "Nossa linha autoral utiliza cacau agroecológico de origem com redução natural de açúcares refinados em todas as receitas. Também produzimos seleções específicas sem glúten ou sem lácteos sob consulta prévia de ingredientes.",
  },
  {
    id: "faq-pagamento",
    question: "Quais as formas de pagamento aceitas pelo atelier?",
    answer:
      "Aceitamos PIX com confirmação instantânea, cartões de crédito em até 3x sem juros para pedidos avulsos ou eventos, e faturamento via nota fiscal com entrada programada para demandas corporativas.",
  },
] as const;

export { ATELIER_CONTACT_INFO };
