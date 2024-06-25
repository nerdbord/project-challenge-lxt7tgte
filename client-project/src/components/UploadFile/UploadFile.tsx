import styles from "./UploadFile.module.css";

const UploadFile = () => {
  return (
    <div className={styles.upload}>
      <h2>Upload files</h2>
      <div className={styles.uploadbox}>
        <p>
          Drag & Drop your files or <a href="">choose files</a>
          <p className={styles.subtitle}>500 MB max file size.</p>
        </p>
        <br />
      </div>
      <div className={styles.buttons}>
        <button className={styles.button}>Upload</button>
        <button className={styles.button}>Cancel</button>
      </div>
    </div>
  );
};

export default UploadFile;
