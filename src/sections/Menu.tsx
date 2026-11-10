import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useMemo, useRef, useState } from "react";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategoryId, type MenuItem } from "@/utils/mockdata";
import styles from "./Menu.module.scss";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>("todos");
  const [activeWhatsappId, setActiveWhatsappId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const tabRefs = useRef<Map<MenuCategoryId, HTMLButtonElement>>(new Map());

  const filteredItems = useMemo(() => {
    if (activeCategory === "todos") {
      return MENU_ITEMS;
    }
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleKeyDownTab = (e: KeyboardEvent<HTMLButtonElement>, currentId: MenuCategoryId) => {
    const currentIndex = MENU_CATEGORIES.findIndex((cat) => cat.id === currentId);
    if (currentIndex === -1) return;

    let targetIndex: number | null = null;

    if (e.key === "ArrowRight") {
      targetIndex = (currentIndex + 1) % MENU_CATEGORIES.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = (currentIndex - 1 + MENU_CATEGORIES.length) % MENU_CATEGORIES.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = MENU_CATEGORIES.length - 1;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      const nextCategory = MENU_CATEGORIES[targetIndex];
      if (nextCategory) {
        setActiveCategory(nextCategory.id);
        const targetElement = tabRefs.current.get(nextCategory.id);
        targetElement?.focus();
      }
    }
  };

  const handleScrollToOrder = () => {
    const target = document.querySelector("#encomende");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback gracioso até a seção #encomende ser implementada
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handleWhatsappClick = (item: MenuItem) => {
    if (activeWhatsappId) return;
    setActiveWhatsappId(item.id);

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
      item.whatsappPresetMessage,
    )}`;

    // Micro-interação tátil de 500ms com confirmação antes do disparo
    window.setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setActiveWhatsappId(null);
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.2,
      },
    },
  };

  return (
    <section id="cardapio" className={styles.menu} aria-labelledby="menu-title">
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          <motion.p className={styles.eyebrow} variants={cardVariants}>
            <Sparkles size={14} aria-hidden="true" />
            <span>Cardápio &amp; Coleções</span>
          </motion.p>
          <motion.h2 id="menu-title" className={styles.title} variants={cardVariants}>
            Criações autorais em edições limitadas
          </motion.h2>
          <motion.p className={styles.lead} variants={cardVariants}>
            Doces concebidos individualmente para degustação imediata, caixas sofisticadas para
            presentear ou lotes exclusivos para celebrações memoráveis.
          </motion.p>
        </motion.header>

        {/* Abas acessíveis W3C */}
        <div role="tablist" aria-label="Filtrar cardápio por categoria" className={styles.tablist}>
          {MENU_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  if (el) {
                    tabRefs.current.set(cat.id, el);
                  } else {
                    tabRefs.current.delete(cat.id);
                  }
                }}
                type="button"
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${cat.id}`}
                tabIndex={isSelected ? 0 : -1}
                className={`${styles.tab} ${isSelected ? styles.active : ""}`}
                onClick={() => setActiveCategory(cat.id)}
                onKeyDown={(e) => handleKeyDownTab(e, cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Painel do Grid de Produtos */}
        <div
          role="tabpanel"
          id={`panel-${activeCategory}`}
          aria-labelledby={`tab-${activeCategory}`}
        >
          <motion.div
            layout={!shouldReduceMotion}
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const isTriggered = activeWhatsappId === item.id;

                return (
                  <motion.article
                    key={item.id}
                    layout={!shouldReduceMotion}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={styles.card}
                  >
                    <figure className={styles.imageContainer}>
                      <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                      <figcaption className={styles.sensoryBadgeList}>
                        {item.sensoryNotes.map((note) => (
                          <span key={note} className={styles.sensoryBadge}>
                            {note}
                          </span>
                        ))}
                      </figcaption>
                    </figure>

                    <div className={styles.cardBody}>
                      <div className={styles.cardHeaderRow}>
                        <span className={styles.cardSubtitle}>{item.subtitle}</span>
                        <span className={styles.cardPortionsBadge}>{item.portionsInfo}</span>
                      </div>

                      <h3 className={styles.cardTitle}>{item.name}</h3>
                      <p className={styles.cardDescription}>{item.description}</p>

                      <div className={styles.priceContainer}>
                        <span className={styles.priceLabel}>Valor de referência</span>
                        <span className={styles.priceValue}>{item.priceDisplay}</span>
                      </div>

                      <div className={styles.actionsContainer}>
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={handleScrollToOrder}
                        >
                          <span>Encomendar / Ver Opções</span>
                          <ArrowRight size={16} aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          className={`${styles.whatsappBtn} ${
                            isTriggered ? styles.whatsappTriggered : ""
                          }`}
                          onClick={() => handleWhatsappClick(item)}
                          aria-label={`Pedir ${item.name} via WhatsApp`}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isTriggered ? (
                              <motion.span
                                key="confirming"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <Check size={18} aria-hidden="true" />
                                <span>Abrindo WhatsApp...</span>
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <MessageCircle size={18} aria-hidden="true" />
                                <span>Pedir no WhatsApp</span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
