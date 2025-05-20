import Comment from "../models/comment.model.js";
import Tweet from "../models/tweet.model.js";
import Video from "../models/video.model.js";

export const getModelByName = modelName => {
  const models = {
    tweet: Tweet,
    comment: Comment,
    video: Video,
  };

  return models[modelName];
};
