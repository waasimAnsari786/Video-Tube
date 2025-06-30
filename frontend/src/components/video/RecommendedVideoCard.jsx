import React from "react";
import { Button, Row, Column } from "../../index"; // adjust path if needed
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
    <Row customRowClass="group cursor-pointer p-2 rounded-xl bg-[var(--my-blue-transparent)] border border-[var(--my-blue)] transition-transform">
      {/* Thumbnail Column */}
      <Column customColClass="col-span-12 xl:col-span-6">
        <div className="relative overflow-hidden rounded-lg h-full w-full">
          <img
            src={thumbnail}
            alt="video thumbnail"
            className="object-cover aspect-video w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {/* Video Duration */}
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-semibold">
            12 : 34
          </span>
        </div>
      </Column>

      {/* Details Column */}
      <Column customColClass="col-span-12 xl:col-span-6 flex flex-col justify-between">
        <div className="flex flex-col justify-start h-full">
          <h3 className="lg:text-sm text-md font-bold leading-snug line-clamp-2 text-[var(--my-blue)]">
            {title}
          </h3>

          {/* Combined info (visible on small) */}
          <div className="text-xs text-gray-600 font-medium mt-1 lg:hidden">
            {channelName} • {views} • {uploadedDate}
          </div>

          {/* Split info (visible on large) */}
          <div className="hidden lg:block mt-1">
            <span className="text-xs text-gray-600 font-medium">
              {channelName}
            </span>
            <p className="text-xs text-gray-500 font-semibold">
              {views} • {uploadedDate}
            </p>
          </div>

          {/* Watch Now Button (only on small screens) */}
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

export default RecommendedVideoCard;
