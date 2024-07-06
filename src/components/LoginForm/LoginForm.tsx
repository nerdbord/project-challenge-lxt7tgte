import { supabase } from "../../helpers/supabaseClient.ts";
import { useAppStore } from "../../store.ts";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const { email, setEmail, errorMsg, setErrorMsg } = useAppStore();

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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  async function magicLink() {
    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      setErrorMsg("Error connecting to Supabase");
    } else {
      setErrorMsg("Check your email");
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <p className={styles.title}>Log in to CloudStore</p>
        <form className={styles.form} action="">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="username"
            name="username"
            placeholder="Email"
          />
          {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        </form>

        <div className={styles.buttonBox}>
          <button className={styles.button} onClick={magicLink}>
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

export default LoginForm;
