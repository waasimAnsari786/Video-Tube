import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AddUpdateVideoForm } from "../../index";
import { setVideoById } from "../../features/videoSlice";

const UpdateVideoPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const videoData = useSelector((state) => state.video.video);

  useEffect(() => {
    if (videoId) {
      dispatch(setVideoById(videoId));
    }
  }, []);

  return <AddUpdateVideoForm isEditing={true} initialData={videoData} />;
};

export default UpdateVideoPage;
