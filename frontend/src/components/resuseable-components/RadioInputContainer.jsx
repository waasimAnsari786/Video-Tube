import React, { useEffect, useRef } from "react";
import {
  useToggle,
  CustomModal,
  openCloseModal,
  ModalContent,
} from "../../index";

const RadioInputContainer = ({
  label = "Status",
  defaultChecked = true,
  onStatusChange,
}) => {
  const { toggle, handleToggle } = useToggle(defaultChecked);

  const modalId = "custom_modal_radio";
  const modalContentRef = useRef(
    new ModalContent({
      id: modalId,
      title: "Set video to Private?",
      body: "Are you sure you want to make this video private? It will no longer be publicly visible.",
      cancelText: "No, Keep Public",
      confirmText: "Yes, Make Private",
      // onCancel: () => {
      //   skipToggleRef.current = true; // Skip changing the toggle
      // },
      onConfirm: () => {
        handleToggle();
      },
    })
  );

  const handleChange = () => {
    if (toggle) {
      // User is trying to set it to false → Private
      openCloseModal(modalId, "open");
    } else {
      // Allow immediate toggle to Public
      handleToggle();
    }
  };

  useEffect(() => {
    onStatusChange?.(toggle ? "Public" : "Private");
  }, [toggle]);

  return (
    <>
      <label className="flex items-center gap-3 cursor-pointer">
        <span className="text-sm font-medium">{label}</span>
        <input
          type="checkbox"
          checked={toggle}
          onChange={handleChange}
          className="toggle border-red-600 bg-red-500 checked:border-green-600 checked:bg-green-500"
        />
      </label>

      <CustomModal id={modalId} modalContent={modalContentRef.current} />
    </>
  );
};

export default RadioInputContainer;
