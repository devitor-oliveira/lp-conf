import { Mail, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
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
    label: "WhatsApp (Instantâneo)",
    panelId: "order-panel-whatsapp",
    icon: "whatsapp",
  },
  {
    id: "email",
    label: "E-mail / Proposta Formal",
    panelId: "order-panel-email",
    icon: "email",
  },
] as const;

export function OrderTabs({ activeTab, onChangeTab }: OrderTabsProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % TAB_ITEMS.length;
      const nextTab = TAB_ITEMS[nextIndex];
      if (nextTab) {
        onChangeTab(nextTab.id);
      }
    }
  };

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tablist} role="tablist" aria-label="Canal de atendimento para pedido">
        {TAB_ITEMS.map((item, idx) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`order-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={item.panelId}
              tabIndex={isSelected ? 0 : -1}
              className={`${styles.tabButton} ${isSelected ? styles.tabActive : ""}`}
              onClick={() => onChangeTab(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {isSelected && (
                <motion.span
                  layoutId={shouldReduceMotion ? undefined : "order-active-tab-pill"}
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
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
