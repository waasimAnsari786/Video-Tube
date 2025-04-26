import React from "react";

const FormButton = ({ label }) => (
  <button
    type="submit"
    className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold uppercase rounded-md tracking-wider transition duration-300"
  >
    {label}
  </button>
);

export default FormButton;
