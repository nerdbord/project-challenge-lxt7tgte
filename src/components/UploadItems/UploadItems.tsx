/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store";
import styles from "./UploadItems.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { FileObject } from "@supabase/storage-js";
import { useSnackbar } from "notistack";
import Modal from "react-modal";
import { TbTrashX, TbCloudDownload, TbCopyPlus } from "react-icons/tb";
import { BsArrowsFullscreen } from "react-icons/bs";

Modal.setAppElement("#root");

const UploadItems = () => {
  const { images, setImages } = useAppStore();
  const user = useUser();
  const [modalState, setModalState] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      return;
    } else {
      getImages();
    }
  }, [user]);

  async function getImages() {
    if (!user) {
      enqueueSnackbar("User is not defined. Please log in.", {
        variant: "error",
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("images")
        .list(`${user.id}/`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error || data === null) {
        enqueueSnackbar("Error fetching data. Please try again later.", {
          variant: "error",
        });
        return;
      }

      setImages(data as FileObject[]);
    } catch {
      enqueueSnackbar("Error fetching data. Please try again later.", {
        variant: "error",
      });
    }
  }

  async function deleteImage(imageName: string) {
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
      enqueueSnackbar("An unexpected error occurred.", {
        variant: "error",
      });
    }
  }

  const handleMouseOpen = (url: string) => {
    setModalState(true);
    setModalUrl(url);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    enqueueSnackbar("URL copied to clipboard", {
      variant: "success",
    });
  };

  const CDNURL =
    "https://pprakrwwprhcswonwict.supabase.co/storage/v1/object/public/images/";

  return (
    <>
      <h2 className={styles.title}>My Uploads</h2>

      <div className={styles.items}>
        {images.map((x) => {
          const imageUrl = `${CDNURL}${user?.id}/${x.name}`;
          const downloadUrl = `${imageUrl}?download=${x.name}.png`;

          return (
            <div key={x.name} className={styles.item}>
              <img
                className={styles.img}
                src={`${CDNURL}${user?.id}/${x.name}`}
                alt={x.name}
              />
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
                  <BsArrowsFullscreen />
                </button>
                <a href={downloadUrl} download>
                  <button className={styles.button}>
                    <TbCloudDownload />
                  </button>
                </a>
                <button
                  className={styles.button}
                  onClick={() => deleteImage(x.name)}
                >
                  <TbTrashX />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={modalState}
        onRequestClose={() => setModalState(false)}
        contentLabel="Image Modal"
      >
        <button
          className={styles.buttonModal}
          onClick={() => setModalState(false)}
        >
          Close
        </button>

        {modalUrl && (
          <div>
            <img src={modalUrl} alt="Modal" style={{ width: "100%" }} />
          </div>
        )}
      </Modal>
    </>
  );
};

export default UploadItems;
