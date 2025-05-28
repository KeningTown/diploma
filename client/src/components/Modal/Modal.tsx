import React from "react";

interface ModalProps {
  title: string;
  text: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
}

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  width: "400px",
  background: "#fff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
};

const Modal: React.FC<ModalProps> = ({
  title,
  text,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Отмена",
  confirmDisabled = false
}) => {
  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3>{title}</h3>
        <p style={{ margin: "16px 0" }}>{text}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          {onCancel && cancelText && (
          <button onClick={onCancel} style={{ padding: "8px 16px" }}>
            {cancelText}
          </button>
          )}
          <button disabled={confirmDisabled} onClick={onConfirm} style={{ padding: "8px 16px" }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
