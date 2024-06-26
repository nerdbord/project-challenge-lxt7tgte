import styles from "./LogInScreen.module.css";
import loginImage from "../../assets/loginImage.png";
import { supabase } from "../../helpers/supabaseClient";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

const LogInScreen = () => {
  const [email, setEmail] = useState<string>("");

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const googleLog = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const user = useUser();
  if (user) {
    console.log("user", user);
  } else {
    console.log("error");
  }

  async function magicLink() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert("Error to conect with supabase"); // zrobić notistack pod to
    } else {
      alert("Check your email");
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <img className={styles.img} src={loginImage} alt="login image" />
      </div>
      <div className={styles.container}>
        <p className={styles.title}>
          To add or browes files you need to log in!
        </p>
        <form className={styles.form} action="">
          <label htmlFor="username">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="username"
            name="username"
          />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit" value="Submit">
            LogIn
          </button>
        </form>
        <button onClick={() => magicLink()}>Get Magic Link</button>
        <button onClick={login}>TEST GH</button>
        <button onClick={googleLog}>Google Log</button>
        <p className={styles.subtitle}>
          Don't have an account? <a href="">SignIn</a>
        </p>
      </div>
    </div>
  );
};

export default LogInScreen;
