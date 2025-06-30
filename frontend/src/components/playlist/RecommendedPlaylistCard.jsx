import React from "react";
import { Button, Row, Column } from "../../index"; // adjust the path if needed
import { FaPlay } from "react-icons/fa";

const RecommendedPlaylistCard = ({ playlist }) => {
  const {
    thumbnail = "https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
    title = "Full React Course",
    channelName = "Codevolution",
    views = "845K views",
    uploadedDate = "2 weeks ago",
  } = playlist || {};

  return (
    <Row customRowClass="group cursor-pointer p-2 rounded-xl bg-[var(--my-blue-transparent)] border border-[var(--my-blue)] transition-transform">
      {/* Thumbnail with stacked design */}
      <Column customColClass="col-span-12 xl:col-span-6">
        <div className="relative aspect-video w-full">
          {/* Stacked effect */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[94%] h-full bg-gray-300 rounded-xl z-0"></div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[97%] h-full bg-gray-400 rounded-lg z-0"></div>

          {/* Main Thumbnail */}
          <div className="relative overflow-hidden rounded-lg h-full w-full z-10">
            <img
              src={thumbnail}
              alt="Playlist Thumbnail"
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-semibold">
              34 videos
            </span>
          </div>
        </div>
      </Column>

      {/* Playlist Info */}
      <Column customColClass="col-span-12 xl:col-span-6 flex flex-col justify-between">
        <div className="flex flex-col justify-start h-full">
          <h3 className="lg:text-sm text-md font-bold leading-snug line-clamp-2 text-[var(--my-blue)]">
            {title}
          </h3>

          {/* Small screen combined info */}
          <div className="text-xs text-gray-600 font-medium mt-1 lg:hidden">
            {channelName} • {views} • {uploadedDate}
          </div>

          {/* Large screen split info */}
          <div className="hidden lg:block mt-1">
            <span className="text-xs text-gray-600 font-medium">
              {channelName}
            </span>
            <p className="text-xs text-gray-500 font-semibold">
              {views} • {uploadedDate}
            </p>
          </div>

          {/* Button for small screens */}
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
      </Column>
    </Row>
  );
};

export default RecommendedPlaylistCard;
