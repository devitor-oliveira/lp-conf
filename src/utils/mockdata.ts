import YellowHeroIMG from "@/assets/doce-banoffee-cutout.png";
import GreenHeroIMG from "@/assets/doce-verde-bg-removebg-preview.png";
import RedHeroIMG from "@/assets/doce-vermelho-bg-removebg-preview.png";
import type { HeroHighlight } from "@/components/Carrosel/HeroHighlights/HeroHighlights";
import { MENU_ITEM_IMAGES } from "@/utils/constants";

export interface HeroFloatingPill {
  readonly id: string;
  readonly label: string;
  /** Coordenada normalizada (0..1) na caixa da imagem cutout para ancorar a curva SVG */
  readonly anchor: { readonly x: number; readonly y: number };
  /** Ângulo radial em graus (0° = direita, 90° = baixo, 180° = esquerda, -90° = topo) */
  readonly angleDeg: number;
  /** Fator opcional de afastamento além do raio efetivo da imagem (padrão: 1.0) */
  readonly radiusMultiplier?: number;
}

export interface Slide {
  readonly id: number;
  readonly number: string;
  readonly name: string;
  readonly eyebrow?: string;
  readonly title: string;
  readonly description: string;
  readonly highlights: readonly HeroHighlight[];
  readonly image: string;
  readonly alt?: string;
  readonly cutoutScale?: number;
  readonly cutoutOffsetX?: string;
  readonly cutoutOffsetY?: string;
  readonly cutoutShadowBottom?: string;
  readonly floatingPills?: readonly HeroFloatingPill[];
  readonly textColorToken?: string;
  readonly surfaceColorToken: string;
}

export const SLIDES: Slide[] = [
  {
    id: 1,
    number: "01",
    name: "Frutas Vermelhas",
    eyebrow: "Atelier de Alta Confeitaria",
    title: "Confeitaria artesanal fresca todo dia.",
    description:
      "Sobremesas em camadas feitas à mão em pequenos lotes diários, combinando frutas frescas selecionadas, creme aveludado e pão de ló leve com dulçor na medida certa.",
    highlights: [
      { id: "01-hand", icon: "hand", label: "Feito à mão" },
      { id: "01-layers", icon: "layers", label: "Pequeno lote" },
      { id: "01-leaf", icon: "leaf", label: "Ingredientes selecionados" },
    ],
    image: RedHeroIMG,
    alt: "Sobremesa artesanal em pote de vidro em camadas com creme branco, geleia de frutas vermelhas, pão de ló, morangos e framboesas frescas",
    cutoutScale: 1.42,
    cutoutOffsetX: "-3.5%",
    cutoutOffsetY: "2%",
    cutoutShadowBottom: "-1%",
    floatingPills: [
      {
        id: "frutas-topo",
        label: "Morangos & framboesas",
        anchor: { x: 0.56, y: 0.24 },
        angleDeg: -50,
        radiusMultiplier: 1.08,
      },
      {
        id: "frutas-meio",
        label: "Creme & geleia artesanal",
        anchor: { x: 0.36, y: 0.54 },
        angleDeg: 174,
        radiusMultiplier: 1.04,
      },
      {
        id: "frutas-base",
        label: "Pão de ló artesanal",
        anchor: { x: 0.62, y: 0.78 },
        angleDeg: 48,
        radiusMultiplier: 1.12,
      },
    ],
    surfaceColorToken: "var(--color-surface-slide-1)",
    textColorToken: "var(--color-text-slide-1)",
  },
  {
    id: 2,
    number: "02",
    name: "Banoffee Artesanal",
    eyebrow: "Edições Especiais",
    title: "Presentes que marcam o paladar.",
    description:
      "Camadas de doce de leite cremoso, banana caramelizada, chantilly fresco e base crocante preparadas para transformar gestos de carinho em memórias inesquecíveis.",
    highlights: [
      { id: "02-gift", icon: "gift", label: "Pronto para presentear" },
      { id: "02-package", icon: "package", label: "Embalagem cuidada" },
      { id: "02-sparkles", icon: "sparkles", label: "Para ocasiões especiais" },
    ],
    image: YellowHeroIMG,
    alt: "Banoffee pie artesanal em pote de vidro com banana caramelizada, chantilly e folhas de hortelã",
    floatingPills: [
      {
        id: "banoffee-topo",
        label: "Chantilly & cacau",
        anchor: { x: 0.55, y: 0.26 },
        angleDeg: -48,
        radiusMultiplier: 1.08,
      },
      {
        id: "banoffee-meio",
        label: "Banana & doce de leite",
        anchor: { x: 0.38, y: 0.55 },
        angleDeg: 176,
        radiusMultiplier: 1.04,
      },
      {
        id: "banoffee-base",
        label: "Base crocante artesanal",
        anchor: { x: 0.62, y: 0.8 },
        angleDeg: 48,
        radiusMultiplier: 1.12,
      },
    ],
    surfaceColorToken: "var(--color-surface-slide-2)",
    textColorToken: "var(--color-text-slide-2)",
  },
  {
    id: 3,
    number: "03",
    name: "Tiramisu de Pistache",
    eyebrow: "Grandes Celebrações",
    title: "Sua celebração merece alta confeitaria.",
    description:
      "Tiramisu autoral de pistache puro, ganache aveludada e raspas de cacau para levar a experiência artesanal do nosso ateliê a recepções e celebrações especiais.",
    highlights: [
      { id: "03-message", icon: "message", label: "Atendimento direto" },
      { id: "03-sliders", icon: "sliders", label: "Sabores à escolha" },
      { id: "03-store", icon: "store", label: "Feito no ateliê" },
    ],
    image: GreenHeroIMG,
    alt: "Tiramisu artesanal de pistache e chocolate em pote de vidro com laço de juta, raspas de chocolate e folhas de hortelã",
    cutoutScale: 1.16,
    cutoutOffsetX: "-2.5%",
    cutoutOffsetY: "-1%",
    cutoutShadowBottom: "-6%",
    floatingPills: [
      {
        id: "pistache-topo",
        label: "Raspas de cacau & hortelã",
        anchor: { x: 0.54, y: 0.24 },
        angleDeg: -50,
        radiusMultiplier: 1.08,
      },
      {
        id: "pistache-meio",
        label: "Creme de pistache puro",
        anchor: { x: 0.36, y: 0.54 },
        angleDeg: 174,
        radiusMultiplier: 1.04,
      },
      {
        id: "pistache-base",
        label: "Ganache & massa de cacau",
        anchor: { x: 0.62, y: 0.78 },
        angleDeg: 48,
        radiusMultiplier: 1.12,
      },
    ],
    surfaceColorToken: "var(--color-surface-slide-3)",
    textColorToken: "var(--color-text-slide-3)",
  },
];

// --- Seção Cardápio & Coleções (#cardapio) ---

export interface MenuItem {
  readonly id: string;
  readonly name: string;
  readonly subtitle: string;
  readonly features: readonly string[];
  readonly image: string;
  readonly alt: string;
  readonly sensoryNotes: readonly string[];
  readonly priceDisplay: string;
  readonly portionsInfo: string;
  readonly targetServiceTier: "pedidos-whatsapp" | "presentes" | "encomendas";
  readonly whatsappPresetMessage: string;
}

export const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: "cacau-cereja-unit",
    name: "Cacau & Cereja Selvagem",
    subtitle: "Trufa artesanal monovarietal",
    features: [
      "Cacau 70% de origem agroecológica",
      "Ganache aveludada de textura cremosa",
      "Redução pura de cerejas frescas da estação",
      "Unidade de 45g com doçura equilibrada",
    ],
    image: MENU_ITEM_IMAGES.cacauCereja,
    alt: "Trufas artesanais de chocolate amargo 70% cacau com acabamento aveludado",
    sensoryNotes: ["Cacau 70%", "Frutas Vermelhas", "Doçura Reduzida"],
    priceDisplay: "R$ 12,00",
    portionsInfo: "Unidade (45g)",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir unidades do doce Cacau & Cereja Selvagem.",
  },
  {
    id: "citrico-imperial-unit",
    name: "Cítrico Imperial",
    subtitle: "Pâte de fruits com flor de laranjeira",
    features: [
      "Pâte de fruits artesanal com limão siciliano fresco",
      "Infusão aromática de flor de laranjeira",
      "Toque especiado de cumaru brasileiro",
      "Unidade de 45g com acabamento cítrico brilhante",
    ],
    image: MENU_ITEM_IMAGES.citricoImperial,
    alt: "Tartelete e confeitaria fina de limão siciliano com acabamento cítrico brilhante",
    sensoryNotes: ["Limão Siciliano", "Flor de Laranjeira", "Cumaru"],
    priceDisplay: "R$ 12,00",
    portionsInfo: "Unidade (45g)",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir unidades do doce Cítrico Imperial.",
  },
  {
    id: "pistache-silvestre-unit",
    name: "Pistache Silvestre",
    subtitle: "Bombom lapidado de pistache puro",
    features: [
      "Pistache iraniano selecionado e moído na pedra",
      "Base cremosa de chocolate branco artesanal",
      "Realce sutil com cristais de flor de sal",
      "Bombom lapidado de 45g",
    ],
    image: MENU_ITEM_IMAGES.pistacheSilvestre,
    alt: "Doce fino folhado e lapidado coberto por pistache verde moído na pedra",
    sensoryNotes: ["Pistache Puro", "Flor de Sal", "Textura Crocante"],
    priceDisplay: "R$ 14,00",
    portionsInfo: "Unidade (45g)",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir unidades do doce Pistache Silvestre.",
  },
  {
    id: "caixa-degustacao-8",
    name: "Caixa Degustação Atelier",
    subtitle: "A seleção completa dos sabores ícones",
    features: [
      "Seleção balanceada dos três doces ícones da casa",
      "Edições sazonais selecionadas do mês",
      "Caixa rígida premium com fecho magnético",
      "Acabamento presenteável com fita de gorgurão",
    ],
    image: MENU_ITEM_IMAGES.caixaDegustacao8,
    alt: "Caixa rígida escura de degustação com bombons e pralines artesanais sortidos",
    sensoryNotes: ["Embalagem Rígida", "Fita de Gorgurão", "Seleção Mista"],
    priceDisplay: "R$ 96,00",
    portionsInfo: "Caixa com 8 unidades",
    targetServiceTier: "presentes",
    whatsappPresetMessage: "Olá! Gostaria de pedir a Caixa Degustação Atelier com 8 unidades.",
  },
  {
    id: "caixa-luxo-16",
    name: "Caixa Coleção Botânica",
    subtitle: "O presente definitivo para ocasiões especiais",
    features: [
      "Sortimento completo com 16 doces autorais",
      "Caixa rígida luxuosa com lacre em cera vegetal",
      "Finalização em fita de algodão artesanal",
      "Acompanha menu explicativo de origem e terroir",
    ],
    image: MENU_ITEM_IMAGES.caixaLuxo16,
    alt: "Caixa dourada luxuosa de presente com coleção de 16 bombons finos artesanais",
    sensoryNotes: ["Edição Especial", "Lacre em Cera", "Pronta para Presente"],
    priceDisplay: "R$ 180,00",
    portionsInfo: "Caixa com 16 unidades",
    targetServiceTier: "presentes",
    whatsappPresetMessage: "Olá! Gostaria de encomendar a Caixa Coleção Botânica com 16 unidades.",
  },
  {
    id: "lote-eventos-50",
    name: "Mesa de Degustação para Eventos",
    subtitle: "Lotes a partir de 30 a 200+ unidades",
    features: [
      "Lotes sob medida a partir de 30 a 200+ unidades",
      "Curadoria personalizada para casamentos e eventos",
      "Degustação prévia agendada com a equipe do atelier",
      "Montagem e apresentação coordenadas para a mesa",
    ],
    image: MENU_ITEM_IMAGES.loteEventos50,
    alt: "Seleção colorida de doces finos e macarons alinhados para mesa de eventos e celebrações",
    sensoryNotes: ["Degustação Prévia", "Sob Medida", "Lotes Numerados"],
    priceDisplay: "A partir de R$ 320,00",
    portionsInfo: "Lotes a partir de 30 unidades",
    targetServiceTier: "encomendas",
    whatsappPresetMessage:
      "Olá! Gostaria de solicitar um orçamento para encomenda de evento com lotes de doces.",
  },
] as const;

export interface MenuProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export const MENU_PROCESS_STEPS: readonly MenuProcessStep[] = [
  {
    number: "01",
    title: "Escolha a Ocasião",
    description:
      "Defina se o pedido é para grandes eventos, presentes especiais ou desejo imediato.",
  },
  {
    number: "02",
    title: "Alinhe os Detalhes",
    description: "Converse pelo WhatsApp ou envie seu pedido por e-mail com sabores e datas.",
  },
  {
    number: "03",
    title: "Receba com Frescor",
    description:
      "Produção artesanal em pequenos lotes no dia e entrega climatizada com hora marcada.",
  },
] as const;
