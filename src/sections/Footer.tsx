import { ArrowUp, AtSign, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { ATELIER_CONTACT_INFO } from "@/utils/constants";
import { scrollToSection } from "@/utils/scrollToSection";
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_PHONE,
  WHATSAPP_PRESET_MESSAGES,
} from "@/utils/whatsapp";
import styles from "./Footer.module.scss";

const CURRENT_YEAR = new Date().getFullYear();

const FOOTER_NAV_LINKS: readonly { readonly href: string; readonly label: string }[] = [
  { href: "#inicio", label: "Início" },
  { href: "#conheca", label: "O Atelier" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#encomende", label: "Encomende Já" },
] as const;

const BACK_TO_TOP_BUTTON_VARIANTS = {
  hover: {},
  tap: { scale: 0.97 },
};

const BACK_TO_TOP_ARROW_VARIANTS = {
  hover: { y: -2 },
  tap: { scale: 0.95 },
};

export function Footer() {
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, WHATSAPP_PRESET_MESSAGES.delivery);

  const handleNavClick = (href: string) => {
    scrollToSection(href, { focusTarget: true });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topGrid}>
          <div className={styles.brandColumn}>
            <h2 className={styles.brandTitle}>{ATELIER_CONTACT_INFO.brandName}</h2>
            <p className={styles.brandTagline}>{ATELIER_CONTACT_INFO.tagline}</p>
          </div>

          <div className={styles.infoColumn}>
            <h3 className={styles.columnHeading}>Ateliê &amp; Retirada</h3>
            <address className={styles.addressGroup}>
              <div className={styles.infoItem}>
                <MapPin size={16} className={styles.icon} aria-hidden="true" />
                <div>
                  <p>{ATELIER_CONTACT_INFO.addressLine1}</p>
                  <p>{ATELIER_CONTACT_INFO.addressLine2}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Clock size={16} className={styles.icon} aria-hidden="true" />
                <p>{ATELIER_CONTACT_INFO.hoursLabel}</p>
              </div>
            </address>
          </div>

          <div className={styles.infoColumn}>
            <h3 className={styles.columnHeading}>Canais Diretos</h3>
            <address className={styles.addressGroup}>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                    aria-label="WhatsApp Oficial (abre em nova aba)"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    <span>WhatsApp Oficial</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${ATELIER_CONTACT_INFO.email}`} className={styles.contactLink}>
                    <Mail size={16} aria-hidden="true" />
                    <span>{ATELIER_CONTACT_INFO.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={ATELIER_CONTACT_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                    aria-label={`Instagram ${ATELIER_CONTACT_INFO.instagramHandle} (abre em nova aba)`}
                  >
                    <AtSign size={16} aria-hidden="true" />
                    <span>{ATELIER_CONTACT_INFO.instagramHandle}</span>
                  </a>
                </li>
              </ul>
            </address>
          </div>

          <div className={styles.navColumn}>
            <h3 className={styles.columnHeading}>Explorar</h3>
            <nav aria-label="Navegação do rodapé">
              <ul className={styles.linkList}>
                {FOOTER_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className={styles.navLink}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {CURRENT_YEAR} {ATELIER_CONTACT_INFO.brandName}. Todos os direitos reservados.
          </p>
          <motion.button
            type="button"
            onClick={() => handleNavClick("#inicio")}
            className={styles.backToTop}
            aria-label="Voltar ao topo da página"
            variants={BACK_TO_TOP_BUTTON_VARIANTS}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
          >
            <span>Topo</span>
            <motion.span
              className={styles.backToTopIcon}
              aria-hidden="true"
              variants={BACK_TO_TOP_ARROW_VARIANTS}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
            >
              <ArrowUp size={16} />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
