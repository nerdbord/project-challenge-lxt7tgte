import { motion } from "framer-motion";
import styles from "./Landing.module.css";
import CloudLogo from "../../assets/CloudImages2.png";

const Landing = () => {
  return (
    <motion.div
      className={styles.infobox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={CloudLogo}
        alt="cloud"
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.p
        className={styles.title}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        With this CloudStore you can easily upload your images and receive a
        direct link to share or use anywhere you need!
      </motion.p>
      <motion.p
        className={styles.subtitle}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        Just drag and drop your image files or choose files from your device,
        and we'll take care of the rest. Once uploaded, you'll get a unique link
        to your image that you can copy and use as you wish. Enjoy seamless
        image sharing with our simple and efficient tool!
      </motion.p>
    </motion.div>
  );
};

export default Landing;
