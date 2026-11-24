import { ArrowUpRight, Clock, Mail, MessageCircle, Sparkles } from "lucide-react";
import {
  ATELIER_CONTACT_INFO,
  ORDER_OCCASION_OPTIONS,
  type OrderServiceTier,
} from "@/utils/orderData";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_PHONE } from "@/utils/whatsapp";
import styles from "./OrderDirectContact.module.scss";

export interface OrderDirectContactProps {
  readonly selectedTier: OrderServiceTier;
}

export function OrderDirectContact({ selectedTier }: OrderDirectContactProps) {
  const activeOption =
    ORDER_OCCASION_OPTIONS.find((opt) => opt.value === selectedTier) ?? ORDER_OCCASION_OPTIONS[0];
  const whatsappHref = buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, activeOption?.whatsappMessage);

  return (
    <div className={styles.directColumn}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Atendimento Personalizado</p>
        <h2 id="order-title" className={styles.title}>
          Encomende Já
        </h2>
        <p className={styles.lead}>
          Do desejo imediato à mesa completa da sua celebração, conte para nós o que você planeja.
          Nossa equipe orienta sabores, quantidades e entrega climatizada.
        </p>
      </header>

      <div className={styles.directBlock}>
        <h3 className={styles.directHeading}>Prefere atendimento imediato?</h3>
        <p className={styles.directDescription}>
          Fale agora com o nosso atelier pelo WhatsApp para consultar as fornadas do dia ou alinhar
          dúvidas rápidas sobre {activeOption?.label.toLowerCase()}.
        </p>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chamar agora no WhatsApp sobre ${activeOption?.label} (abre em nova aba)`}
          className={styles.whatsappButton}
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span>Chamar Agora no WhatsApp</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>

      <ul className={styles.trustMetaList} aria-label="Informações de atendimento direto">
        <li className={styles.trustMetaItem}>
          <Clock size={16} className={styles.metaIcon} aria-hidden="true" />
          <span>Retorno de propostas em até 24h úteis</span>
        </li>
        <li className={styles.trustMetaItem}>
          <Sparkles size={16} className={styles.metaIcon} aria-hidden="true" />
          <span>Atendimento e retiradas: {ATELIER_CONTACT_INFO.hoursLabel}</span>
        </li>
        <li className={styles.trustMetaItem}>
          <Mail size={16} className={styles.metaIcon} aria-hidden="true" />
          <a href={`mailto:${ATELIER_CONTACT_INFO.email}`} className={styles.emailLink}>
            {ATELIER_CONTACT_INFO.email}
          </a>
        </li>
      </ul>
    </div>
  );
}
