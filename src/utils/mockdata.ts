import YellowHeroIMG from "@/assets/doce-amarelo.png";
import GreenHeroIMG from "@/assets/doce-verde.png";
import RedHeroIMG from "@/assets/doce-vermelho.png";

export interface Slide {
  id: number;
  number: string;
  name: string;
  title: string;
  description: string;
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
    title: "Display title 01",
    description: "Doces artesanais produzidos com dedicação e ingredientes selecionados.",
    image: RedHeroIMG,
    alt: "Doce artesanal vermelho especial",
    surfaceColorToken: "var(--color-surface-slide-1)",
    textColorToken: "var(--color-text-slide-1)",
  },
  {
    id: 2,
    number: "02",
    name: "Cítrico Imperial",
    title: "Display title 02",
    description: "Sabor cítrico especial em edição exclusiva da nossa confeitaria.",
    image: YellowHeroIMG,
    alt: "Doce artesanal amarelo especial",
    surfaceColorToken: "var(--color-surface-slide-2)",
    textColorToken: "var(--color-text-slide-2)",
  },
  {
    id: 3,
    number: "03",
    name: "Pistache Silvestre",
    title: "Display title 03",
    description: "Texturas delicadas e acabamento refinado para ocasiões memoráveis.",
    image: GreenHeroIMG,
    alt: "Seleção especial de confeitaria",
    surfaceColorToken: "var(--color-surface-slide-3)",
    textColorToken: "var(--color-text-slide-3)",
  },
];

// --- Seção Cardápio & Coleções (#cardapio) ---

export type MenuCategoryId = "todos" | "autorais" | "presentes" | "eventos";

export interface MenuCategory {
  readonly id: MenuCategoryId;
  readonly label: string;
}

export interface MenuItem {
  readonly id: string;
  readonly category: Exclude<MenuCategoryId, "todos">;
  readonly name: string;
  readonly subtitle: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
  readonly sensoryNotes: readonly string[];
  readonly priceDisplay: string;
  readonly portionsInfo: string;
  readonly targetServiceTier: "pedidos-whatsapp" | "encomendas";
  readonly whatsappPresetMessage: string;
}

export const MENU_CATEGORIES: readonly MenuCategory[] = [
  { id: "todos", label: "Todos" },
  { id: "autorais", label: "Doces Autorais" },
  { id: "presentes", label: "Caixas para Presente" },
  { id: "eventos", label: "Lotes para Eventos" },
] as const;

export const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: "cacau-cereja-unit",
    category: "autorais",
    name: "Cacau & Cereja Selvagem",
    subtitle: "Trufa artesanal monovarietal",
    description:
      "Cacau 70% de origem agroecológica, ganache aveludada e redução pura de cerejas frescas da estação.",
    image: RedHeroIMG,
    alt: "Doce autoral vermelho com cacau e cereja",
    sensoryNotes: ["Cacau 70%", "Frutas Vermelhas", "Doçura Reduzida"],
    priceDisplay: "R$ 12,00",
    portionsInfo: "Unidade individual (45g)",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir unidades do doce Cacau & Cereja Selvagem.",
  },
  {
    id: "citrico-imperial-unit",
    category: "autorais",
    name: "Cítrico Imperial",
    subtitle: "Pâte de fruits com flor de laranjeira",
    description:
      "Equilíbrio refinado entre o azedinho do limão siciliano, cumaru brasileiro e infusão floral delicada.",
    image: YellowHeroIMG,
    alt: "Doce artesanal amarelo sabor cítrico imperial",
    sensoryNotes: ["Limão Siciliano", "Flor de Laranjeira", "Cumaru"],
    priceDisplay: "R$ 12,00",
    portionsInfo: "Unidade individual (45g)",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir unidades do doce Cítrico Imperial.",
  },
  {
    id: "pistache-silvestre-unit",
    category: "autorais",
    name: "Pistache Silvestre",
    subtitle: "Bombom lapidado de pistache puro",
    description:
      "Pistache iraniano moído lentamente na pedra com chocolate branco artesanal e flor de sal.",
    image: GreenHeroIMG,
    alt: "Doce fino verde de pistache silvestre",
    sensoryNotes: ["Pistache Puro", "Flor de Sal", "Textura Crocante"],
    priceDisplay: "R$ 14,00",
    portionsInfo: "Unidade individual (45g)",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir unidades do doce Pistache Silvestre.",
  },
  {
    id: "caixa-degustacao-8",
    category: "presentes",
    name: "Caixa Degustação Atelier (8 unids)",
    subtitle: "A seleção completa dos sabores ícones",
    description:
      "Caixa rígida com fecho magnético contendo seleção balanceada dos três doces ícones e edições do mês.",
    image: RedHeroIMG,
    alt: "Caixa de presente com doces finos artesanais",
    sensoryNotes: ["Embalagem Rígida", "Fita de Gorgurão", "Seleção Mista"],
    priceDisplay: "R$ 96,00",
    portionsInfo: "Caixa com 8 unidades",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de pedir a Caixa Degustação Atelier com 8 unidades.",
  },
  {
    id: "caixa-luxo-16",
    category: "presentes",
    name: "Caixa Coleção Botânica (16 unids)",
    subtitle: "O presente definitivo para ocasiões especiais",
    description:
      "Apresentação em caixa rígida luxuosa com lacre em cera vegetal, fita de algodão e menu explicativo de terroir.",
    image: GreenHeroIMG,
    alt: "Caixa luxuosa de presentes com 16 doces finos",
    sensoryNotes: ["Edição Especial", "Lacre em Cera", "Pronta para Presente"],
    priceDisplay: "R$ 180,00",
    portionsInfo: "Caixa com 16 unidades",
    targetServiceTier: "pedidos-whatsapp",
    whatsappPresetMessage: "Olá! Gostaria de encomendar a Caixa Coleção Botânica com 16 unidades.",
  },
  {
    id: "lote-eventos-50",
    category: "eventos",
    name: "Mesa de Degustação para Eventos",
    subtitle: "Lotes a partir de 30 a 200+ unidades",
    description:
      "Doces finos lapidados para casamentos, batizados e eventos corporativos com montagem personalizada e degustação prévia.",
    image: YellowHeroIMG,
    alt: "Seleção de doces finos para mesa de eventos e casamentos",
    sensoryNotes: ["Degustação Prévia", "Sob Medida", "Lotes Numerados"],
    priceDisplay: "A partir de R$ 320,00",
    portionsInfo: "Lotes a partir de 30 unidades",
    targetServiceTier: "encomendas",
    whatsappPresetMessage:
      "Olá! Gostaria de solicitar um orçamento para encomenda de evento com lotes de doces.",
  },
] as const;
