import styles from "./Landing.module.css";
import CloudLogo from "../../assets/CloudImages.png";

const Landing = () => {
  return (
    <div className={styles.infobox}>
      <img src={CloudLogo} alt="cloud" />
      <h1>Welcome to our Image Upload App!</h1>
      <h3>
        With this app, you can easily upload your images and receive a direct
        link to share or use anywhere you need!
      </h3>

      <p>
        Just drag and drop your image files or choose files from your device,
        and we'll take care of the rest. Once uploaded, you'll get a unique link
        to your image that you can copy and use as you wish. Enjoy seamless
        image sharing with our simple and efficient tool!
      </p>
    </div>
  );
};

export default Landing;
