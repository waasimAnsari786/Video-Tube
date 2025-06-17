import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Column, ImagePreview, Row, useImagePreview } from "../../../index";

const DragDropUploadFile = ({
  allowedExtensions = [],
  maxFiles = 1,
  acceptedMimeType = "image/*",
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const { imgPreview, handleImagePreview } = useImagePreview();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    multiple: maxFiles > 1,
    accept: { [acceptedMimeType]: allowedExtensions },
    validator: (file) => {
      const originalName = file?.name || "";

      const baseName = originalName.split("/").pop(); // just filename

      // 3. Check safe filename
      const safeFileNameRegex = /^[a-zA-Z0-9._-]+$/;

      if (!safeFileNameRegex.test(baseName)) {
        return {
          code: "unsafe-filename",
          message: `Unsafe filename: "${originalName}". Only letters, numbers, ".", "_", "-" allowed.`,
        };
      }

      return null; // ✅ Valid file
    },

    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        console.warn("❌ Some files are invalid. Upload rejected.");

        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((err) => {
            console.error(`Rejected "${file.name}": ${err.message}`);
          });
        });

        setShowPreview(false); // explicitly hide preview
        return;
      }

      if (acceptedFiles.length === 0) return;

      console.log("✅ All files accepted");
      const fakeEvent = { target: { files: acceptedFiles } };
      handleImagePreview(fakeEvent);
      setShowPreview(true);
    },
  });

  const handleRemoveImage = () => {
    setShowPreview(false);
  };

  return showPreview && acceptedMimeType === "image/*" ? (
    <>
      <Row>
        {imgPreview?.map((preview, i) => (
          <Column
            customColClass="col-span-2 rounded-lg border p-1 overflow-hidden border-[var(--my-border-dark)]"
            key={i}
          >
            <ImagePreview
              preview={preview}
              customClass="object-cover rounded-md"
            />
          </Column>
        ))}
      </Row>
      <button onClick={handleRemoveImage} className="underline" type="button">
        Remove Image
      </button>
    </>
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
  );
};

export default DragDropUploadFile;
