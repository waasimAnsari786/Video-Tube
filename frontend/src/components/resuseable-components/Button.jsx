import React from "react";

export default function Button({ btnText = "", customClass = "", ...props }) {
  return (
    <button
      type="submit"
      className={`btn-liquid liquid px-2 py-1 rounded-sm text-sm flex items-center gap-1 ${customClass}`}
      {...props}
    >
      {btnText}
    </button>
  );
}
