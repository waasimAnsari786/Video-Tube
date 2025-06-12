import React, { useState } from "react";
import {
  FaBell,
  FaLink,
  FaCheckCircle,
  FaRegBell,
  FaRegBellSlash,
  FaUserTimes,
  FaEllipsisV,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import {
  Button,
  PopupContent,
  PopUp,
  CustomModal,
  ModalContent,
  openCloseModal,
} from "../../../index";

const SingleVideoLayout = ({ videoData }) => {
  const {
    title = "Mastering React in 30 Minutes",
    videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4",
    views = "1.5M views",
    uploadedDate = "1 week ago",
    description = "This tutorial helps you master React fundamentals quickly with practical tips and project examples. This extended version includes routing, state management, API integration, and deployment walkthroughs for building robust React apps.",
    uploaderAvatar = "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000",
    channelName = "CodeMaster",
    subscriberCount = "1.2M subscribers",
  } = videoData || {};

  // Like/Unlike State
  const [likeCount, setLikeCount] = useState(1234);
  const [unlikeCount, setUnlikeCount] = useState(45);
  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
      if (unliked) {
        setUnlikeCount((prev) => prev - 1);
        setUnliked(false);
      }
    }
  };

  const handleUnlike = () => {
    if (unliked) {
      setUnlikeCount((prev) => prev - 1);
      setUnliked(false);
    } else {
      setUnlikeCount((prev) => prev + 1);
      setUnliked(true);
      if (liked) {
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      }
    }
  };

  const modalContent = new ModalContent({
    id: "unsubscribe_modal",
    title: "Unsubscribe from CodeMaster?",
    body: "You will stop receiving video updates and notifications from this channel.",
    cancelText: "No, Keep Me Subscribed",
    confirmText: "Yes, Unsubscribe",
    onCancel: () => console.log("User cancelled unsubscribe."),
    onConfirm: () => console.log("User confirmed unsubscribe."),
  });

  const bellOptions = [
    new PopupContent(<FaCheckCircle />, "All", () =>
      console.log("All notifications selected")
    ),
    new PopupContent(<FaRegBell />, "Personalized", () =>
      console.log("Personalized notifications selected")
    ),
    new PopupContent(<FaRegBellSlash />, "None", () =>
      console.log("No notifications selected")
    ),
    new PopupContent(<FaUserTimes />, "Unsubscribe", () =>
      openCloseModal(modalContent.id, "open")
    ),
  ];

  const moreOptions = [
    new PopupContent(<FaLink />, "Copy Link", () => {
      navigator.clipboard.writeText(videoUrl);
      console.log("Link copied to clipboard");
    }),
  ];

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

          {/* Bell PopUp */}
          <PopUp
            button={
              <Button
                btnText={<FaBell />}
                borderRadius="rounded-full"
                padding="p-2"
              />
            }
            content={bellOptions}
          />
        </div>

        <Button
          btnText="Subscribe"
          borderRadius="rounded-full"
          padding="px-4 py-2"
          customClass="w-full block sm570:hidden"
        />

        {/* Buttons Row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--my-blue-transparent)] rounded-full p-3 text-sm font-medium text-[var(--my-blue)]">
            <button className="flex items-center gap-1 hover:opacity-70">
              <FaThumbsUp />
              <span>2.1K</span>
            </button>
            <span className="mx-2 text-gray-400">|</span>
            <button className="flex items-center gap-1 hover:opacity-70">
              <FaThumbsDown />
              <span>56</span>
            </button>
          </div>

          <Button
            btnText="Subscribe"
            borderRadius="rounded-full"
            padding="px-4 py-2"
            customClass="hidden sm570:block"
          />

          {/* More Options */}
          <div className="hidden xl:block">
            <PopUp
              button={
                <Button
                  btnText={<FaEllipsisV />}
                  borderRadius="rounded-full"
                  padding="p-2"
                />
              }
              content={moreOptions}
            />
          </div>

          {/* More Options for <xl */}
          <div className="xl:hidden">
            <PopUp
              position="left"
              button={
                <Button
                  btnText={<FaEllipsisV />}
                  borderRadius="rounded-full"
                  padding="p-2"
                />
              }
              content={moreOptions}
            />
          </div>
        </div>
      </div>

      {/* Collapse Description Box */}
      <div className="bg-[var(--my-blue-transparent)] rounded-xl">
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-transparent border-none"
        >
          <div className="collapse-title font-semibold text-sm">
            {views} • {uploadedDate}
            <p className="mt-1 text-gray-700 text-sm line-clamp-2">
              {description}
            </p>
          </div>
          <div className="collapse-content text-sm text-gray-700">
            {description}
          </div>
        </div>
      </div>

      <CustomModal id={modalContent.id} modalContent={modalContent} />
    </>
  );
};

export default SingleVideoLayout;
