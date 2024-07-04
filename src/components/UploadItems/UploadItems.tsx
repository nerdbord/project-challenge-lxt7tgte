import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store";
import styles from "./UploadItems.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { FileObject } from "@supabase/storage-js";
import { SnackbarProvider, useSnackbar } from "notistack";

const UploadItems = () => {
  const { images, setImages } = useAppStore();
  const user = useUser();
  const [message, setMessage] = useState<string>("");
  // const [urlClipboard, setUrlClipboard] = useState<string>("");
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

          return (
            <div key={x.name} className={styles.item}>
              <img
                className={styles.img}
                src={`${CDNURL}${user?.id}/${x.name}`}
                alt={x.name}
              />
              <div className={styles.buttonbox}>
                <button onClick={() => deleteImage(x.name)}>Delete</button>
                <button onClick={() => copyToClipboard(imageUrl)}>
                  Copy URL
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UploadItems;
