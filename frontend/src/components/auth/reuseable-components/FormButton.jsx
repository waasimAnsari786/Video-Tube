import React from "react";

const FormButton = ({ label }) => (
  <button
    type="submit"
    className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold uppercase rounded-md tracking-wider transition duration-300"
  >
    {label}
  </button>
);

export default FormButton;
