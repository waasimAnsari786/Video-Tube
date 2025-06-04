import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, CoverImage, Button, Row, Column } from "../../index";
import { useParams } from "react-router-dom";
import { getChannelDetailsThunk } from "../../features/authSlice";
import "./css/profile.css";

const ChannelDetails = () => {
  const dispatch = useDispatch();
  const { channelName } = useParams();

  // useEffect(() => {
  //   if (channelName) {
  //     dispatch(
  //       getChannelDetailsThunk({
  //         url: `/users/channel/${channelName}`,
  //         config: {},
  //       })
  //     );
  //   }
  // }, []);

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
      <Row>
        <Column customColClass="col-span-12 mb-5">
          <CoverImage
            coverImage={
              coverImage?.secureURL || "./src/assets/banner-placeholder.jpg"
            }
          />
        </Column>

        <Column customColClass="col-span-3 profile-avatar md:col-span-2">
          <Avatar
            width="w-full"
            avatar={avatar?.secureURL || "./src/assets/man vector avatar.jpg"}
          />
        </Column>

        <Column customColClass="col-span-9 md:col-span-10 profile-user-info space-y-1 sm:space-y-2 flex flex-col justify-center">
          <p className="lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold">
            {fullName || "Waasim Ansari"}
          </p>

          <p className="sm:text-sm text-[.7rem] font-semibold">
            {email || "waasim@gmail.com"}
          </p>
          <p className="sm:text-sm text-[.7rem] font-semibold sm:font-bold">
            {userName || "wasim123"}
          </p>

          <div className="flex gap-4  lg_profile_user_info">
            <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
              Subscribers: {subscribersCount || "0"}
            </p>
            <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
              Subscribed To: {subscribedChannelsCount || "0"}
            </p>
          </div>
          {!isOwner && (
            <li className="list-none">
              <Button
                btnText={isSubscribed ? "Subscribed" : "Subscribe"}
                customClass="sm:text-sm text-[.8rem] hidden sm:block "
                // customClass="sm:text-sm text-[.8rem]"
              />
            </li>
          )}
        </Column>
        <Column customColClass="col-span-12 space-y-4 mt-2">
          <div className="flex gap-4 sm_profile_user_info">
            <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
              Subscribers: {subscribersCount || "0"}
            </p>
            <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
              Subscribed To: {subscribedChannelsCount || "0"}
            </p>
          </div>
          {!isOwner && (
            <li className="list-none">
              <Button
                btnText={isSubscribed ? "Subscribed" : "Subscribe"}
                customClass="block text-center sm:hidden w-full"
                padding="py-2"
                borderRadius="rounded-full"
              />
            </li>
          )}
        </Column>
      </Row>
    </>
  );
};

export default ChannelDetails;
