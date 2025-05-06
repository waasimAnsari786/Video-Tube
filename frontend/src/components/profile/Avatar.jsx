import React from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive } from "@cloudinary/react";

export default function Avatar({ width = "w-10", textSize = "text-xl" }) {
  const avatar = useSelector((state) => state.auth.avatar);
  const fullName = useSelector((state) => state.auth.fullName);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "waasim-ansari",
    },
  });

  // Use the image with public ID, 'sample'.
  const myImage = cld.image(avatar.publicId);

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

  if (avatar && avatar.secureURL) {
    return (
      <div className={width}>
        <img
          alt="User Avatar"
          src={avatar.secureURL}
          className="object-cover rounded-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="avatar avatar-placeholder">
      <div className={`bg-neutral text-neutral-content ${width} rounded-full`}>
        <span className={textSize}>{fullName?.[0]?.toUpperCase()}</span>
      </div>
    </div>
  );
}
