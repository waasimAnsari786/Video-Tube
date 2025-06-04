import React from "react";
import { FaPlay } from "react-icons/fa";

const VideoCard = ({ videoData }) => {
  const {
    thumbnail = "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    title = "The Great Adventure",
    video = "https://example.com/video.mp4",
    duration = "2h 13m",
    views = "1.2M views",
    description = "An epic journey of courage and discovery that spans galaxies and tests the strength of friendship.",
    uploaderAvatar = "https://via.placeholder.com/40x40.png?text=U",
    channelName = "Adventure Time",
    uploadedDate = "3 days ago",
  } = videoData || {};

  return (
    <div className="group overflow-hidden rounded-lg bg-black text-white max-w-sm relative">
      {/* Thumbnail */}
      <div className="relative h-64 overflow-hidden p-4">
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Duration */}
        <span className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </span>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[--my-blue] w-16 h-16 flex items-center justify-center rounded-full">
            <FaPlay className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Uploader Info */}
      <h2 className="text-lg font-semibold px-4 my-3 leading-tight">{title}</h2>
      <div className="flex items-center px-4">
        <img
          src={uploaderAvatar}
          alt="Avatar"
          className="w-9 h-9 rounded-full mr-3"
        />
        <div>
          <p className="text-sm font-semibold">{channelName}</p>
          <p className="text-xs text-gray-400">
            {views} • {uploadedDate}
          </p>
        </div>

        {/* Slide-Up Section */}
      </div>
      <div className="translate-y-full absolute bottom-0 group-hover:translate-y-0 transition-all duration-300 ease-in-out p-4">
        <p className="text-sm text-gray-300">{description}</p>

        <a
          href={video}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-4 text-sm font-medium text-white hover:underline"
        >
          <FaPlay className="w-4 h-4 mr-2" />
          Watch now
        </a>
      </div>
    </div>
  );
};

export default VideoCard;
