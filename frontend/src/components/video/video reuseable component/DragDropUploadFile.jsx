import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePreview, useImagePreview } from "../../../index";

const DragDropUploadFile = ({ allowedExtensions = [], maxFiles = 1 }) => {
  const [showPreview, setShowPreview] = useState(false);
  const { imgPreview, handleImagePreview } = useImagePreview();

  console.log("Drag drop re-render");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    multiple: maxFiles > 1,
    accept: allowedExtensions.reduce((acc, ext) => {
      const mimeType =
        ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".png"
          ? "image/png"
          : ext === ".webp"
          ? "image/webp"
          : ext === ".avif"
          ? "image/avif"
          : ext === ".mp4"
          ? "video/mp4"
          : ext === ".mov"
          ? "video/quicktime"
          : ext === ".avi"
          ? "video/x-msvideo"
          : ext === ".mkv"
          ? "video/x-matroska"
          : "";
      if (mimeType) acc[mimeType] = [];
      return acc;
    }, {}),
    onDrop: (acceptedFiles) => {
      console.log("✅ onDrop executed");
      acceptedFiles.forEach((file) => {
        console.log("Accepted file:", file);
        const fakeEvent = { target: { files: [file] } };
        handleImagePreview(fakeEvent);
        setShowPreview(true);
      });
    },
    onDropRejected: (rejectedFiles) => {
      console.log("❌ onDropRejected executed");
      rejectedFiles.forEach((rejection) => {
        console.warn(
          `Rejected file: ${rejection.file.name}`,
          rejection.errors.map((e) => e.message)
        );
      });
    },
  });

  const handleRemoveImage = () => {
    setShowPreview(false);
  };

  return (
    <>
      {showPreview ? (
        <div className="flex items-baseline gap-4">
          <div className="w-32 h-32 rounded-lg overflow-hidden">
            <ImagePreview
              preview={imgPreview}
              customClass="object-cover h-full"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            className="underline"
            type="button"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="rounded-lg py-8 border-2 border-dashed border-gray-300 p-5 text-center transition-colors duration-300 hover:bg-[var(--my-blue-transparent)]"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop files here, or click to select (Max {maxFiles})</p>
          )}
        </div>
      )}
    </>
  );
};

export default DragDropUploadFile;
