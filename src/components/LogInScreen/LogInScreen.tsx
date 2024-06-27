import styles from "./LogInScreen.module.css";
import loginImage from "../../assets/loginImage.png";
import { supabase } from "../../helpers/supabaseClient";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useAppStore } from "../../store.ts";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LogInScreen = () => {
  const { email, setEmail, errorMsg, setErrorMsg } = useAppStore();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      //setErrorMsg("Error connecting to supabase");
    }
  }, [user]);

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

  async function magicLink() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });
    console.log(data);
    if (error) {
      setErrorMsg("error connecting to supabase"); // zrobić notistack pod to
    } else {
      setErrorMsg("Check your email");
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <img className={styles.img} src={loginImage} alt="login image" />
      </div>
      <div className={styles.container}>
        <p className={styles.title}>
          To add or browse files you need to log in!
        </p>
        <form className={styles.form} action="">
          <label htmlFor="username">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="username"
            name="username"
          />
        </form>
        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        <div className={styles.buttonBox}>
          <button className={styles.button} onClick={() => magicLink()}>
            Send Magic Link
          </button>
          <button className={styles.button} onClick={login}>
            GitHub <FaGithub />
          </button>
          <button className={styles.button} onClick={googleLog}>
            Google <FcGoogle />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogInScreen;
