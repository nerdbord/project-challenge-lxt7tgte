import { motion } from "framer-motion";
import styles from "./Landing.module.css";
import CloudLogo from "../../assets/CloudImages2.png";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { useAppStore } from "../../store";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { TbCopy } from "react-icons/tb";

const Landing = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setUploadedImageUrl } = useAppStore();
  const supabase = useSupabaseClient();
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrlLocal] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  async function uploadImageWhenUserNotExist(file: File) {
    setUploading(true);
    const filePath = `temporary/${uuidv4()}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("temporary")
      .upload(filePath, file);

    if (uploadError) {
      console.log("Błąd przesyłania pliku", uploadError);
      setUploading(false);
      return;
    }

    console.log("Plik został przesłany, dane uploadData:", uploadData);

    if (uploadData) {
      const { data: signedData, error: signedError } = await supabase.storage
        .from("temporary")
        .createSignedUrl(uploadData.path, 120);

      if (signedError) {
        console.log("Błąd tworzenia podpisanego URL", signedError);
      } else {
        console.log(
          "Tworzenie podpisanego URL zakończone sukcesem",
          signedData.signedUrl
        );
        setUploadedImageUrl(signedData.signedUrl);
        setUploadedImageUrlLocal(signedData.signedUrl);
        setShowModal(true);
      }
    } else {
      console.log("uploadData jest null lub undefined");
    }
    setUploading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageWhenUserNotExist(file);
    }
  };

  const handleLogoClick = () => {
    document.getElementById("fileUpload")?.click();
  };

  const copyToClipboard = () => {
    if (uploadedImageUrl) {
      navigator.clipboard.writeText(uploadedImageUrl);
      enqueueSnackbar("URL skopiowany do schowka", {
        variant: "success",
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadedImageUrlLocal(null);
  };

  return (
    <motion.div
      className={styles.infobox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={CloudLogo}
        alt="cloud"
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      />
      <input
        type="file"
        id="fileUpload"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <motion.p
        className={styles.title}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        With this CloudStore you can easily upload your images and receive a
        direct link to share or use anywhere you need!
      </motion.p>
      <motion.p
        className={styles.subtitle}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        Just drag and drop your image files or choose files from your device,
        and we'll take care of the rest. Once uploaded, you'll get a unique link
        to your image that you can copy and use as you wish. Enjoy seamless
        image sharing with our simple and efficient tool!
      </motion.p>
      {uploading && <div className={styles.loader}>Loading...</div>}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>This is your URL</p>
            <button className={styles.button} onClick={copyToClipboard}>
              Copy URL <TbCopy />
            </button>
            <button className={styles.closeButton} onClick={closeModal}>
              Zamknij
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Landing;
