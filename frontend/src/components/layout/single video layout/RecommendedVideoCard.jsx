import React from "react";

const RecommendedVideoCard = ({ video }) => {
  return (
    <div className="flex gap-2 mb-4 cursor-pointer hover:bg-gray-100 rounded-lg">
      {/* Thumbnail */}
      <div className="relative w-40 h-24 flex-shrink-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
          {video.duration}
        </span>
      </div>

      {/* Video Details */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
          {video.channelName}
        </p>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
          <span>{video.views}</span>
          <span className="mx-1">•</span>
          <span>{video.uploadedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendedVideoCard;
