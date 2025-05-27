import React, { useRef } from "react";

export default function useFileUpload() {
  const fileInputRef = useRef();

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return { fileInputRef, handleUpload };
}
