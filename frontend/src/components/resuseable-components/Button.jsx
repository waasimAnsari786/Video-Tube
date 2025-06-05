import React from "react";

export default function Button({
  btnText = "",
  customClass = "",
  padding = "px-2 py-1",
  margin = "",
  borderRadius = "rounded-sm",
  accentColor = "#132977", // Used for border and hover background
  hoverTextColor = "#ffffff", // Used only on hover
  ...props
}) {
  return (
    <button
      className={`btn-liquid liquid text-sm ${borderRadius} ${padding} ${margin} ${customClass} flex items-center gap-1 justify-center`}
      style={{
        "--hover-text": hoverTextColor,
        "--my-blue": accentColor,
      }}
      {...props}
    >
      {btnText}
    </button>
  );
}
