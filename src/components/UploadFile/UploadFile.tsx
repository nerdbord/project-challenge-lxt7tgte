import { useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import styles from "./UploadFile.module.css";
import { v4 as uuidv4 } from "uuid";
import { FileObject } from "@supabase/storage-js";
import { TbLogout } from "react-icons/tb";
import { TbUser } from "react-icons/tb";
import { TbCopy } from "react-icons/tb";
import { useAppStore } from "../../store";
import LogInScreen from "../LogInScreen/LogInScreen";

const UploadFile = ({ onLogout }: { onLogout: () => void }) => {
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      onLogout();
    }
  };

  const {
    temporaryFile,
    setTemporaryFile,
    setImages,
    uploadedImageUrl,
    setUploadedImageUrl,
    isEmailPromptVisible,
    setIsEmailPromptVisible,
  } = useAppStore();

  const user = useUser();
  const email = user?.email;
  const supabase = useSupabaseClient();

  console.log(user);

  useEffect(() => {
    if (user) {
      getImages();
      if (temporaryFile) {
        uploadImage(temporaryFile);
        setTemporaryFile(null);
      }
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
      console.log("abc", data);
    } else {
      console.log(error);
    }
  }

  async function uploadImage(file: File) {
    if (!user) {
      setTemporaryFile(file);
      setIsEmailPromptVisible(true);
      return;
    }

    const filePath = `${user?.id}/${uuidv4()}`;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage(file);
  };

  const copyToClipboard = () => {
    if (uploadedImageUrl) {
      navigator.clipboard.writeText(uploadedImageUrl);
      alert("URL copied to clipboard");
    }
  };

  return (
    <>
      {isEmailPromptVisible ? (
        <LogInScreen />
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            {email ? <h3>Logged in as {email}</h3> : <p>Not logged</p>}
            <div className={styles.buttonbox}>
              <button className={styles.button} onClick={logout}>
                My images <TbUser />
              </button>
              <button className={styles.button} onClick={logout}>
                Log out <TbLogout />
              </button>
            </div>
          </div>

          <form>
            <input
              type="file"
              id="fileUpload"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
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
                <p>Your IMG Link: </p>
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
      )}
    </>
  );
};

export default UploadFile;
