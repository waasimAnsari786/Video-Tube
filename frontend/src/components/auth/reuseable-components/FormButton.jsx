import React from "react";
import { FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";

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
      className={`w-full py-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold uppercase rounded-md tracking-wider transition duration-300 flex items-center justify-center gap-2 ${
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
