export const DEFAULT_WHATSAPP_PHONE = "5511999999999";

export const WHATSAPP_PRESET_MESSAGES = {
  delivery: "Olá, gostaria de consultar a pronta-entrega do dia",
  encomendas: "Olá, gostaria de solicitar um orçamento para eventos",
  presentes: "Olá, gostaria de informações sobre as caixas para presente",
} as const;

export const ABOUT_SERVICE_IMAGES = {
  delivery:
    "https://images.pexels.com/photos/11757843/pexels-photo-11757843.jpeg?auto=compress&cs=tinysrgb&w=1000",
  encomendas:
    "https://images.pexels.com/photos/19717706/pexels-photo-19717706/free-photo-of-close-up-of-a-table-with-confectionery.jpeg?auto=compress&cs=tinysrgb&w=1000",
  presentes:
    "https://images.pexels.com/photos/36663543/pexels-photo-36663543/free-photo-of-elegant-gift-box-with-purple-ribbon-and-chocolates.jpeg?auto=compress&cs=tinysrgb&w=1000",
} as const;

/**
 * Constrói URL canônica do WhatsApp sanitizando dígitos do telefone e codificando a mensagem.
 */
export function getWhatsAppUrl(
  phone: string = DEFAULT_WHATSAPP_PHONE,
  message: string = "",
): string {
  const sanitizedPhone = phone.replace(/\D/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${sanitizedPhone}${encodedText ? `?text=${encodedText}` : ""}`;
}
