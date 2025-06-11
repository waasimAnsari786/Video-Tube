import React from "react";
import { Button } from "../../../index"; // adjust path if needed
import { FaPlay } from "react-icons/fa";

const RecommendedVideoCard = ({ video }) => {
  const {
    thumbnail = "https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
    title = "React Crash Course for Beginners | Build a YouTube Clone",
    channelName = "Codevolution",
    views = "1.3M views",
    uploadedDate = "4 days ago",
  } = video || {};

  return (
    <div className="flex lg:flex-row flex-col gap-2 group cursor-pointer p-2 rounded-xl bg-[var(--my-blue-transparent)] border border-[var(--my-blue)] transition-transform">
      {/* Thumbnail */}
      <div className="w-full lg:w-40 overflow-hidden rounded-lg">
        <img
          src={thumbnail}
          alt="video thumbnail"
          className="aspect-video object-cover w-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-start">
        <h3 className="lg:text-sm text-md lg:font-semibold font-bold leading-snug line-clamp-2 text-[var(--my-blue)]">
          {title}
        </h3>

        {/* Combined Channel Info on small screens */}
        <div className="text-xs text-gray-600 font-medium mt-1 lg:hidden">
          {channelName} • {views} • {uploadedDate}
        </div>

        {/* Split Channel Info on md+ screens */}
        <div className="hidden lg:block">
          <span className="text-xs text-gray-600 font-medium">
            {channelName}
          </span>
          <p className="text-xs text-gray-500 font-semibold">
            {views} • {uploadedDate}
          </p>
        </div>

        {/* Watch Now Button - only on md and below */}
        <div className="block lg:hidden mt-3">
          <Button
            btnText={
              <>
                <FaPlay className="w-4 h-4 mr-2" />
                Watch now
              </>
            }
            customClass="w-full"
            margin="mt-2"
            borderRadius="rounded-full"
            padding="py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default RecommendedVideoCard;
