import React from "react";
import { FaBell, FaLink } from "react-icons/fa";
import { Button } from "../../../index";

const SingleVideoLayout = ({ videoData }) => {
  const {
    title = "Mastering React in 30 Minutes",
    videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4",
    views = "1.5M views",
    uploadedDate = "1 week ago",
    description = "This tutorial helps you master React fundamentals quickly with practical tips and project examples.",
    uploaderAvatar = "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000",
    channelName = "CodeMaster",
    subscriberCount = "1.2M subscribers",
  } = videoData || {};

  return (
    <>
      {/* Video Player */}
      <div className="aspect-video rounded-lg overflow-hidden mb-4">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      {/* Title */}
      <h1 className="text-xl lg:text-2xl font-bold text-[var(--my-blue)] mb-2 leading-tight">
        {title}
      </h1>
      {/* Channel Info + Buttons */}
      <div className="flex flex-col sm570:flex-row sm570:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <img
            src={uploaderAvatar}
            alt="channel avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-[var(--my-blue)] font-semibold text-sm">
              {channelName}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {subscriberCount}
            </p>
          </div>
          <Button
            btnText={<FaBell />}
            borderRadius="rounded-full"
            padding="p-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            btnText="Subscribe"
            borderRadius="rounded-full"
            padding="px-4 py-2"
          />
          <Button
            btnText={
              <>
                <FaLink className="mr-2" />
                Copy Link
              </>
            }
            borderRadius="rounded-full"
            padding="px-4 py-2"
          />
        </div>
      </div>
      {/* Views and Date */}
      <div className="text-sm text-gray-600 font-medium mb-2">
        {views} • {uploadedDate}
      </div>
      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </>
  );
};

export default SingleVideoLayout;
