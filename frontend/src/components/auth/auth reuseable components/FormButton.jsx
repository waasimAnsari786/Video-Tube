import React from "react";
import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import "../css/auth.css";

const FormButton = ({
  label = "Update",
  loadingLabel = "Updating...",
  ...props
}) => {
  const loading = useSelector((state) => state.auth.loading);

  return (
    <button
      type="submit"
      disabled={loading}
      className={`btn-liquid liquid flex items-center justify-center gap-2 py-3 rounded-lg text-sm w-full ${
        loading ? "opacity-75 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
};

export default FormButton;
