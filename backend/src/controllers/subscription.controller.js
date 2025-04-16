import mongoose from "mongoose";
import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import Subscription from "../models/subscription.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import User from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // extract channelID
  // check - is channel id valid
  // check - does channel exist?
  // find the subscription on the basis of both channel and userId
  // check - which http method have called?
  /* if http method is POST and subscription have found, return response with a suitable
  message otherwise create a new subsription and then return response*/
  /* if http method is DELETE and subscription haven't found, return response with a
  suitable message otherwise delete the subscription and then return response */

  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Channel id is invalid");
  }

  const isChannelExist = await User.findById(channelId);

  if (!isChannelExist) {
    throw new ApiError(404, "Channel with the requested id doesn't exist");
  }

  const subscription = await Subscription.findOne({
    $and: [
      {
        channel: channelId,
        subscriber: req.user._id,
      },
    ],
  });

  if (req.method === "POST") {
    // If already subscribed
    if (subscription) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, { isSubscribed: true }, "Already subscribed")
        );
    }

    const createdSubscription = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });

    if (!createdSubscription) {
      throw new ApiError(500, "Error while subscribing the user");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { isSubscribed: true },
          "User subscribed successfully"
        )
      );
  }

  if (req.method === "DELETE") {
    if (!subscription) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, { isSubscribed: false }, "Not subscribed yet")
        );
    }

    await subscription.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isSubscribed: false },
          "User unsubscribed successfully"
        )
      );
  }

  throw new ApiError(405, "Method not allowed on this route");
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
