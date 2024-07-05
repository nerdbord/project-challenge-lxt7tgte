import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store";
import styles from "./UploadItems.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { FileObject } from "@supabase/storage-js";
import { SnackbarProvider, useSnackbar } from "notistack";
import Modal from "react-modal";
import { FaFileDownload } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { BsArrowsFullscreen } from "react-icons/bs";

Modal.setAppElement("#root");

const UploadItems = () => {
  const { images, setImages } = useAppStore();
  const user = useUser();
  const [message, setMessage] = useState<string>("");
  const [modalState, setModalState] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      setMessage("user not exist");
    } else {
      getImages();
    }
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

  async function deleteImage(imageName: string) {
    const { error } = await supabase.storage
      .from("images")
      .remove([user?.id + "/" + imageName]);
    enqueueSnackbar("Image has been successfully deleted", {
      variant: "success",
    });

    if (error) {
      enqueueSnackbar("Something goes wrong", {
        variant: "error",
      });
    } else {
      getImages();
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
                <button onClick={() => deleteImage(x.name)}>
                  <MdOutlineDeleteForever />
                </button>
                <button onClick={() => copyToClipboard(imageUrl)}>
                  <FaRegCopy />{" "}
                </button>
                <button onClick={() => handleMouseOpen(imageUrl)}>
                  <BsArrowsFullscreen />{" "}
                </button>
                <a href={downloadUrl} download>
                  <button>
                    <FaFileDownload />
                  </button>
                </a>
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
