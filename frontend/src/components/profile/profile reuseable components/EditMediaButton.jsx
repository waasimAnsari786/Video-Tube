import React from "react";
import { FaEdit } from "react-icons/fa";

export default function EditMediaButton() {
  return (
    <span className="bg-(--my-blue) text-(--my-white) px-2 py-1 rounded-sm text-sm cursor-pointer flex items-center gap-1">
      <FaEdit /> Edit
    </span>
  );
}
