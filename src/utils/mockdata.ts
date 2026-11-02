import YellowHeroIMG from "@/assets/doce-amarelo.png";
import GreenHeroIMG from "@/assets/doce-verde.png";
import RedHeroIMG from "@/assets/doce-vermelho.png";

export interface Slide {
  id: number;
  number: string;
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
    title: "Display title 01",
    description: "Doces artesanais produzidos com dedicação e ingredientes selecionados.",
    image: RedHeroIMG,
    alt: "Doce artesanal vermelho especial",
    surfaceColorToken: "var(--color-surface-slide-1)",
  },
  {
    id: 2,
    number: "02",
    title: "Display title 02",
    description: "Sabor cítrico especial em edição exclusiva da nossa confeitaria.",
    image: YellowHeroIMG,
    alt: "Doce artesanal amarelo especial",
    surfaceColorToken: "var(--color-surface-slide-2)",
  },
  {
    id: 3,
    number: "03",
    title: "Display title 03",
    description: "Texturas delicadas e acabamento refinado para ocasiões memoráveis.",
    image: GreenHeroIMG,
    alt: "Seleção especial de confeitaria",
    surfaceColorToken: "var(--color-surface-slide-3)",
  },
];
