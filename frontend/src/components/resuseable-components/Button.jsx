import React from "react";

export default function Button({ btnText = "", ...props }) {
  return (
    <button
      type="submit"
      className="btn-liquid liquid px-2 py-1 text-sm"
      {...props}
    >
      {btnText}
    </button>
  );
}
