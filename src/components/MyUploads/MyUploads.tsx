import styles from "./MyUploads.module.css";
import UploadItem from "../UploadItem/UploadItem";
import { supabase } from "../../helpers/supabaseClient";

const MyUploads = ({ onLogout }: { onLogout: () => void }) => {
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      onLogout();
    }
  };

  return (
    <div className={styles.myuploads}>
      <h2 className={styles.title}>MyUploads</h2>
      <div className={styles.itembox}>
        <UploadItem />
        <UploadItem />
        <UploadItem />
        <UploadItem />
        <UploadItem />
        <UploadItem />
        <UploadItem />
        <UploadItem />
      </div>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default MyUploads;
