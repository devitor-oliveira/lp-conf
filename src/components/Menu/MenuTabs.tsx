import { type KeyboardEvent, useRef } from "react";
import type { MenuCategory, MenuCategoryId } from "@/utils/mockdata";
import styles from "./MenuTabs.module.scss";

export interface MenuTabsProps {
  readonly categories: readonly MenuCategory[];
  readonly activeCategory: MenuCategoryId;
  readonly onSelectCategory: (categoryId: MenuCategoryId) => void;
}

export function MenuTabs({ categories, activeCategory, onSelectCategory }: MenuTabsProps) {
  const tabRefs = useRef<Map<MenuCategoryId, HTMLButtonElement>>(new Map());

  const handleKeyDownTab = (e: KeyboardEvent<HTMLButtonElement>, currentId: MenuCategoryId) => {
    const currentIndex = categories.findIndex((cat) => cat.id === currentId);
    if (currentIndex === -1) return;

    let targetIndex: number | null = null;

    if (e.key === "ArrowRight") {
      targetIndex = (currentIndex + 1) % categories.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = (currentIndex - 1 + categories.length) % categories.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = categories.length - 1;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      const nextCategory = categories[targetIndex];
      if (nextCategory) {
        onSelectCategory(nextCategory.id);
        const targetElement = tabRefs.current.get(nextCategory.id);
        targetElement?.focus();
      }
    }
  };

  return (
    <div role="tablist" aria-label="Filtrar cardápio por categoria" className={styles.tablist}>
      {categories.map((cat) => {
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
            onClick={() => onSelectCategory(cat.id)}
            onKeyDown={(e) => handleKeyDownTab(e, cat.id)}
          >
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
