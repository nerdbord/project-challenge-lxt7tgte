import { useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import styles from "./UploadFile.module.css";
import { v4 as uuidv4 } from "uuid";
import { FileObject } from "@supabase/storage-js";
import { TbLogin, TbLogout, TbPlus, TbUser, TbCopy } from "react-icons/tb";
import { useAppStore } from "../../store";
import cloud from "../../assets/CloudImages.png";

const UploadFile = ({ onLogout }: { onLogout: () => void }) => {
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      onLogout();
    }
  };

  const { images, setImages, uploadedImageUrl, setUploadedImageUrl } =
    useAppStore();

  const user = useUser();
  const email = user?.email;
  const supabase = useSupabaseClient();

  console.log(user);
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
    <div className={styles.container}>
      <div className={styles.header}>
        {user ? (
          <>
            <h3>Logged in as {email}</h3>
            <div className={styles.buttonbox}>
              <button className={styles.button} onClick={logout}>
                My images <TbUser />
              </button>
              <button className={styles.button} onClick={logout}>
                Log out <TbLogout />
              </button>
            </div>
          </>
        ) : (
          <>
            <h3></h3>
            <div className={styles.buttonbox}>
              <button className={styles.button} onClick={logout}>
                Upload Image <TbPlus />
              </button>
              <button className={styles.button} onClick={logout}>
                Log in <TbLogin />
              </button>
            </div>
          </>
        )}
      </div>

      {user ? (
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
      ) : (
        <div className={styles.infobox}>
          <img src={cloud} alt="cloud" />
          <h2>Welcome to our Image Upload Application!</h2>
          <h3>
            With this app, you can easily upload your images and receive a
            direct link to share or use anywhere you need!
          </h3>

          <p>
            Just drag and drop your image files or choose files from your
            device, and we'll take care of the rest. Once uploaded, you'll get a
            unique link to your image that you can copy and use as you wish.
            Enjoy seamless image sharing with our simple and efficient tool!
          </p>
        </div>
      )}

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
