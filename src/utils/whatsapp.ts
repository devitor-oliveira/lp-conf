export const DEFAULT_WHATSAPP_PHONE = "5511999999999";
export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Gostaria de fazer uma encomenda dos doces artesanais.";

/**
 * Monta a URL do wa.me com telefone sanitizado e mensagem codificada.
 */
export function buildWhatsAppUrl(
  phone: string = DEFAULT_WHATSAPP_PHONE,
  message: string = DEFAULT_WHATSAPP_MESSAGE,
): string {
  const sanitizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}
