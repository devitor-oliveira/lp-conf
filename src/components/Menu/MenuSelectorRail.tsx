import { type KeyboardEvent, useRef } from "react";
import type { MenuCategory, MenuCategoryId, MenuItem } from "@/utils/mockdata";
import styles from "./MenuSelectorRail.module.scss";

export interface MenuSelectorRailProps {
  readonly items: readonly MenuItem[];
  readonly categories: readonly MenuCategory[];
  readonly activeCategory: MenuCategoryId;
  readonly counts: Record<MenuCategoryId, number>;
  readonly selectedItemId: string;
  readonly onSelectCategory: (cat: MenuCategoryId) => void;
  readonly onSelectItem: (id: string) => void;
}

export function MenuSelectorRail({
  items,
  categories,
  activeCategory,
  counts,
  selectedItemId,
  onSelectCategory,
  onSelectItem,
}: MenuSelectorRailProps) {
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDownItem = (e: KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const currentIndex = items.findIndex((i) => i.id === currentId);
    if (currentIndex === -1) return;

    let targetIndex: number | null = null;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      targetIndex = (currentIndex + 1) % items.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      targetIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = items.length - 1;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      const nextItem = items[targetIndex];
      if (nextItem) {
        onSelectItem(nextItem.id);
        const targetElement = itemRefs.current.get(nextItem.id);
        targetElement?.focus();
        targetElement?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      }
    }
  };

  return (
    <aside className={styles.railContainer} aria-label="Seletor de doces do atelier">
      <div className={styles.railHeader}>
        <h3 className={styles.railTitle}>Coleções &amp; Criações</h3>
        <div role="tablist" aria-label="Filtrar por categoria" className={styles.categoryPills}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.categoryPill} ${isActive ? styles.activePill : ""}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className={styles.pillCount} aria-hidden="true">
                  {counts[cat.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div role="listbox" aria-label="Doces e coleções disponíveis" className={styles.itemList}>
        {items.map((item) => {
          const isSelected = item.id === selectedItemId;

          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current.set(item.id, el);
                } else {
                  itemRefs.current.delete(item.id);
                }
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className={`${styles.itemCard} ${isSelected ? styles.activeCard : ""}`}
              onClick={() => onSelectItem(item.id)}
              onKeyDown={(e) => handleKeyDownItem(e, item.id)}
            >
              <div className={styles.thumbWrapper}>
                <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
              </div>

              <div className={styles.itemMeta}>
                <span className={styles.itemCategoryTag}>{item.subtitle}</span>
                <span className={styles.itemName}>{item.name}</span>
                <div className={styles.itemPriceRow}>
                  <span className={styles.itemPrice}>{item.priceDisplay}</span>
                  <span className={styles.itemPortions}>{item.portionsInfo}</span>
                </div>
              </div>

              <span className={styles.activeIndicatorDot} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
