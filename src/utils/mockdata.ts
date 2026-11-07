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
