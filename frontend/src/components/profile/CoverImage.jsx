import React from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive } from "@cloudinary/react";

const CoverImage = ({ coverImage }) => {
  // const coverImage = useSelector((state) => state.auth.coverImage);

  // const cld = new Cloudinary({
  //   cloud: {
  //     cloudName: "waasim-ansari",
  //   },
  // });

  // // Use the image with public ID, 'sample'.
  // const myImage = cld.image(coverImage.publicId);

  // // Use the responsive plugin, setting the step size to 200 pixels
  // return (
  //   <div>
  //     <AdvancedImage
  //       className="rounded-b-xl"
  //       cldImg={myImage}
  //       plugins={[responsive({ steps: 200 })]}
  //     />
  //   </div>
  // );

  if (!coverImage) return null;

  return (
    <img
      src={coverImage}
      alt="Banner"
      className="w-full h-28 sm:h-32 md:h-44 lg:h-50 object-cover rounded-md sm:rounded-lg md:rounded-xl"
    />
  );
};

export default CoverImage;
