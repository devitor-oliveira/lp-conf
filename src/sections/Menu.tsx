import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { MenuCard, MenuHeader, MenuTabs } from "@/components/Menu";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategoryId } from "@/utils/mockdata";
import styles from "./Menu.module.scss";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>("todos");
  const shouldReduceMotion = useReducedMotion();

  const filteredItems = useMemo(() => {
    if (activeCategory === "todos") {
      return MENU_ITEMS;
    }
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleScrollToOrder = () => {
    const target = document.querySelector("#encomende");
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
