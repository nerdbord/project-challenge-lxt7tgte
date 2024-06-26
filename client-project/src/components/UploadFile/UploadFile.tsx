import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import styles from "./UploadFile.module.css";
import { v4 as uuidv4 } from "uuid";
import { FileObject } from "@supabase/storage-js";

const UploadFile = () => {
  const [images, setImages] = useState<FileObject[]>([]);
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    getImages();
  }, [user]);

  async function getImages() {
    if (!user) return;
    const { data, error } = await supabase.storage
      .from("images")
      .list(`${user.id}/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data as FileObject[]);
    } else {
      console.log(error);
    }
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${user.id}/${uuidv4()}`, file);

    if (data) {
      getImages();
    } else {
      console.log("error", error);
    }
  }

  return (
    <div className={styles.upload}>
      <h2>Upload files</h2>
      <form>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => uploadImage(e)}
          className={styles.uploadbox}
        />
        <p>
          Drag & Drop your files or <a href="#">choose files</a>
        </p>
        <p className={styles.subtitle}>500 MB max file size.</p>
      </form>
      <div className={styles.buttons}>
        {/* <button className={styles.button}>Upload</button> */}
        {/* <button className={styles.button}>Cancel</button> */}
      </div>
    </div>
  );
};

export default UploadFile;
