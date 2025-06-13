import React from "react";
import { useDropzone } from "react-dropzone";

const DragDropUploadFile = ({ allowedExtensions = [], maxFiles = 1 }) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > maxFiles) {
          alert(`You can only upload up to ${maxFiles} file(s).`);
          return;
        }

        acceptedFiles.forEach((file) => {
          const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
          console.log("fileExtension ", fileExtension);

          if (!allowedExtensions.includes(fileExtension)) {
            alert(`Unsupported file type: ${fileExtension}`);
            return;
          }

          console.log("Accepted file:", file);
        });
        console.log("fileRejections", fileRejections);
      },
      maxFiles,

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
    });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-5 text-center transition-colors duration-300 hover:bg-[var(--my-blue-transparent)]"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop files here, or click to select (Max {maxFiles})</p>
      )}
    </div>
  );
};

export default DragDropUploadFile;
