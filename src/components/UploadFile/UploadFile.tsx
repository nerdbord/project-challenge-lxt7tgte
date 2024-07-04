import { useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import styles from "./UploadFile.module.css";
import { v4 as uuidv4 } from "uuid";
import { FileObject } from "@supabase/storage-js";
import { TbCopy } from "react-icons/tb";
import { useAppStore } from "../../store";
import { useSnackbar } from "notistack";

const UploadFile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { images, setImages, uploadedImageUrl, setUploadedImageUrl } =
    useAppStore();

  const user = useUser();
  const supabase = useSupabaseClient();

  console.log(user);
  useEffect(() => {
    getImages();
  }, [user, images]);

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
        .getPublicUrl(filePath, {
          transform: {
            width: 500,
            height: 600,
          },
        });
      setUploadedImageUrl(publicData.publicUrl);
      getImages();
      enqueueSnackbar("Photo was uploaded successfully", {
        variant: "success",
      });
    } else {
      console.log("error", error);
    }
  }

  const copyToClipboard = () => {
    if (uploadedImageUrl) {
      navigator.clipboard.writeText(uploadedImageUrl);
      enqueueSnackbar("URL copied to clipboard", {
        variant: "success",
      });
    }
  };

  return (
    <div className={styles.container}>
      <form>
        <input
          type="file"
          id="fileUpload"
          accept="image/png, image/jpeg"
          onChange={(e) => uploadImage(e)}
          className={styles.uploadbox}
        />
        <label htmlFor="fileUpload" className={styles.uploadLabel}>
          <h2>Upload files</h2>
          Drag & Drop your files or <span>choose files</span>
          <p className={styles.subtitle}>500 MB max file size.</p>
        </label>
      </form>

      <div className={styles.imglink}>
        {uploadedImageUrl && (
          <>
            <p>Your IMG Link:</p>
            <a
              href={uploadedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {uploadedImageUrl}
            </a>
            <button className={styles.button} onClick={copyToClipboard}>
              Copy URL to Image <TbCopy />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
