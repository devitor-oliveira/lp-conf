import { ChevronDown } from "lucide-react";
import type { OrderFaqItem } from "@/utils/orderData";
import styles from "./OrderFaq.module.scss";

export interface OrderFaqProps {
  readonly items: readonly OrderFaqItem[];
}

export function OrderFaq({ items }: OrderFaqProps) {
  return (
    <section className={styles.faqSection} aria-labelledby="faq-heading">
      <div className={styles.faqHeader}>
        <p className={styles.eyebrow}>Dúvidas Frequentes</p>
        <h3 id="faq-heading" className={styles.heading}>
          Informações antes do pedido
        </h3>
      </div>

      <div className={styles.faqList}>
        {items.map((item) => (
          <details key={item.id} className={styles.faqItem}>
            <summary className={styles.faqQuestion}>
              <span>{item.question}</span>
              <ChevronDown size={20} className={styles.chevron} aria-hidden="true" />
            </summary>
            <div className={styles.faqAnswer}>
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
