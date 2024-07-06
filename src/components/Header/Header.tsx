import { useState } from "react";
import styles from "./Header.module.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { TbLogin, TbLogout, TbPlus } from "react-icons/tb";
import Logo from "../../assets/logo.png";
import Modal from "../Modal/Modal";
import UploadFile from "../UploadFile/UploadFile";
import LoginForm from "../LoginForm/LoginForm";

const Header = ({ onLogout }: { onLogout: () => void }) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const email = user?.email;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddImgModalOpen, setIsAddImgModalOpen] = useState(false);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      onLogout();
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openAddImgModal = () => {
    setIsAddImgModalOpen(true);
  };

  const closeAddImgModal = () => {
    setIsAddImgModalOpen(false);
  };

  return (
    <div className={styles.header}>
      {user ? (
        <>
          <h3>Logged in as {email}</h3>
          <div className={styles.buttonbox}>
            <button className={styles.button} onClick={openAddImgModal}>
              <span>Add Image </span>
              <TbPlus />
            </button>
            <button className={styles.button} onClick={logout}>
              <span>Log out</span>
              <TbLogout />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.logobox}>
            <img className={styles.logo} src={Logo} alt="cloud logo" />
            <h2>CloudStore</h2>
          </div>

          <div className={styles.buttonbox}>
            <button className={styles.button} onClick={openLoginModal}>
              <span>Log in </span>
              <TbLogin />
            </button>
          </div>
        </>
      )}

      <Modal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal}>
        <LoginForm />
      </Modal>
      <Modal isOpen={isAddImgModalOpen} onRequestClose={closeAddImgModal}>
        <UploadFile />
      </Modal>
    </div>
  );
};

export default Header;
