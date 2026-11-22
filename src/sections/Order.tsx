import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  type OrderChannelTab,
  OrderEmailForm,
  OrderFaq,
  OrderTabs,
  OrderWhatsAppCards,
} from "@/components/Order";
import {
  ORDER_FAQ_ITEMS,
  ORDER_SELECT_TIER_EVENT,
  ORDER_WHATSAPP_CHANNELS,
  type OrderServiceTier,
} from "@/utils/orderData";
import { scrollToSection } from "@/utils/scrollToSection";
import styles from "./Order.module.scss";

export function Order() {
  const [activeTab, setActiveTab] = useState<OrderChannelTab>("whatsapp");

  useEffect(() => {
    const handleSelectTier = (event: Event) => {
      const customEvent = event as CustomEvent<OrderServiceTier>;
      const tier = customEvent.detail;
      setActiveTab("whatsapp");

      window.requestAnimationFrame(() => {
        const targetSelector = `#encomende-${tier}`;
        if (document.querySelector(targetSelector)) {
          scrollToSection(targetSelector);
        }
      });
    };

    window.addEventListener(ORDER_SELECT_TIER_EVENT, handleSelectTier);
    return () => window.removeEventListener(ORDER_SELECT_TIER_EVENT, handleSelectTier);
  }, []);

  return (
    <section id="encomende" className={styles.order} aria-labelledby="order-title">
      <div className={styles.container}>
        <header className={styles.headerGrid}>
          <div className={styles.titleColumn}>
            <h2 id="order-title" className={styles.title}>
              Encomende Já
            </h2>
          </div>

          <div className={styles.leadColumn}>
            <p className={styles.eyebrow}>Atendimento Personalizado</p>
            <p className={styles.lead}>
              Escolha o canal ideal para sua ocasião. Seja um evento sob medida com degustação ou um
              pedido fresco para hoje, cada doce é preparado sob demanda em nosso atelier.
            </p>
          </div>
        </header>

        <OrderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        <div className={styles.channelPanelContainer}>
          <AnimatePresence mode="wait">
            {activeTab === "whatsapp" ? (
              <OrderWhatsAppCards key="whatsapp" channels={ORDER_WHATSAPP_CHANNELS} />
            ) : (
              <OrderEmailForm key="email" />
            )}
          </AnimatePresence>
        </div>

        <OrderFaq items={ORDER_FAQ_ITEMS} />
      </div>
    </section>
  );
}

export default Order;
