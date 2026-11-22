import { motion, useReducedMotion } from "motion/react";
import type { MenuProcessStep } from "@/utils/mockdata";
import styles from "./MenuProcessSteps.module.scss";

export interface MenuProcessStepsProps {
  readonly steps: readonly MenuProcessStep[];
}

export function MenuProcessSteps({ steps }: MenuProcessStepsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={styles.wrapper}>
      <ol className={styles.stepsGrid} aria-label="Como funciona o processo de pedido">
        {steps.map((step, index) => (
          <motion.li
            key={step.number}
            className={styles.stepCard}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: shouldReduceMotion ? 0 : index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className={styles.stepNumber} aria-hidden="true">
              {step.number}
            </span>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
