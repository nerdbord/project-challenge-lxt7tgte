import { supabase } from "../../helpers/supabaseClient";
import { useAppStore } from "../../store";
import styles from "./UploadItem.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { FileObject } from "@supabase/storage-js";

const UploadItem = () => {
  const { images, setImages } = useAppStore();
  const user = useUser();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setMessage("user not exist");
    }
  });

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

    if (error) {
      alert("failed: delete image");
    } else {
      getImages();
    }
  }

  const CDNURL =
    "https://pprakrwwprhcswonwict.supabase.co/storage/v1/object/public/images/";

  return (
    <div className={styles.item}>
      <>
        {images.map((x) => {
          return (
            <div key={x.name}>
              <img
                className={styles.img}
                src={`${CDNURL}${user?.id}/${x.name}`}
                alt={x.name}
              />
              <div>
                <button onClick={() => deleteImage(x.name)}>Delete</button>
                <button>Download</button>
              </div>
            </div>
          );
        })}
      </>
      <div className={styles.buttonbox}></div>
    </div>
  );
};

export default UploadItem;
