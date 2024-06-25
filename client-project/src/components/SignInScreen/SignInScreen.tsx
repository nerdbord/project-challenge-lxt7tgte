import styles from "./SignInScreen.module.css";
import login from "../../assets/login.png";

const SignInScreen = () => {
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <img className={styles.img} src={login} alt="login image" />
      </div>
      <div className={styles.container}>
        <p className={styles.title}>Join us!</p>
        <form className={styles.form} action="">
          <label htmlFor="username">Email:</label>
          <input type="text" id="username" name="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit" value="Submit">
            SignIn
          </button>
        </form>
        <p className={styles.subtitle}>
          Already a member? <a href="">LogIn</a>
        </p>
      </div>
    </div>
  );
};

export default SignInScreen;
