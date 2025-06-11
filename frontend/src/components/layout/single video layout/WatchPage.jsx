import React from "react";
import {
  SingleVideoLayout,
  RecommendedVideosSidebar,
  Container,
  CommentSection,
} from "../../../index";

const WatchPage = () => {
  const mainVideoData = {
    title: "How to Build a YouTube Clone",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    views: "2.3M views",
    uploadedDate: "2 days ago",
    description:
      "In this video we build a responsive YouTube UI clone using React and Tailwind CSS.",
    uploaderAvatar:
      "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?fm=jpg&q=60&w=3000",
    channelName: "Dev Journey",
    subscriberCount: "680K subscribers",
  };

  const recommendedVideos = [
    {
      title: "React Crash Course",
      duration: "1h 45m",
      views: "700K views",
      uploadedDate: "5 days ago",
      thumbnail: "https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
      uploaderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      channelName: "Codevolution",
    },
    {
      title: "Tailwind in 30 Minutes",
      duration: "30m",
      views: "1.1M views",
      uploadedDate: "1 week ago",
      thumbnail: "https://img.youtube.com/vi/dFgzHOX84xQ/hqdefault.jpg",
      uploaderAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      channelName: "Traversy Media",
    },
    // Add more objects
  ];

  return (
    <Container childElemClass="flex flex-col lg:flex-row gap-2 pt-2">
      <div>
        <SingleVideoLayout videoData={mainVideoData} />
        <CommentSection />
      </div>

      <RecommendedVideosSidebar videos={recommendedVideos} />
    </Container>
  );
};

export default WatchPage;
