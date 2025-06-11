import React from "react";

export default function CustomModal({ id = "custom_modal", modalContent }) {
  const { title, body, cancelText, confirmText, onConfirm, onCancel } =
    modalContent;

  return (
    <dialog
      id={id}
      className="modal modal-bottom sm:modal-middle"
      onClick={() => {
        document.getElementById(id)?.close();
      }}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>

        <div className="py-4 text-sm">{body}</div>

        <div className="modal-action">
          <li
            className="btn btn-outline btn-sm"
            onClick={() => {
              onCancel?.();
              document.getElementById(id)?.close();
            }}
          >
            {cancelText || "Cancel"}
          </li>
          <li
            className="btn btn-error btn-sm"
            onClick={() => {
              onConfirm?.();
              document.getElementById(id)?.close();
            }}
          >
            {confirmText || "Confirm"}
          </li>
        </div>
      </div>
    </dialog>
  );
}
