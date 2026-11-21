export const DEFAULT_WHATSAPP_PHONE = "5511999999999";
export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Gostaria de fazer uma encomenda dos doces artesanais.";

export const WHATSAPP_PRESET_MESSAGES = {
  delivery: "Olá, gostaria de consultar a pronta-entrega do dia",
  encomendas: "Olá, gostaria de solicitar um orçamento para eventos",
  presentes: "Olá, gostaria de informações sobre as caixas para presente",
} as const;

/**
 * Monta a URL canônica do wa.me com telefone sanitizado e mensagem codificada.
 */
export function buildWhatsAppUrl(
  phone: string = DEFAULT_WHATSAPP_PHONE,
  message: string = DEFAULT_WHATSAPP_MESSAGE,
): string {
  const sanitizedPhone = phone.replace(/\D/g, "");
  const trimmedMessage = message.trim();
  return `https://wa.me/${sanitizedPhone}${trimmedMessage ? `?text=${encodeURIComponent(trimmedMessage)}` : ""}`;
}
