import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, CoverImage, Button, Row, Column } from "../../index";
import { useParams } from "react-router-dom";
import { getChannelDetailsThunk } from "../../features/authSlice";

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
        {/* <Column customColClass="col-span-12 flex  items-center gap-4">
          <Avatar
            width="lg:w-[15%] w-[30%]"
            avatar={avatar?.secureURL || "./src/assets/man vector avatar.jpg"}
          />

          <div className="space-y-2">
            <p className="lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold">
              {fullName || "Waasim Anasri"}
            </p>
            <p className="sm:text-sm text-[.7rem] font-semibold">
              {email || "waasim@gmail.com"}
            </p>
            <p className="sm:text-sm text-[.7rem] font-semibold sm:font-bold">
              {userName || "wasim123"}
            </p>
            <div className="sm:flex flex-wrap sm:gap-4 gap-4 hidden ">
              <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
                Subscribers: {subscribersCount || "0"}
              </p>
              <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
                Subscribed To: {subscribedChannelsCount || "0"}
              </p>
            </div>
            {!isOwner && (
              <Button
                btnText={isSubscribed ? "Subscribed" : "Subscribe"}
                customClass="sm:text-sm text-[.8rem] mt-3"
              />
            )}
          </div>
        </Column> */}

        <Column customColClass="col-span-3 md:col-span-2">
          <Avatar
            width="w-full"
            avatar={avatar?.secureURL || "./src/assets/man vector avatar.jpg"}
          />
        </Column>

        <Column customColClass="col-span-9 md:col-span-10 space-y-1 sm:space-y-2">
          <p className="lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold">
            {fullName || "Waasim Anasri"}
          </p>
          <p className="sm:text-sm text-[.7rem] font-semibold">
            {email || "waasim@gmail.com"}
          </p>
          <p className="sm:text-sm text-[.7rem] font-semibold sm:font-bold">
            {userName || "wasim123"}
          </p>
          <div className="flex flex-wrap gap-4">
            <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
              Subscribers: {subscribersCount || "0"}
            </p>
            <p className="sm:text-sm text-[.8rem] font-semibold sm:font-bold">
              Subscribed To: {subscribedChannelsCount || "0"}
            </p>
          </div>
          {!isOwner && (
            <Button
              btnText={isSubscribed ? "Subscribed" : "Subscribe"}
              customClass="sm:text-sm text-[.8rem]"
              // customClass="sm:text-sm text-[.8rem] hidden sm:block"
            />
          )}
        </Column>
      </Row>
    </>
  );
};

export default ChannelDetails;
