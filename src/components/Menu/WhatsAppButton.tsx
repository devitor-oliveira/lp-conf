import { Check, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./WhatsAppButton.module.scss";

export interface WhatsAppButtonProps {
  readonly presetMessage: string;
  readonly productName: string;
  readonly className?: string;
}

export function WhatsAppButton({ presetMessage, productName, className }: WhatsAppButtonProps) {
  const [isTriggered, setIsTriggered] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isTriggered) return;
    setIsTriggered(true);

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(presetMessage)}`;

    timerRef.current = window.setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setIsTriggered(false);
      timerRef.current = null;
    }, 500);
  };

  return (
    <button
      type="button"
      disabled={isTriggered}
      aria-busy={isTriggered}
      aria-live="polite"
      className={`${styles.whatsappBtn} ${isTriggered ? styles.whatsappTriggered : ""} ${className ?? ""}`}
      onClick={handleClick}
      aria-label={
        isTriggered
          ? `Abrindo WhatsApp para pedir ${productName}...`
          : `Pedir ${productName} via WhatsApp`
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {isTriggered ? (
          <motion.span
            key="confirming"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={styles.contentRow}
          >
            <Check size={18} aria-hidden="true" />
            <span>Abrindo WhatsApp...</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={styles.contentRow}
          >
            <MessageCircle size={18} aria-hidden="true" />
            <span>Pedir no WhatsApp</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
