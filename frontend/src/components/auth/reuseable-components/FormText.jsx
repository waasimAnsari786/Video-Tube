import React from "react";
import { Link } from "react-router-dom";

const FormText = ({ text, linkText, linkTo }) => (
  <p className="text-gray-500 text-sm mt-4">
    {text}
    <Link to={linkTo} className="font-semibold text-black ml-1">
      {linkText}
    </Link>
  </p>
);

export default FormText;
