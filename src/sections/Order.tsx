import { useEffect, useState } from "react";
import { OrderDirectContact, OrderFaq, OrderLeadForm } from "@/components/Order";
import {
  ORDER_FAQ_ITEMS,
  ORDER_SELECT_TIER_EVENT,
  type OrderSelectIntentDetail,
  type OrderServiceTier,
} from "@/utils/orderData";
import styles from "./Order.module.scss";

export function Order() {
  const [selectedTier, setSelectedTier] = useState<OrderServiceTier>("encomendas");
  const [presetProductName, setPresetProductName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleSelectTier = (event: Event) => {
      const customEvent = event as CustomEvent<OrderSelectIntentDetail | OrderServiceTier>;
      const detail = customEvent.detail;

      if (typeof detail === "string") {
        setSelectedTier(detail);
      } else if (detail && typeof detail === "object" && "tier" in detail) {
        setSelectedTier(detail.tier);
        if (detail.productName) {
          setPresetProductName(detail.productName);
        }
      }
    };

    window.addEventListener(ORDER_SELECT_TIER_EVENT, handleSelectTier);
    return () => window.removeEventListener(ORDER_SELECT_TIER_EVENT, handleSelectTier);
  }, []);

  return (
    <section id="encomende" className={styles.order} aria-labelledby="order-title">
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <OrderDirectContact selectedTier={selectedTier} />
          <OrderLeadForm
            selectedTier={selectedTier}
            presetProductName={presetProductName}
            onTierChange={setSelectedTier}
          />
        </div>

        <OrderFaq items={ORDER_FAQ_ITEMS} />
      </div>
    </section>
  );
}

export default Order;
