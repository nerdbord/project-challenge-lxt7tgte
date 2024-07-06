import { useEffect, ReactNode, useRef } from "react";
import styles from "./Modal.module.css";
import { MdClose } from "react-icons/md";

const Modal = ({
  isOpen,
  onRequestClose,
  children,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? onRequestClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onRequestClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onRequestClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onRequestClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closebtn} onClick={onRequestClose}>
          <MdClose />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
