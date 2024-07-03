import styles from "./MyUploads.module.css";
import UploadItems from "../../UploadItems/UploadItems";

const MyUploads = () => {
  return (
    <div className={styles.myuploads}>
      <h2 className={styles.title}>MyUploads</h2>
      <div className={styles.itembox}>
        <UploadItems />
      </div>
    </div>
  );
};

export default MyUploads;
