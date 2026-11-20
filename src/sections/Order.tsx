import { AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  type OrderChannelTab,
  OrderEmailForm,
  OrderFaq,
  OrderProcessSteps,
  OrderTabs,
  OrderWhatsAppCards,
} from "@/components/Order";
import { ORDER_FAQ_ITEMS, ORDER_PROCESS_STEPS, ORDER_WHATSAPP_CHANNELS } from "@/utils/orderData";
import styles from "./Order.module.scss";

export function Order() {
  const [activeTab, setActiveTab] = useState<OrderChannelTab>("whatsapp");

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

        <OrderProcessSteps steps={ORDER_PROCESS_STEPS} />

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
