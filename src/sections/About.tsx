import { MenuExpandButton, ServiceTierCard } from "@/components/About";
import { ABOUT_SERVICE_IMAGES } from "@/utils/constants";
import { scrollToSection } from "@/utils/scrollToSection";
import {
  buildWhatsAppUrl,
  DEFAULT_WHATSAPP_PHONE,
  WHATSAPP_PRESET_MESSAGES,
} from "@/utils/whatsapp";
import styles from "./About.module.scss";

export function About() {
  const deliveryWhatsAppUrl = buildWhatsAppUrl(
    DEFAULT_WHATSAPP_PHONE,
    WHATSAPP_PRESET_MESSAGES.delivery,
  );

  return (
    <section id="conheca" className={styles.about} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.headerGrid}>
          <div className={styles.titleColumn}>
            <h2 id="about-title" className={styles.title}>
              O Atelier
            </h2>
          </div>

          <div className={styles.philosophyColumn}>
            <p className={styles.eyebrow}>Nossa Filosofia</p>
            <p className={styles.lead}>
              Cada peça é concebida como uma joia sensorial efémera: açúcares calibrados, notas
              florais da nossa flora e o mais puro cacau de pequenos produtores agroecológicos,
              trazendo elegância tranquila ao cotidiano.
            </p>
          </div>

          <div className={styles.actionColumn}>
            <MenuExpandButton />
          </div>
        </div>

        <div className={styles.triptychGrid}>
          <div className={`${styles.gridItem} ${styles.gridItemFeatured}`}>
            <ServiceTierCard
              id="encomendas"
              isPrimaryFeatured={true}
              image={ABOUT_SERVICE_IMAGES.encomendas}
              alt="Mesa de doces de celebração com torre de macarons e arranjos florais"
              overlayTheme="cacau"
              tag="Lotes de 30 a 500+ un."
              title="Grandes Encomendas & Celebrações"
              leadDescription="O coração do Atelier. Mesas de doces inesquecíveis para casamentos e eventos corporativos com consultoria exclusiva."
              actionLabel="Solicitar Orçamento de Evento"
              onActionClick={() => scrollToSection("#encomende", { fallbackToBottom: true })}
            />
          </div>

          <div className={`${styles.gridItem} ${styles.gridItemDelivery}`}>
            <ServiceTierCard
              id="delivery"
              image={ABOUT_SERVICE_IMAGES.delivery}
              alt="Sobremesa artesanal em camadas servida em pote de vidro para pronta-entrega"
              overlayTheme="neutral"
              tag="São Paulo & Região • 30-60min"
              title="Pronta-Entrega & Delivery"
              leadDescription="Para desejos imediatos. Receba nossos doces artesanais com agilidade no conforto da sua casa."
              actionLabel="Pedir Delivery Imediato"
              href={deliveryWhatsAppUrl}
            />
          </div>

          <div className={`${styles.gridItem} ${styles.gridItemGifting}`}>
            <ServiceTierCard
              id="presentes"
              image={ABOUT_SERVICE_IMAGES.presentes}
              alt="Caixa rígida presenteável com laço de fita e chocolates artesanais"
              overlayTheme="pistache"
              tag="Envio Climatizado • Todo o Brasil"
              title="Caixas para Presente"
              leadDescription="Envie afeto para qualquer estado. Embalagens rígidas com controle térmico e proteção premium."
              actionLabel="Enviar Presente pelo Brasil"
              onActionClick={() => scrollToSection("#cardapio", { fallbackToBottom: true })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
