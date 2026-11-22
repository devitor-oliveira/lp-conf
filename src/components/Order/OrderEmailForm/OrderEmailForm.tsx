import { CheckCircle2, Loader2, Send } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./OrderEmailForm.module.scss";

type FormStatus = "idle" | "submitting" | "success";

interface EmailFormData {
  readonly name: string;
  readonly email: string;
  readonly occasion: string;
  readonly eventDate: string;
  readonly message: string;
}

const INITIAL_FORM_DATA: EmailFormData = {
  name: "",
  email: "",
  occasion: "casamento",
  eventDate: "",
  message: "",
};

const OCCASION_OPTIONS: readonly { readonly value: string; readonly label: string }[] = [
  { value: "casamento", label: "Casamento / Recepção" },
  { value: "corporativo", label: "Evento Corporativo / B2B" },
  { value: "aniversario", label: "Aniversário / Celebração Íntima" },
  { value: "presentes", label: "Encomenda de Caixas para Presente" },
] as const;

export function OrderEmailForm() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState<EmailFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    timerRef.current = window.setTimeout(() => {
      setStatus("success");
    }, 650);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setStatus("idle");
  };

  return (
    <motion.div
      id="order-panel-email"
      role="tabpanel"
      aria-labelledby="order-tab-email"
      className={styles.panelCard}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {status === "success" ? (
        <div className={styles.successState} role="status" aria-live="polite">
          <div className={styles.successIconWrapper}>
            <CheckCircle2 size={36} aria-hidden="true" />
          </div>
          <h3 className={styles.successTitle}>Solicitação registrada com carinho</h3>
          <p className={styles.successDescription}>
            Obrigado, <strong>{formData.name || "visitante"}</strong>. Recebemos o briefing para{" "}
            <strong>
              {OCCASION_OPTIONS.find((opt) => opt.value === formData.occasion)?.label ??
                "sua celebração"}
            </strong>{" "}
            e retornaremos em até 24 horas úteis para o endereço <strong>{formData.email}</strong>.
          </p>
          <button type="button" onClick={handleReset} className={styles.resetButton}>
            Enviar outra solicitação
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Fale Conosco por E-mail</h3>
            <p className={styles.formSubtitle}>
              Ideal para cerimonialistas, empresas e eventos que precisam de orçamento detalhado por
              escrito.
            </p>
          </div>

          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="order-name" className={styles.label}>
                Nome completo
              </label>
              <input
                id="order-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ex.: Mariana Silva"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                disabled={status === "submitting"}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="order-email" className={styles.label}>
                E-mail para retorno
              </label>
              <input
                id="order-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="mariana@exemplo.com.br"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                disabled={status === "submitting"}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="order-occasion" className={styles.label}>
                Tipo de ocasião
              </label>
              <select
                id="order-occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className={styles.input}
                disabled={status === "submitting"}
              >
                {OCCASION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="order-date" className={styles.label}>
                Data prevista (opcional)
              </label>
              <input
                id="order-date"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                className={styles.input}
                disabled={status === "submitting"}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="order-message" className={styles.label}>
              Detalhes, quantidade estimada ou sabores desejados
            </label>
            <textarea
              id="order-message"
              name="message"
              rows={4}
              required
              placeholder="Conte-nos sobre o número de convidados, sabores favoritos ou necessidades especiais..."
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              disabled={status === "submitting"}
            />
          </div>

          <div className={styles.submitRow}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={18} className={styles.spinner} aria-hidden="true" />
                  <span>Enviando solicitação...</span>
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" />
                  <span>Enviar Mensagem por E-mail</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
