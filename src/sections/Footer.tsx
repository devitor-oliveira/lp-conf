import { ArrowUp, AtSign, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ATELIER_CONTACT_INFO } from "@/utils/orderData";
import { scrollToSection } from "@/utils/scrollToSection";
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_PHONE,
  WHATSAPP_PRESET_MESSAGES,
} from "@/utils/whatsapp";
import styles from "./Footer.module.scss";

const FOOTER_NAV_LINKS: readonly { readonly href: string; readonly label: string }[] = [
  { href: "#inicio", label: "Início" },
  { href: "#conheca", label: "O Atelier" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#encomende", label: "Encomende Já" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, WHATSAPP_PRESET_MESSAGES.delivery);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
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
            <h3 className={styles.columnHeading}>Ateliê & Retirada</h3>
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
          </div>

          <div className={styles.infoColumn}>
            <h3 className={styles.columnHeading}>Canais Diretos</h3>
            <ul className={styles.linkList}>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
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
                >
                  <AtSign size={16} aria-hidden="true" />
                  <span>{ATELIER_CONTACT_INFO.instagramHandle}</span>
                </a>
              </li>
            </ul>
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
            © {currentYear} {ATELIER_CONTACT_INFO.brandName}. Todos os direitos reservados.
          </p>
          <button
            type="button"
            onClick={() => handleNavClick("#inicio")}
            className={styles.backToTop}
            aria-label="Voltar ao topo da página"
          >
            <span>Topo</span>
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
