import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  getQuantityOptionsForTier,
  ORDER_MENU_OPTIONS_BY_TIER,
  ORDER_OCCASION_OPTIONS,
  ORDER_PRESET_MESSAGES_BY_TIER,
  type OrderServiceTier,
} from "@/utils/orderData";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_PHONE } from "@/utils/whatsapp";
import styles from "./OrderLeadForm.module.scss";

export interface OrderLeadFormProps {
  readonly selectedTier: OrderServiceTier;
  readonly presetProductName?: string;
  readonly onTierChange: (tier: OrderServiceTier) => void;
}

type FormStatus = "idle" | "submitting" | "success";
type ValidatedField = "name" | "email" | "message";

interface LeadFormData {
  readonly name: string;
  readonly email: string;
  readonly eventDate: string;
  readonly message: string;
}

type LeadFormErrors = Partial<Record<ValidatedField, string>>;
type LeadFormTouched = Partial<Record<ValidatedField, boolean>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: ValidatedField, value: string): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      if (trimmed.length < 2) {
        return "Informe seu nome completo (mínimo de 2 caracteres).";
      }
      return undefined;
    case "email":
      if (!EMAIL_REGEX.test(trimmed)) {
        return "Informe um e-mail válido para retorno (ex.: nome@dominio.com).";
      }
      return undefined;
    case "message":
      if (trimmed.length < 8) {
        return "Escolha uma mensagem pronta ou descreva seu pedido (mínimo de 8 caracteres).";
      }
      return undefined;
  }
}

interface BuildMessageParams {
  readonly tier: OrderServiceTier;
  readonly productValue: string;
  readonly quantityValue: string;
  readonly presetId: string;
  readonly name: string;
  readonly email: string;
  readonly eventDate: string;
}

function composeLiveMessage({
  tier,
  productValue,
  quantityValue,
  presetId,
  name,
  email,
  eventDate,
}: BuildMessageParams): string {
  const menuOptions = ORDER_MENU_OPTIONS_BY_TIER[tier];
  const productOpt = menuOptions.find((opt) => opt.value === productValue) ?? menuOptions[0];
  const quantityOptions = getQuantityOptionsForTier(tier, productOpt?.unitsPerBox);
  const quantityOpt =
    quantityOptions.find((opt) => opt.value === quantityValue) ?? quantityOptions[0];
  const presets = ORDER_PRESET_MESSAGES_BY_TIER[tier];
  const preset = presets.find((p) => p.id === presetId) ?? presets[0];
  const occasionLabel =
    ORDER_OCCASION_OPTIONS.find((opt) => opt.value === tier)?.label ?? "Atendimento";

  if (!preset) return "";

  return preset.buildText({
    name,
    email,
    occasionLabel,
    productLabel: productOpt?.label ?? "",
    quantityLabel: quantityOpt?.label ?? "",
    eventDate: tier !== "pedidos-whatsapp" ? eventDate : undefined,
  });
}

export function OrderLeadForm({
  selectedTier,
  presetProductName,
  onTierChange,
}: OrderLeadFormProps) {
  const menuOptions = ORDER_MENU_OPTIONS_BY_TIER[selectedTier];
  const presetMessages = ORDER_PRESET_MESSAGES_BY_TIER[selectedTier];

  const [selectedProduct, setSelectedProduct] = useState<string>(menuOptions[0]?.value ?? "");
  const activeProductOption =
    menuOptions.find((opt) => opt.value === selectedProduct) ?? menuOptions[0];

  const quantityOptions = getQuantityOptionsForTier(selectedTier, activeProductOption?.unitsPerBox);
  const [selectedQuantity, setSelectedQuantity] = useState<string>(quantityOptions[0]?.value ?? "");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presetMessages[0]?.id ?? "");
  const [isManualMessage, setIsManualMessage] = useState<boolean>(false);

  const [formData, setFormData] = useState<LeadFormData>(() => ({
    name: "",
    email: "",
    eventDate: "",
    message: composeLiveMessage({
      tier: selectedTier,
      productValue: menuOptions[0]?.value ?? "",
      quantityValue: quantityOptions[0]?.value ?? "",
      presetId: presetMessages[0]?.id ?? "",
      name: "",
      email: "",
      eventDate: "",
    }),
  }));

  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [touched, setTouched] = useState<LeadFormTouched>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const isManualMessageRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const activeOccasion =
    ORDER_OCCASION_OPTIONS.find((opt) => opt.value === selectedTier) ?? ORDER_OCCASION_OPTIONS[0];
  const activeQuantityOption =
    quantityOptions.find((opt) => opt.value === selectedQuantity) ?? quantityOptions[0];

  const activeProductLabel = activeProductOption?.label ?? "";
  const activeQuantityLabel = activeQuantityOption?.label ?? "";

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const nextMenuOptions = ORDER_MENU_OPTIONS_BY_TIER[selectedTier];
    const matchedProduct = presetProductName
      ? nextMenuOptions.find((opt) => opt.matchProductName === presetProductName)
      : undefined;
    const nextProductOpt = matchedProduct ?? nextMenuOptions[0];
    const nextProductValue = nextProductOpt?.value ?? "";
    const nextQuantityOptions = getQuantityOptionsForTier(
      selectedTier,
      nextProductOpt?.unitsPerBox,
    );
    const nextQuantityValue = nextQuantityOptions[0]?.value ?? "";
    const nextPresetId = ORDER_PRESET_MESSAGES_BY_TIER[selectedTier][0]?.id ?? "";

    setSelectedProduct(nextProductValue);
    setSelectedQuantity(nextQuantityValue);
    setSelectedPresetId(nextPresetId);

    if (matchedProduct) {
      setStatus((prev) => (prev === "success" ? "idle" : prev));
    }

    if (!isManualMessageRef.current) {
      setFormData((prev) => ({
        ...prev,
        message: composeLiveMessage({
          tier: selectedTier,
          productValue: nextProductValue,
          quantityValue: nextQuantityValue,
          presetId: nextPresetId,
          name: prev.name,
          email: prev.email,
          eventDate: prev.eventDate,
        }),
      }));
      setErrors((prev) => ({ ...prev, message: undefined }));
    }
  }, [selectedTier, presetProductName]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextProductValue = e.target.value;
    const nextProductOpt = menuOptions.find((opt) => opt.value === nextProductValue);
    const nextQuantityOptions = getQuantityOptionsForTier(
      selectedTier,
      nextProductOpt?.unitsPerBox,
    );
    const nextQuantityValue = nextQuantityOptions.some((opt) => opt.value === selectedQuantity)
      ? selectedQuantity
      : (nextQuantityOptions[0]?.value ?? "");

    setSelectedProduct(nextProductValue);
    setSelectedQuantity(nextQuantityValue);

    if (!isManualMessageRef.current) {
      setFormData((prev) => ({
        ...prev,
        message: composeLiveMessage({
          tier: selectedTier,
          productValue: nextProductValue,
          quantityValue: nextQuantityValue,
          presetId: selectedPresetId,
          name: prev.name,
          email: prev.email,
          eventDate: prev.eventDate,
        }),
      }));
      setErrors((prev) => ({ ...prev, message: undefined }));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextQuantityValue = e.target.value;
    setSelectedQuantity(nextQuantityValue);

    if (!isManualMessageRef.current) {
      setFormData((prev) => ({
        ...prev,
        message: composeLiveMessage({
          tier: selectedTier,
          productValue: selectedProduct,
          quantityValue: nextQuantityValue,
          presetId: selectedPresetId,
          name: prev.name,
          email: prev.email,
          eventDate: prev.eventDate,
        }),
      }));
      setErrors((prev) => ({ ...prev, message: undefined }));
    }
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextPresetId = e.target.value;
    setSelectedPresetId(nextPresetId);
    isManualMessageRef.current = false;
    setIsManualMessage(false);

    setFormData((prev) => ({
      ...prev,
      message: composeLiveMessage({
        tier: selectedTier,
        productValue: selectedProduct,
        quantityValue: selectedQuantity,
        presetId: nextPresetId,
        name: prev.name,
        email: prev.email,
        eventDate: prev.eventDate,
      }),
    }));
    setErrors((prev) => ({ ...prev, message: undefined }));
  };

  const handleRestoreAutoMessage = () => {
    isManualMessageRef.current = false;
    setIsManualMessage(false);

    setFormData((prev) => ({
      ...prev,
      message: composeLiveMessage({
        tier: selectedTier,
        productValue: selectedProduct,
        quantityValue: selectedQuantity,
        presetId: selectedPresetId,
        name: prev.name,
        email: prev.email,
        eventDate: prev.eventDate,
      }),
    }));
    setErrors((prev) => ({ ...prev, message: undefined }));
    messageInputRef.current?.focus();
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "message") {
      isManualMessageRef.current = true;
      setIsManualMessage(true);
    }

    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      if (name !== "message" && !isManualMessageRef.current) {
        return {
          ...nextData,
          message: composeLiveMessage({
            tier: selectedTier,
            productValue: selectedProduct,
            quantityValue: selectedQuantity,
            presetId: selectedPresetId,
            name: nextData.name,
            email: nextData.email,
            eventDate: nextData.eventDate,
          }),
        };
      }
      return nextData;
    });

    if (name === "name" || name === "email" || name === "message") {
      if (touched[name]) {
        const nextError = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: nextError }));
      }
    }
  };

  const handleFieldBlur = (field: ValidatedField, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const nextErrors: LeadFormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setTouched({ name: true, email: true, message: true });
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (nextErrors.message) {
      messageInputRef.current?.focus();
      return;
    }

    setStatus("submitting");
    timerRef.current = window.setTimeout(() => {
      setStatus("success");
    }, 650);
  };

  const handleReset = () => {
    const defaultProduct = menuOptions[0]?.value ?? "";
    const defaultQty = quantityOptions[0]?.value ?? "";
    const defaultPreset = presetMessages[0]?.id ?? "";

    isManualMessageRef.current = false;
    setIsManualMessage(false);
    setSelectedProduct(defaultProduct);
    setSelectedQuantity(defaultQty);
    setSelectedPresetId(defaultPreset);
    setFormData({
      name: "",
      email: "",
      eventDate: "",
      message: composeLiveMessage({
        tier: selectedTier,
        productValue: defaultProduct,
        quantityValue: defaultQty,
        presetId: defaultPreset,
        name: "",
        email: "",
        eventDate: "",
      }),
    });
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const showDateField = selectedTier !== "pedidos-whatsapp";

  const compiledWhatsAppMessage = formData.message.trim();
  const compiledWhatsAppUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, compiledWhatsAppMessage);

  return (
    <motion.div
      className={styles.formCard}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {status === "success" ? (
        <div className={styles.successState} role="status" aria-live="polite">
          <div className={styles.successIconWrapper}>
            <CheckCircle2 size={36} aria-hidden="true" />
          </div>
          <h3 className={styles.successTitle}>Solicitação registrada com carinho</h3>
          <p className={styles.successDescription}>
            Obrigado, <strong>{formData.name.trim()}</strong>. Recebemos sua solicitação de{" "}
            <strong>{activeOccasion?.label}</strong> ({activeProductLabel} • {activeQuantityLabel})
            e responderemos em até 24 horas úteis para <strong>{formData.email.trim()}</strong>.
          </p>

          <div className={styles.successActions}>
            <a
              href={compiledWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappShortcutButton}
              aria-label="Agilizar este pedido enviando o resumo pelo WhatsApp (abre em nova aba)"
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>Agilizar pelo WhatsApp</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>

            <button type="button" onClick={handleReset} className={styles.resetButton}>
              Enviar outra solicitação
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>Envie sua solicitação</h3>
            <p className={styles.formSubtitle}>
              A mensagem se monta automaticamente conforme seus dados. Retorno em até 24h úteis.
            </p>
          </div>

          <fieldset className={styles.occasionFieldset}>
            <legend className={styles.label}>Modalidade do pedido</legend>
            <div className={styles.pillsGroup}>
              {ORDER_OCCASION_OPTIONS.map((opt) => {
                const isSelected = selectedTier === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`${styles.pillOption} ${isSelected ? styles.pillOptionActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="occasion"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => onTierChange(opt.value)}
                      className={styles.srOnlyRadio}
                      disabled={status === "submitting"}
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
            {activeOccasion && <p className={styles.occasionHint}>{activeOccasion.shortHint}</p>}
          </fieldset>

          <div className={styles.pairedSelectsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="order-product" className={styles.label}>
                Opção do cardápio
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="order-product"
                  name="product"
                  value={selectedProduct}
                  onChange={handleProductChange}
                  className={styles.select}
                  disabled={status === "submitting"}
                >
                  {menuOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className={styles.selectOption}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className={styles.selectChevron} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="order-quantity" className={styles.label}>
                Quantidade
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="order-quantity"
                  name="quantity"
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                  className={styles.select}
                  disabled={status === "submitting"}
                >
                  {quantityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className={styles.selectOption}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className={styles.selectChevron} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="order-name" className={styles.label}>
              Nome completo
            </label>
            <input
              ref={nameInputRef}
              id="order-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ex.: Mariana Silva"
              value={formData.name}
              onChange={handleFieldChange}
              onBlur={(e) => handleFieldBlur("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "order-name-error" : undefined}
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              disabled={status === "submitting"}
            />
            {errors.name && (
              <p id="order-name-error" className={styles.errorText} role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="order-email" className={styles.label}>
              E-mail para retorno
            </label>
            <input
              ref={emailInputRef}
              id="order-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="mariana@exemplo.com.br"
              value={formData.email}
              onChange={handleFieldChange}
              onBlur={(e) => handleFieldBlur("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "order-email-error" : undefined}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              disabled={status === "submitting"}
            />
            {errors.email && (
              <p id="order-email-error" className={styles.errorText} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {showDateField && (
            <div className={styles.fieldGroup}>
              <label htmlFor="order-date" className={styles.label}>
                Data prevista <span className={styles.optionalTag}>(opcional)</span>
              </label>
              <input
                id="order-date"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleFieldChange}
                className={styles.input}
                disabled={status === "submitting"}
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="order-preset-message" className={styles.label}>
              Mensagem pronta
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="order-preset-message"
                name="presetMessage"
                value={selectedPresetId}
                onChange={handlePresetChange}
                className={styles.select}
                disabled={status === "submitting"}
              >
                {presetMessages.map((preset) => (
                  <option key={preset.id} value={preset.id} className={styles.selectOption}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className={styles.selectChevron} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="order-message" className={styles.label}>
                Mensagem montada (editável)
              </label>
              {isManualMessage && (
                <button
                  type="button"
                  onClick={handleRestoreAutoMessage}
                  className={styles.restoreButton}
                  disabled={status === "submitting"}
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Restaurar texto automático</span>
                </button>
              )}
            </div>
            <textarea
              ref={messageInputRef}
              id="order-message"
              name="message"
              rows={2}
              required
              placeholder="Sua mensagem será montada automaticamente ou pode ser editada aqui..."
              value={formData.message}
              onChange={handleFieldChange}
              onBlur={(e) => handleFieldBlur("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "order-message-error" : undefined}
              className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
              disabled={status === "submitting"}
            />
            {errors.message && (
              <p id="order-message-error" className={styles.errorText} role="alert">
                {errors.message}
              </p>
            )}
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
                  <span>Solicitar Atendimento</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
