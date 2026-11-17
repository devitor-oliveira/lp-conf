import { Clock, Gift, Leaf, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import styles from "./About.module.scss";

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section id="conheca" className={styles.about} aria-labelledby="about-title">
      <div className={styles.container}>
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
            Cada doce é concebido como uma joia sensorial efémera: açúcares calibrados, notas
            florais da nossa flora e o mais puro cacau de pequenos produtores agroecológicos.
          </motion.p>
        </motion.header>

        <motion.div
          className={styles.bentoGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {/* Card 1: Destaque Amplo (Cacau & Origem) */}
          <motion.article className={`${styles.card} ${styles.cardHero}`} variants={itemVariants}>
            <div className={styles.cardHeader}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Leaf size={20} />
              </span>
              <span className={styles.tag}>100% Rastreável</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Cacau de Origem &amp; Ingredientes Vivos</h3>
              <p className={styles.cardDescription}>
                Trabalhamos exclusivamente com chocolate monovarietal de comunidades ribeirinhas e
                frutas frescas colhidas no ápice de maturação. Sem conservantes, corantes sintéticos
                ou gorduras hidrogenadas.
              </p>
            </div>
          </motion.article>

          {/* Card 2: Métrica Editorial (Produção Diária) */}
          <motion.article className={`${styles.card} ${styles.cardMetric}`} variants={itemVariants}>
            <div className={styles.cardHeader}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Clock size={20} />
              </span>
              <span className={styles.tag}>Frescor Absoluto</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.metricNumber}>
                <span className={styles.number}>80</span>
                <span className={styles.unit}>caixas/dia</span>
              </div>
              <h3 className={styles.cardTitle}>Lotes Numerados Diários</h3>
              <p className={styles.cardDescription}>
                Produção deliberadamente reduzida para assegurar que cada doce chegue à sua mesa com
                textura aveludada e acabamento impecável, do pedido individual ao lote especial.
              </p>
            </div>
          </motion.article>

          {/* Card 3: Equilíbrio Sensorial */}
          <motion.article
            className={`${styles.card} ${styles.cardSensory}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Sparkles size={20} />
              </span>
              <span className={styles.tag}>Equilíbrio Sensorial</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Menos Doçura, Mais Expressão</h3>
              <p className={styles.cardDescription}>
                Reduzimos o dulçor tradicional em até 40% para exaltar a acidez viva das frutas, o
                tostado das castanhas e as nuances terrosas do cacau brasileiro.
              </p>
            </div>
          </motion.article>

          {/* Card 4: Versatilidade de Serviços (Unidades, Encomendas & Delivery) */}
          <motion.article
            className={`${styles.card} ${styles.cardGifting}`}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Gift size={20} />
              </span>
              <span className={styles.tag}>Unidades • Encomendas • Delivery</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Do Mimo Individual a Grandes Celebrações</h3>
              <p className={styles.cardDescription}>
                Pronta-entrega nos aplicativos de delivery, solicitações ágeis por WhatsApp para
                unidades avulsas, e caixas rígidas exclusivas para presentes corporativos,
                casamentos e eventos marcantes.
              </p>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
