import { Check, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_WHATSAPP_PHONE, getWhatsAppUrl } from "@/utils/constants";
import styles from "./WhatsAppButton.module.scss";

export interface WhatsAppButtonProps {
  readonly presetMessage: string;
  readonly productName: string;
}

const CONFIRM_DURATION_MS = 2200;

export function WhatsAppButton({ presetMessage, productName }: WhatsAppButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    setIsConfirming(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsConfirming(false);
      timeoutRef.current = null;
    }, CONFIRM_DURATION_MS);
  };

  const whatsappUrl = getWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, presetMessage);
  const accessibleLabel = isConfirming
    ? `Abrindo WhatsApp para pedir ${productName}`
    : `Pedir ${productName} no WhatsApp`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={styles.whatsappBtn}
      data-confirming={isConfirming ? "true" : undefined}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {isConfirming ? (
        <Check size={24} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        <MessageCircle size={24} strokeWidth={2.2} aria-hidden="true" />
      )}
    </a>
  );
}
