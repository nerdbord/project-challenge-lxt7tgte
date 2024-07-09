/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store";
import styles from "./UploadedItems.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import {
  TbTrashX,
  TbCloudDownload,
  TbCopyPlus,
  TbArrowsMaximize,
} from "react-icons/tb";
import Modal from "../Modal/Modal";
import { motion } from "framer-motion";
import UploadFile from "../UploadFile/UploadFile";

const UploadedItems = () => {
  const { images, setImages } = useAppStore();
  const user = useUser();
  const [modalUrl, setModalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const getImages = useCallback(async () => {
    if (!user) {
      enqueueSnackbar("User is not defined. Please log in.", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .list(`${user.id}/`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error || !data) {
        enqueueSnackbar("Error fetching data. Please try again later.", {
          variant: "error",
        });
        return;
      }

      setImages(data);
    } catch {
      enqueueSnackbar("Error fetching data. Please try again later.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [user, enqueueSnackbar, setImages]);

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user, getImages]);

  const deleteImage = useCallback(
    async (imageName: string) => {
      setLoading(true);
      try {
        const { error } = await supabase.storage
          .from("images")
          .remove([`${user?.id}/${imageName}`]);

        if (error) {
          enqueueSnackbar("Something went wrong. Please try again.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Image has been successfully deleted", {
            variant: "success",
          });
          getImages();
        }
      } catch {
        enqueueSnackbar("An unexpected error occurred.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [user, enqueueSnackbar, getImages]
  );

  const handleMouseOpen = (url: string) => {
    setModalUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalUrl("");
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    enqueueSnackbar("URL copied to clipboard", { variant: "success" });
  };

  const CDNURL =
    "https://pprakrwwprhcswonwict.supabase.co/storage/v1/object/public/images/";

  useEffect(() => {
    const timeoutIds = images.map((x, index) =>
      setTimeout(() => {
        setVisibleItems((prev) => new Set(prev).add(x.name));
      }, index * 100)
    );

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [images]);

  return (
    <>
      {!loading && images.length === 0 && (
        <div className={styles.empty}>
          <h2>No images uploaded yet!</h2>
          <UploadFile />
        </div>
      )}
      <div className={styles.items}>
        {!loading &&
          images.map((x) => {
            const imageUrl = `${CDNURL}${user?.id}/${x.name}`;
            const downloadUrl = `${imageUrl}?download=${x.name}.png`;

            return (
              <motion.div
                key={x.name}
                className={`${styles.item} ${
                  visibleItems.has(x.name) ? styles.visible : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: visibleItems.has(x.name) ? 1 : 0,
                  y: visibleItems.has(x.name) ? 0 : 20,
                }}
                transition={{ duration: 0.5 }}
              >
                <img className={styles.img} src={imageUrl} alt={x.name} />
                <div className={styles.buttonbox}>
                  <button
                    className={styles.button}
                    onClick={() => copyToClipboard(imageUrl)}
                  >
                    <TbCopyPlus />
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => handleMouseOpen(imageUrl)}
                  >
                    <TbArrowsMaximize />
                  </button>
                  <a href={downloadUrl} className={styles.button} download>
                    <TbCloudDownload />
                  </a>
                  <button
                    className={styles.button}
                    onClick={() => deleteImage(x.name)}
                  >
                    <TbTrashX />
                  </button>
                </div>
              </motion.div>
            );
          })}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        {modalUrl && (
          <div className={styles.imgbox}>
            <img src={modalUrl} alt="Modal" />
          </div>
        )}
      </Modal>
    </>
  );
};

export default UploadedItems;
