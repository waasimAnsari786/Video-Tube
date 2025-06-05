import React from "react";
import { FaPlay } from "react-icons/fa";
import Button from "../resuseable-components/Button";

const VideoCard = ({ videoData }) => {
  const {
    thumbnail = "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    title = "The Great Adventure The Great Adventure The Great Adventure",
    video = "https://example.com/video.mp4",
    duration = "2h 13m",
    views = "1.2M views",
    description = "An epic journey of courage and discovery that spans galaxies and tests the strength of friendship.",
    uploaderAvatar = "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww",
    channelName = "Adventure Time",
    uploadedDate = "3 days ago",
  } = videoData || {};

  return (
    <div className="group overflow-hidden rounded-xl relative bg-(--my-blue-transparent) border border-(--my-blue) p-3 transition-transform">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video rounded-lg">
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Duration */}
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </span>
      </div>

      {/* Video Details */}
      <div className="text-(--my-blue) py-3">
        <h2
          className="text-md font-bold leading-tight mb-2 line-clamp-2"
          style={{ lineHeight: "1.4rem" }}
        >
          {title}
        </h2>

        <div className="flex items-center">
          <img
            src={uploaderAvatar}
            alt="Avatar"
            className="w-9 h-9 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-bold">{channelName}</p>
            <p className="text-xs font-semibold text-gray-600">
              {views} • {uploadedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Slide-Up Section */}
      <div className="absolute left-0 right-0 bottom-0 bg-(--my-blue) translate-y-full group-hover:translate-y-1 transition-transform duration-300 ease-in-out px-4 py-3 h-34">
        <p className="text-sm text-gray-300 line-clamp-2">{description}</p>

        <Button
          btnText={
            <>
              <FaPlay className="w-4 h-4 mr-2" />
              Watch now
            </>
          }
          accentColor="white"
          hoverTextColor="#132977"
          customClass="w-full"
          margin="mt-4"
          borderRadius="rounded-full"
          padding="py-2"
        ></Button>
      </div>
    </div>
  );
};

export default VideoCard;
