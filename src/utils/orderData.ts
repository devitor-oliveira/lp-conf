import { WHATSAPP_PRESET_MESSAGES } from "./whatsapp";

export interface OrderProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface OrderWhatsAppChannel {
  readonly id: string;
  readonly badge?: string;
  readonly tag: string;
  readonly title: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly ctaLabel: string;
  readonly whatsappMessage: string;
  readonly ariaLabel: string;
  readonly isFeatured?: boolean;
}

export interface OrderFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const ORDER_PROCESS_STEPS: readonly OrderProcessStep[] = [
  {
    number: "01",
    title: "Escolha a Ocasião",
    description:
      "Defina se o pedido é para grandes eventos, presentes especiais ou desejo imediato.",
  },
  {
    number: "02",
    title: "Alinhe os Detalhes",
    description:
      "Converse pelo WhatsApp ou envie uma proposta formal por e-mail com sabores e datas.",
  },
  {
    number: "03",
    title: "Receba com Frescor",
    description:
      "Produção artesanal em pequenos lotes no dia e entrega climatizada com hora marcada.",
  },
] as const;

export const ORDER_WHATSAPP_CHANNELS: readonly OrderWhatsAppChannel[] = [
  {
    id: "encomende-encomendas",
    tag: "Lotes de 30 a 500+ un.",
    title: "Encomendas para Eventos",
    description:
      "Consultoria dedicada para casamentos, celebrações familiares e eventos corporativos com degustação prévia.",
    highlights: [
      "Cardápio sob medida com notas florais e cacau de origem",
      "Caixa de degustação guiada sob agendamento",
      "Coordenação direta com cerimonial e entrega montada",
    ],
    ctaLabel: "Solicitar Orçamento no WhatsApp",
    whatsappMessage: WHATSAPP_PRESET_MESSAGES.encomendas,
    ariaLabel: "Solicitar orçamento de eventos pelo WhatsApp (abre em nova aba)",
    isFeatured: false,
  },
  {
    id: "encomende-pedidos-whatsapp",
    badge: "Mais Solicitado",
    tag: "Pronta-Entrega & Presentes",
    title: "Pedidos do Dia & Caixas",
    description:
      "Atendimento ágil em tempo real para unidades avulsas, caixas rígidas para presente e entrega expressa.",
    highlights: [
      "Fornadas diárias frescas sem conservantes",
      "Entrega rápida em São Paulo ou retirada no ateliê",
      "Embalagens térmicas e cartão com dedicatória manuscrita",
    ],
    ctaLabel: "Pedir Agora no WhatsApp",
    whatsappMessage: WHATSAPP_PRESET_MESSAGES.delivery,
    ariaLabel:
      "Fazer pedido rápido ou solicitar caixas de presente pelo WhatsApp (abre em nova aba)",
    isFeatured: true,
  },
] as const;

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

export const ATELIER_CONTACT_INFO = {
  brandName: "Atelier de Alta Confeitaria",
  tagline: "Cacau agroecológico, botânica brasileira e confeitaria de tempo lento.",
  addressLine1: "Rua dos Pinheiros, 840 — Pinheiros",
  addressLine2: "São Paulo, SP • CEP 05422-001",
  hoursLabel: "Terça a Domingo, das 10h às 19h",
  email: "atendimento@atelierconfeitaria.com.br",
  instagramUrl: "https://instagram.com",
  instagramHandle: "@atelierconfeitaria",
} as const;
