import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosThunk } from "../../features/videoSlice";
import { VideoCard } from "../../index";

export default function HomePage() {
  const dispatch = useDispatch();

  const videosArr = useSelector((state) => state.video.videosArr); // adjust if your slice name differs

  useEffect(() => {
    dispatch(getAllVideosThunk({ url: "/videos" }));
  }, []);

  console.log("all video response ", videosArr);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-semibold mb-4">All Videos</h1>

      {videosArr && <p>videos: {videosArr.totalDocs}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {videosArr?.docs?.map((video, idx) => (
          <VideoCard key={idx} video={video} />
        ))} */}
      </div>
    </div>
  );
}
