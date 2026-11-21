import YellowHeroIMG from "@/assets/doce-amarelo.png";
import GreenHeroIMG from "@/assets/doce-verde.png";
import RedHeroIMG from "@/assets/doce-vermelho.png";
import type { HeroHighlight } from "@/components/Carrosel/HeroHighlights/HeroHighlights";
import { MENU_ITEM_IMAGES } from "@/utils/constants";

export interface Slide {
  id: number;
  number: string;
  name: string;
  eyebrow?: string;
  title: string;
  description: string;
  highlights: readonly HeroHighlight[];
  image: string;
  alt?: string;
  CTAColorToken?: string;
  textColorToken?: string;
  surfaceColorToken: string;
}

export const SLIDES: Slide[] = [
  {
    id: 1,
    number: "01",
    name: "Cacau & Cereja",
    eyebrow: "Atelier de Alta Confeitaria",
    title: "Artesanal de verdade.",
    description:
      "Doces frescos feitos à mão em pequenos lotes diários, com tempo dedicado a cada detalhe e dulçor na medida certa para exaltar o sabor puro do cacau.",
    highlights: [
      { id: "01-hand", icon: "hand", label: "Feito à mão" },
      { id: "01-layers", icon: "layers", label: "Pequeno lote" },
      { id: "01-leaf", icon: "leaf", label: "Ingredientes selecionados" },
    ],
    image: RedHeroIMG,
    alt: "Doce artesanal vermelho especial",
    surfaceColorToken: "var(--color-surface-slide-1)",
    textColorToken: "var(--color-text-slide-1)",
  },
  {
    id: 2,
    number: "02",
    name: "Cítrico Imperial",
    eyebrow: "Edições Especiais",
    title: "Presentes que ficam.",
    description:
      "Coleções exclusivas e sabores finos preparados para transformar gestos de carinho em memórias inesquecíveis. Você escolhe as criações e nós cuidamos do encanto.",
    highlights: [
      { id: "02-gift", icon: "gift", label: "Pronto para presentear" },
      { id: "02-package", icon: "package", label: "Embalagem cuidada" },
      { id: "02-sparkles", icon: "sparkles", label: "Para ocasiões especiais" },
    ],
    image: YellowHeroIMG,
    alt: "Doce artesanal amarelo especial",
    surfaceColorToken: "var(--color-surface-slide-2)",
    textColorToken: "var(--color-text-slide-2)",
  },
  {
    id: 3,
    number: "03",
    name: "Pistache Silvestre",
    eyebrow: "Grandes Celebrações",
    title: "Do ateliê para sua mesa.",
    description:
      "Da seleção criteriosa à finalização delicada, levamos a experiência autoral do nosso ateliê para momentos especiais, recepções e celebrações com quem você ama.",
    highlights: [
      { id: "03-message", icon: "message", label: "Atendimento direto" },
      { id: "03-sliders", icon: "sliders", label: "Sabores à escolha" },
      { id: "03-store", icon: "store", label: "Feito no ateliê" },
    ],
    image: GreenHeroIMG,
    alt: "Seleção especial de confeitaria",
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
  readonly targetServiceTier: "pedidos-whatsapp" | "encomendas";
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
    targetServiceTier: "pedidos-whatsapp",
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
    targetServiceTier: "pedidos-whatsapp",
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
