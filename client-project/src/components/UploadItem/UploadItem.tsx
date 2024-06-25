import styles from "./UploadItem.module.css";

const UploadItem = () => {
  return (
    <div className={styles.item}>
      <p>File Name</p>
      <div className={styles.buttonbox}>
        <button>Delete</button>
        <button>Download</button>
      </div>
    </div>
  );
};

export default UploadItem;
