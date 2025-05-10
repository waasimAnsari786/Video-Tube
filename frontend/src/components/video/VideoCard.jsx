import React from "react";

const VideoCard = ({ videoData }) => {
  const { thumbnail, title, video, duration, views, description, owner } =
    videoData;

  return (
    <div className="max-w-md mx-auto group shadow-md hover:shadow-2xl transition-shadow duration-300 rounded overflow-hidden">
      {/* Thumbnail */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <img
            src="/images/play.png"
            alt="Play"
            className="w-16 h-16 transform scale-75 group-hover:scale-100 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-black text-white p-4 transition-shadow duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-black">
        {/* Title & Rating */}
        <div className="mb-2">
          <span className="inline-block bg-yellow-600 text-xs px-2 py-1 rounded mr-2">
            IMDb {rating}
          </span>
          <h2 className="text-xl font-semibold leading-tight mt-2">{title}</h2>
          <span className="text-sm font-bold uppercase text-gray-300">
            {season}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm mt-2 text-gray-300">{description}</p>

        {/* Uploader Info */}
        <div className="flex items-center mt-4">
          <img
            src={uploaderAvatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-semibold">{channelName}</p>
            <p className="text-xs text-gray-400">{uploaderName}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
          <span className="bg-gray-700 px-2 py-1 rounded font-bold">
            {year}
          </span>
          <span className="bg-gray-700 px-2 py-1 rounded font-bold">
            {ageLimit}
          </span>
          <span className="bg-gray-700 px-2 py-1 rounded">{duration}</span>
        </div>

        {/* Watch Now Button */}
        <a
          href="#"
          className="inline-flex items-center mt-4 text-sm font-medium text-white hover:underline"
        >
          <img
            src="/images/play.png"
            alt="play icon"
            className="w-4 h-4 mr-2"
          />
          Watch now
        </a>
      </div>
    </div>
  );
};

export default VideoCard;
