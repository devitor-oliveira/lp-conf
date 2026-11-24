import { Mail, MessageCircle } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { type KeyboardEvent, useRef } from "react";
import styles from "./OrderTabs.module.scss";

export type OrderChannelTab = "whatsapp" | "email";

export interface OrderTabsProps {
  readonly activeTab: OrderChannelTab;
  readonly onChangeTab: (tab: OrderChannelTab) => void;
}

const TAB_ITEMS: readonly {
  readonly id: OrderChannelTab;
  readonly label: string;
  readonly panelId: string;
  readonly icon: "whatsapp" | "email";
}[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    panelId: "order-panel-whatsapp",
    icon: "whatsapp",
  },
  {
    id: "email",
    label: "Pedido por E-mail",
    panelId: "order-panel-email",
    icon: "email",
  },
] as const;

export function OrderTabs({ activeTab, onChangeTab }: OrderTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let targetIndex: number | null = null;

    if (e.key === "ArrowRight") {
      targetIndex = (currentIndex + 1) % TAB_ITEMS.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = (currentIndex - 1 + TAB_ITEMS.length) % TAB_ITEMS.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = TAB_ITEMS.length - 1;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      const nextTab = TAB_ITEMS[targetIndex];
      if (nextTab) {
        onChangeTab(nextTab.id);
        tabRefs.current[targetIndex]?.focus();
      }
    }
  };

  return (
    <div className={styles.tabsWrapper}>
      <LayoutGroup id="order-channel-tabs">
        <div
          className={styles.tablist}
          role="tablist"
          aria-label="Canal de atendimento para pedido"
        >
          {TAB_ITEMS.map((item, idx) => {
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`order-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={item.panelId}
                tabIndex={isSelected ? 0 : -1}
                className={styles.tabButton}
                onClick={() => onChangeTab(item.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                {isSelected && (
                  <motion.span
                    layoutId="order-active-tab-pill"
                    className={styles.activePill}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                <span className={styles.tabContent}>
                  {item.icon === "whatsapp" ? (
                    <MessageCircle size={18} aria-hidden="true" />
                  ) : (
                    <Mail size={18} aria-hidden="true" />
                  )}
                  <span className={styles.tabLabel}>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
