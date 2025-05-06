import React from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive } from "@cloudinary/react";

const CoverImage = () => {
  const coverImage = useSelector((state) => state.auth.coverImage);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "waasim-ansari",
    },
  });

  // Use the image with public ID, 'sample'.
  const myImage = cld.image(coverImage.publicId);

  // Use the responsive plugin, setting the step size to 200 pixels
  return (
    <div>
      <AdvancedImage
        className="rounded-b-xl"
        cldImg={myImage}
        plugins={[responsive({ steps: 200 })]}
      />
    </div>
  );

  // if (!coverImage?.secureURL) return null;

  // return (
  //   <img
  //     src={coverImage.secureURL}
  //     alt="Banner"
  //     className="w-full h-36 sm:h-44 md:h-56 lg:h-64 object-cover rounded-b-xl shadow-md"
  //   />
  // );
};

export default CoverImage;
