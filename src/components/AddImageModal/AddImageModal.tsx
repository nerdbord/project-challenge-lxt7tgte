/* import { useEffect, useRef } from "react"; */
import styles from "./AddImageModal.module.css";
import { MdClose } from "react-icons/md";
import UploadFile from "../UploadFile/UploadFile";

const AddImageModal = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) => {
  /*   const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? onRequestClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onRequestClose]); */

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closebtn} onClick={onRequestClose}>
          <MdClose />
        </button>
        <UploadFile />
      </div>
    </div>
  );
};

export default AddImageModal;
