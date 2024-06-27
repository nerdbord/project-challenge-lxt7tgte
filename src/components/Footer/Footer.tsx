import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className={styles.footer}>
      <p>@ {year} KAM DreamTeam </p>
    </div>
  );
};

export default Footer;
