import React from "react";

export default function CustomModal({
  id = "custom_modal",
  openBtnText = "Open Modal",
  modalTitle = "Hello!",
  children,
  closeBtnText = "Close",
}) {
  const closeModal = () => {
    document.getElementById(id)?.close();
  };

  return (
    <>
      {/* Optional open button (can be reused elsewhere) */}
      {openBtnText && (
        <button
          className="btn"
          onClick={() => document.getElementById(id)?.showModal()}
        >
          {openBtnText}
        </button>
      )}

      <dialog id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{modalTitle}</h3>
          <div className="py-4">{children}</div>
          <div className="modal-action">
            {/* No nested <form> to avoid conflict */}
            <button className="btn" onClick={closeModal}>
              {closeBtnText}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
