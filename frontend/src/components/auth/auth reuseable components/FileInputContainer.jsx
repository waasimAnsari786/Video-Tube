import React, { useState } from "react";
import { FormInput, ImagePreview } from "../../../index";
import { FaFileImage } from "react-icons/fa";

/**
 * FileInputContainer handles file input logic and image preview.
 * It is reusable for image or file uploads in any form.
 *
 * Props:
 * - accept: string (file types to accept, e.g. "image/*")
 * - customClass: string (optional CSS classes for container)
 * - ...props: all other props passed to input
 */

const FileInputContainer = ({
  accept = ".jpg,.jpeg,.png,.webp,.avif",
  customClass = "",
  ...props
}) => {
  const [imgPreview, setImgPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImgPreview(preview);
    }
  };

  return (
    <>
      <div className={`relative ${customClass}`}>
        {/* <Icon
          icon={<FaFileImage />}
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
        /> */}
        <FormInput
          type="file"
          {...props}
          accept={accept}
          onChange={handleImageChange}
        />
      </div>

      {imgPreview && <ImagePreview preview={imgPreview} />}
    </>
  );
};

export default FileInputContainer;
