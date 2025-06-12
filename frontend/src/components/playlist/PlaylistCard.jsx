import React from "react";
import { FaPlay } from "react-icons/fa";
import Button from "../resuseable-components/Button";

const PlaylistCard = ({ playlistData }) => {
  const {
    thumbnail = "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    title = "Ultimate Coding Playlist for Beginners",
    videoCount = "12 videos",
    uploaderAvatar = "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww",
    channelName = "CodeWithDev",
    uploadedDate = "1 week ago",
    description = "A complete playlist to learn web development from scratch with hands-on projects.",
  } = playlistData || {};

  return (
    <div className="group overflow-hidden rounded-xl relative bg-[var(--my-blue-transparent)] border border-[var(--my-blue)] p-3 transition-transform">
      {/* Playlist Thumbnail with stacked effect */}
      <div className="relative aspect-video rounded-lg">
        {/* Stacked thumbnails */}

        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[96%] h-full bg-gray-300 rounded-xl z-0"></div>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[98%] h-full bg-gray-400 rounded-lg z-0"></div>

        {/* Main Thumbnail */}
        <div className="overflow-hidden rounded-lg z-0">
          <img
            src={thumbnail}
            alt="Playlist Thumbnail"
            className="relative w-full h-full object-cover rounded-lg transition-transform duration-300 lg:group-hover:scale-105"
          />
        </div>
      </div>

      {/* Playlist Details */}
      <div className="text-[var(--my-blue)] py-3">
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
              {videoCount} • {uploadedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Hover slide-up content (only lg and up) */}
      <div className="hidden lg:block absolute left-0 right-0 bottom-0 bg-[var(--my-blue)] translate-y-full group-hover:translate-y-1 transition-transform duration-300 ease-in-out px-4 py-3 h-34">
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
        />
      </div>

      {/* Static button on medium and small screens */}
      <div className="block lg:hidden mt-3">
        <Button
          btnText={
            <>
              <FaPlay className="w-4 h-4 mr-2" />
              Watch now
            </>
          }
          customClass="w-full"
          borderRadius="rounded-full"
          padding="py-2"
        />
      </div>
    </div>
  );
};

export default PlaylistCard;
