import styles from "./MyUploads.module.css";
import UploadItem from "../UploadItem/UploadItem";

const MyUploads = () => {
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
    </div>
  );
};

export default MyUploads;
