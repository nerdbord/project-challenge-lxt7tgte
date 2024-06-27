import { useAppStore } from "../../store";
import styles from "./UploadItem.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const UploadItem = () => {
  const { images, uploadedImageUrl } = useAppStore();
  const user = useUser();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setMessage("user not exist");
    }
  });

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
                <button>Delete</button>
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
