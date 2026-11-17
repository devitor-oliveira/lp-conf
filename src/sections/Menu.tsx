import { useMemo, useState } from "react";
import { MenuFeaturedStage, MenuHeader, MenuSelectorRail } from "@/components/Menu";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategoryId, type MenuItem } from "@/utils/mockdata";
import { scrollToSection } from "@/utils/scrollToSection";
import styles from "./Menu.module.scss";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>("todos");
  const [selectedItemId, setSelectedItemId] = useState<string>(MENU_ITEMS[0]?.id ?? "");

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

  const selectedItem: MenuItem | undefined = useMemo(() => {
    return (
      filteredItems.find((item) => item.id === selectedItemId) ?? filteredItems[0] ?? MENU_ITEMS[0]
    );
  }, [filteredItems, selectedItemId]);

  const handleSelectCategory = (cat: MenuCategoryId) => {
    setActiveCategory(cat);
    const newItems = cat === "todos" ? MENU_ITEMS : MENU_ITEMS.filter((i) => i.category === cat);
    if (!newItems.some((i) => i.id === selectedItemId) && newItems[0]) {
      setSelectedItemId(newItems[0].id);
    }
  };

  const handleScrollToOrder = (tier: MenuItem["targetServiceTier"]) => {
    const tierTargetSelector = `#encomende-${tier}`;
    const genericTargetSelector = "#encomende";

    if (document.querySelector(tierTargetSelector)) {
      scrollToSection(tierTargetSelector);
    } else if (document.querySelector(genericTargetSelector)) {
      scrollToSection(genericTargetSelector);
    } else {
      scrollToSection(tierTargetSelector, { fallbackToBottom: true });
    }
  };

  return (
    <section id="cardapio" className={styles.menu} aria-labelledby="menu-title">
      <div className={styles.container}>
        <MenuHeader />

        <div className={styles.bentoShowcase}>
          <MenuSelectorRail
            items={filteredItems}
            categories={MENU_CATEGORIES}
            activeCategory={activeCategory}
            counts={categoryCounts}
            selectedItemId={selectedItem?.id ?? ""}
            onSelectCategory={handleSelectCategory}
            onSelectItem={setSelectedItemId}
          />

          {selectedItem && (
            <MenuFeaturedStage item={selectedItem} onOrderClick={handleScrollToOrder} />
          )}
        </div>
      </div>
    </section>
  );
}
