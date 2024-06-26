import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import styles from "./UploadFile.module.css";
import { v4 as uuidv4 } from "uuid";
import { FileObject } from "@supabase/storage-js";

const UploadFile = ({ onLogout }: { onLogout: () => void }) => {
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      onLogout();
    }
  };

  const [images, setImages] = useState<FileObject[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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

    const filePath = `${user.id}/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (data) {
      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);
      setUploadedImageUrl(publicData.publicUrl);
      getImages();
    } else {
      console.log("error", error);
    }
  }

  const copyToClipboard = () => {
    if (uploadedImageUrl) {
      navigator.clipboard.writeText(uploadedImageUrl);
      alert("URL copied to clipboard");
    }
  };

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
        {uploadedImageUrl && (
          <>
            <p>
              Your IMG Link:{" "}
              <a
                href={uploadedImageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {uploadedImageUrl}
              </a>
            </p>
            <button onClick={copyToClipboard}>Copy URL to Image</button>
          </>
        )}
      </div>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default UploadFile;
