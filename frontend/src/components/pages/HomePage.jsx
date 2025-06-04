import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosThunk } from "../../features/videoSlice";
import { Column, Row, VideoCard } from "../../index";

export default function HomePage() {
  // const dispatch = useDispatch();

  const videosArr = useSelector((state) => state.video.videosArr); // adjust if your slice name differs

  // useEffect(() => {
  //   if (videosArr.length === 0) {
  //     dispatch(getAllVideosThunk({ url: "/videos" }));
  //   }
  // }, []);

  // console.log("all video response ", videosArr);

  return (
    // <h1>This is home page</h1>
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">All Videos</h1>

      {videosArr && <p>videos: {videosArr.totalDocs}</p>}
      <VideoCard />

      {/* <Row>
        {videosArr?.docs?.map((video, idx) => (
          <Column>
          </Column>
        ))}
      </Row> */}
    </div>
  );
}
