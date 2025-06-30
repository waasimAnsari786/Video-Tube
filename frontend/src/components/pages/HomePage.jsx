import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosThunk } from "../../store/slices/videoSlice";
import { Column, PlaylistCard, Row, VideoCard } from "../../index";

export default function HomePage() {
  const dispatch = useDispatch();
  console.log("Home page render");

  const videosArr = useSelector((state) => state.video.videosArr); // adjust if your slice name differs

  // useEffect(() => {
  //   if (videosArr.length === 0) {
  //     dispatch(getAllVideosThunk({ url: "/videos" }));
  //   }
  // }, []);

  // console.log("all video response ", videosArr);

  const videos = [
    {
      title: "How to Manage Your Finances",
      description:
        "Learn top strategies for budgeting, saving, and investing wisely in this comprehensive financial guide.",
      thumbnail:
        "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    },
    {
      title: "Investment Tips for Beginners",
      description:
        "This video breaks down the basics of investing, from stocks to mutual funds. A must-watch for newcomers.",
      thumbnail:
        "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    },
    {
      title: "Secrets of Financial Freedom",
      description:
        "Discover actionable steps and habits you can follow to achieve financial independence.",
      thumbnail:
        "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    },
  ];

  return (
    <>
      <Row>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <VideoCard />
        </Column>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <VideoCard />
        </Column>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <VideoCard />
        </Column>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <PlaylistCard />
        </Column>
      </Row>
    </>
  );
}
