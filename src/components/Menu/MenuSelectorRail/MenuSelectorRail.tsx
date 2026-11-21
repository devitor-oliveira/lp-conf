import { type KeyboardEvent, useRef } from "react";
import type { MenuItem } from "@/utils/mockdata";
import styles from "./MenuSelectorRail.module.scss";

export interface MenuSelectorRailProps {
  readonly items: readonly MenuItem[];
  readonly selectedItemId: string;
  readonly onSelectItem: (id: string) => void;
}

export function MenuSelectorRail({ items, selectedItemId, onSelectItem }: MenuSelectorRailProps) {
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
      <div role="listbox" aria-label="Doces e coleções disponíveis" className={styles.thumbList}>
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
              className={`${styles.thumbItem} ${isSelected ? styles.activeThumb : ""}`}
              onClick={() => onSelectItem(item.id)}
              onKeyDown={(e) => handleKeyDownItem(e, item.id)}
            >
              <div className={styles.thumbFrame}>
                <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
              </div>

              <span className={styles.thumbLabel}>{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
