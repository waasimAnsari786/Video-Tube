import React from "react";
import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";

const FormButton = ({
  label = "Update",
  loadingLabel = "Updating...",
  customClasss = "py-3 w-full rounded-lg",
  ...props
}) => {
  const loading = useSelector((state) => state.auth.loading);

  return (
    <button
      type="submit"
      disabled={loading}
      className={`btn-liquid liquid flex items-center justify-center gap-2 text-sm ${
        loading ? "opacity-75 cursor-not-allowed" : ""
      } ${customClasss}`}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
};

export default FormButton;
