import React from "react";
import { FaSpinner } from "react-icons/fa";

const FormButton = ({
  label = "Update",
  loadingLabel = "Updating...",
  customClass = "py-3 w-full rounded-lg",
  loading = false,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`btn-liquid liquid flex items-center justify-center gap-2 text-sm ${
        loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${customClass}`}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
};

export default FormButton;
