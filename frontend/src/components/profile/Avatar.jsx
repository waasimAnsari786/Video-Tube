import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive } from "@cloudinary/react";

export default function Avatar({ width = "w-10", avatar = "" }) {
  // const cld = new Cloudinary({
  //   cloud: {
  //     cloudName: "waasim-ansari",
  //   },
  // });

  // Use the image with public ID, 'sample'.
  // const myImage = cld.image(avatar.publicId);

  // Use the responsive plugin, setting the step size to 200 pixels
  // return (
  //   <div className="w-24">
  //     <AdvancedImage
  //       className="rounded-b-xl"
  //       cldImg={myImage}
  //       plugins={[responsive({ steps: 200 })]}
  //     />
  //   </div>
  // );

  if (avatar) {
    return (
      <div className={width}>
        <img
          alt="User Avatar"
          src={avatar}
          className="object-cover rounded-full w-full"
        />
      </div>
    );
  }
}
