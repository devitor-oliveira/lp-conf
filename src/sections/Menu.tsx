import { useEffect, useMemo, useState } from "react";
import {
  MenuFeaturedStage,
  MenuHeader,
  MenuProcessSteps,
  MenuSelectorRail,
} from "@/components/Menu";
import { MENU_ITEMS, MENU_PROCESS_STEPS, type MenuItem } from "@/utils/mockdata";
import { ORDER_SELECT_TIER_EVENT, type OrderServiceTier } from "@/utils/orderData";
import { scrollToSection } from "@/utils/scrollToSection";
import styles from "./Menu.module.scss";

export function Menu() {
  const [selectedItemId, setSelectedItemId] = useState<string>(MENU_ITEMS[0]?.id ?? "");

  useEffect(() => {
    for (const menuItem of MENU_ITEMS) {
      const img = new Image();
      img.src = menuItem.image;
      void img.decode().catch(() => undefined);
    }
  }, []);

  const selectedItem: MenuItem | undefined = useMemo(() => {
    return MENU_ITEMS.find((item) => item.id === selectedItemId) ?? MENU_ITEMS[0];
  }, [selectedItemId]);

  const handleScrollToOrder = (tier: OrderServiceTier) => {
    window.dispatchEvent(
      new CustomEvent<OrderServiceTier>(ORDER_SELECT_TIER_EVENT, { detail: tier }),
    );
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
            items={MENU_ITEMS}
            selectedItemId={selectedItem?.id ?? ""}
            onSelectItem={setSelectedItemId}
          />

          {selectedItem && (
            <MenuFeaturedStage item={selectedItem} onOrderClick={handleScrollToOrder} />
          )}
        </div>

        <MenuProcessSteps steps={MENU_PROCESS_STEPS} />
      </div>
    </section>
  );
}
