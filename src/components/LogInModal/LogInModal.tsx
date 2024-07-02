import Modal from "react-modal";
import styles from "./LogInModal.module.css";
import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store.ts";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdClose } from "react-icons/md";

Modal.setAppElement("#root");

const LogInModal = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) => {
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
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
    </Modal>
  );
};

export default LogInModal;
