import styles from "./LogInScreen.module.css";
import login from "../../assets/login.png";

const LogInScreen = () => {
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <img className={styles.img} src={login} alt="login image" />
      </div>
      <div className={styles.container}>
        <p className={styles.title}>
          To add or browes files you need to log in!
        </p>
        <form className={styles.form} action="">
          <label htmlFor="username">Email</label>
          <input type="email" id="username" name="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit" value="Submit">
            LogIn
          </button>
        </form>
        <p className={styles.subtitle}>
          Don't have an account? <a href="">SignIn</a>
        </p>
      </div>
    </div>
  );
};

export default LogInScreen;
