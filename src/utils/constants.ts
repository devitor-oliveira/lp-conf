export const DEFAULT_WHATSAPP_PHONE = "5511999999999";

export const WHATSAPP_PRESET_MESSAGES = {
  delivery: "Olá, gostaria de consultar a pronta-entrega do dia",
  encomendas: "Olá, gostaria de solicitar um orçamento para eventos",
  presentes: "Olá, gostaria de informações sobre as caixas para presente",
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
