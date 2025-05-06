// context/ImagePreviewContext.js
import React, { createContext, useContext, useState } from "react";

// Create context
const ImagePreviewContext = createContext();

// Provider component
export const ImagePreviewProvider = ({ children }) => {
  const [imgPreview, setImgPreview] = useState(null);

  const setImagePreview = (file) => {
    if (file) {
      setImgPreview(URL.createObjectURL(file));
    } else {
      setImgPreview(null);
    }
  };

  return (
    <ImagePreviewContext.Provider value={{ imgPreview, setImagePreview }}>
      {children}
    </ImagePreviewContext.Provider>
  );
};

// Custom hook to use the context easily
export const useImagePreview = () => useContext(ImagePreviewContext);
