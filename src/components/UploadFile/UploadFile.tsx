/* eslint-disable react-hooks/exhaustive-deps */
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
  const { setImages, uploadedImageUrl, setUploadedImageUrl } = useAppStore();
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!user) {
      return;
    } else {
      getImages();
    }
  }, [user]);

  async function getImages() {
    if (!user) return;

    const { data } = await supabase.storage.from("images").list(`${user.id}/`, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (data !== null) {
      setImages(data as FileObject[]);
    } else {
      enqueueSnackbar("Error fetching data. Please try again later.", {
        variant: "error",
      });
    }
  }

  async function uploadImage(file: File) {
    if (!user) return;

    const filePath = `${user.id}/${uuidv4()}`;

    const { data } = await supabase.storage
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
      await getImages();
      enqueueSnackbar("Photo was uploaded successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Error uploading image. Please try again later.", {
        variant: "error",
      });
    }
  }

  const handleDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadImage(files[0]);
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

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
          onChange={handleFileChange}
          className={styles.uploadbox}
        />
        <label
          htmlFor="fileUpload"
          className={styles.uploadLabel}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h2>Upload files</h2>
          Drag & Drop your files or <span>choose files</span>
          <p className={styles.subtitle}>500 MB max file size.</p>
        </label>
      </form>

      {uploadedImageUrl && (
        <div className={styles.imglink}>
          <button className={styles.button} onClick={copyToClipboard}>
            Your image is uploaded. Click here to copy URL <TbCopy />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
