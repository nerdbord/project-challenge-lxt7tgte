import { useEffect, useRef } from "react";
import styles from "./LogInModal.module.css";
import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store.ts";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdClose } from "react-icons/md";

const LogInModal = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) => {
  const { email, setEmail, errorMsg, setErrorMsg } = useAppStore();
  const modalRef = useRef<HTMLDivElement>(null);

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
      setErrorMsg("error connecting to supabase");
    } else {
      setErrorMsg("Check your email");
    }
  }

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? onRequestClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onRequestClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onRequestClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onRequestClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closebtn} onClick={onRequestClose}>
          <MdClose />
        </button>
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
      </div>
    </div>
  );
};

export default LogInModal;
