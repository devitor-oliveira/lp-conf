import { motion } from "motion/react";
import RedHeroIMG from "@/assets/doce-vermelho.png";

import styles from "@/components/Carrosel/Carrosel.module.scss";

function Carrosel() {
  return (
    <div className={styles.wrapper}>
      <div className={styles["content-wrapper"]}>
        <motion.div
          // initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className={styles.content}
        >
          <h1>Display title</h1>
          <p>description</p>
          <button type="button">botão</button>
        </motion.div>
        <div className={styles.canvas}>
          <img src={RedHeroIMG} alt="" />
        </div>
      </div>
      <motion.div className={styles.dock}>
        <span className={styles["left-bar"]}></span>
        <div className={styles.dockItems}>
          <button type="button">
            <span>01</span>
          </button>
          <button type="button">
            <span>02</span>
          </button>
          <button type="button">
            <span>03</span>
          </button>
        </div>
        <span className={styles["right-bar"]}></span>
      </motion.div>
    </div>
  );
}

export default Carrosel;
