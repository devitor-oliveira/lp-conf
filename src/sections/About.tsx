import { Clock, Gift, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { MenuExpandButton, ServiceTierCard } from "../components/About";
import styles from "./About.module.scss";

export function About() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.55,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const handleScrollToSection = (targetId: string) => {
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <section id="conheca" className={styles.about} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <motion.header
            className={styles.header}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            <motion.p className={styles.eyebrow} variants={itemVariants}>
              <Sparkles size={14} aria-hidden="true" />
              <span>O Atelier &amp; Filosofia</span>
            </motion.p>
            <motion.h2 id="about-title" className={styles.title} variants={itemVariants}>
              Onde a confeitaria clássica encontra a botânica brasileira
            </motion.h2>
            <motion.p className={styles.lead} variants={itemVariants}>
              Cada doce é concebido como uma joia sensorial efêmera: açúcares calibrados, notas
              florais da nossa flora e o mais puro cacau de pequenos produtores agroecológicos.
            </motion.p>
          </motion.header>

          <div className={styles.expandBtnWrapper}>
            <MenuExpandButton />
          </div>
        </div>

        <motion.div
          className={styles.triptychGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {/* Card 1: Pronta-Entrega & Delivery Local (Esquerda) */}
          <motion.div className={styles.gridItem} variants={itemVariants}>
            <ServiceTierCard
              id="delivery"
              icon={<Clock size={20} />}
              badgeText="80 caixas / dia"
              regionTag="São Paulo & Região"
              title="Pronta-Entrega & Delivery Local"
              leadDescription="Para desejos imediatos e celebrações espontâneas. Receba seus doces preferidos com agilidade no conforto da sua casa ou escritório."
              keyHighlights={[
                "Entregas em 30 a 60 minutos na Grande SP",
                "Lote diário limitado a 80 caixas para frescor absoluto",
                "Pedidos diretos via WhatsApp e canais parceiros",
              ]}
              timeframeInfo="Disponível de Terça a Domingo • 11h às 20h"
              actionLabel="Pedir Delivery Imediato"
              href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20consultar%20a%20pronta-entrega%20do%20dia"
            />
          </motion.div>

          {/* Card 2: Grandes Encomendas & Eventos (CENTRO - CARRO-CHEFE) */}
          <motion.div
            className={`${styles.gridItem} ${styles.gridItemFeatured}`}
            variants={itemVariants}
          >
            <ServiceTierCard
              id="encomendas"
              isPrimaryFeatured={true}
              icon={<Sparkles size={22} />}
              badgeText="Lotes de 30 a 500+ un."
              regionTag="Casamentos & Eventos"
              title="Grandes Encomendas & Celebrações"
              leadDescription="O coração do Atelier. Produzimos mesas de doces inesquecíveis para casamentos, recepções corporativas e celebrações marcantes com consultoria do chef."
              keyHighlights={[
                "Consultoria de terroir botânico e harmonização sob medida",
                "Degustação guiada prévia para noivos e anfitriões",
                "Acompanhamento técnico de montagem e suporte cerimonial",
              ]}
              timeframeInfo="Antecedência recomendada: 7 a 20 dias"
              actionLabel="Solicitar Orçamento de Evento"
              onActionClick={() => handleScrollToSection("#encomende")}
            />
          </motion.div>

          {/* Card 3: Caixas para Presente & Envios Nacionais (Direita) */}
          <motion.div className={styles.gridItem} variants={itemVariants}>
            <ServiceTierCard
              id="presentes"
              icon={<Gift size={20} />}
              badgeText="Entrega em Todo o Brasil"
              regionTag="Envio Climatizado"
              title="Caixas para Presente & Envios Nacionais"
              leadDescription="Envie afeto e sofisticação para qualquer estado brasileiro. Caixas rígidas com berço anti-impacto preparadas para viagens de longa distância."
              keyHighlights={[
                "Caixas rígidas de design exclusivo com fecho magnético",
                "Controle térmico vegetal que preserva textura e brilho",
                "Lacre em cera botânica e rastreamento ponta a ponta",
              ]}
              timeframeInfo="Envio expresso para todas as capitais e cidades"
              actionLabel="Enviar Presente pelo Brasil"
              onActionClick={() => handleScrollToSection("#cardapio")}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
