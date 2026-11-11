import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { MenuCard, MenuHeader, MenuTabs } from "@/components/Menu";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategoryId, type MenuItem } from "@/utils/mockdata";
import styles from "./Menu.module.scss";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>("todos");
  const shouldReduceMotion = useReducedMotion();

  const categoryCounts = useMemo(() => {
    const counts: Record<MenuCategoryId, number> = {
      todos: MENU_ITEMS.length,
      autorais: 0,
      presentes: 0,
      eventos: 0,
    };
    for (const item of MENU_ITEMS) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "todos") {
      return MENU_ITEMS;
    }
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleScrollToOrder = (tier: MenuItem["targetServiceTier"]) => {
    const tierTarget = document.querySelector(`#encomende-${tier}`);
    const genericTarget = document.querySelector("#encomende");
    const target = tierTarget ?? genericTarget;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback gracioso até a seção #encomende ser implementada
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <section id="cardapio" className={styles.menu} aria-labelledby="menu-title">
      <div className={styles.container}>
        <MenuHeader />

        <MenuTabs
          categories={MENU_CATEGORIES}
          activeCategory={activeCategory}
          counts={categoryCounts}
          onSelectCategory={setActiveCategory}
        />

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
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} onOrderClick={handleScrollToOrder} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
