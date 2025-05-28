import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FullName,
  Email,
  Username,
  Avatar,
  CoverImage,
  Container,
  SubscribeButton,
  SubscribedToCount,
  SubscribersCount,
} from "../../index";
import { useParams } from "react-router-dom";
import { getChannelDetailsThunk } from "../../features/authSlice";

const ChannelDetails = () => {
  const dispatch = useDispatch();
  const { channelName } = useParams(); // ✅ Extract username from URL

  useEffect(() => {
    if (channelName) {
      dispatch(
        getChannelDetailsThunk({
          url: `/users/channel/${channelName}`,
          config: {},
        })
      );
    }
  }, []);

  const channelData = useSelector((state) => state.auth.channelData);

  const {
    fullName,
    email,
    userName,
    avatar,
    coverImage,
    isOwner,
    isSubscribed,
    subscribersCount,
    subscribedChannelsCount,
  } = channelData || {};

  return (
    <>
      {/* Cover Image */}
      <div className="relative">
        <CoverImage coverImage={coverImage?.secureURL} />
        <div className="absolute bottom-[-40px] left-6">
          <Avatar
            width="w-24"
            avatar={avatar?.secureURL || "./src/assets/man vector avatar.jpg"}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-16 px-6 text-white">
        <FullName fullName={fullName} />
        <Email email={email} />
        <Username userName={userName} />
        <div className="flex gap-4 mt-2">
          <SubscribersCount count={subscribersCount} />
          <SubscribedToCount count={subscribedChannelsCount} />
        </div>
        {!isOwner && (
          <div className="mt-4">
            <SubscribeButton isSubscribed={isSubscribed} />
          </div>
        )}
      </div>
    </>
  );
};

export default ChannelDetails;
