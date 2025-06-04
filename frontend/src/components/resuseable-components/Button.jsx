import React from "react";

export default function Button({
  btnText = "",
  customClass = "",
  padding = "px-2 py-1",
  margin = "",
  borderRadius = "rounded-sm",
  ...props
}) {
  return (
    <button
      className={`btn-liquid liquid text-sm ${borderRadius} ${padding} ${margin} ${customClass} flex items-center gap-1 justify-center`}
      {...props}
    >
      {btnText}
    </button>
  );
}
