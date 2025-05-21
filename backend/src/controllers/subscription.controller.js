import ApiError from "../utils/API_error.utils.js";
import ApiResponse from "../utils/API_response.utils.js";
import Subscription from "../models/subscription.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import User from "../models/user.model.js";
import { checkObjectID } from "../utils/checkFields.utils.js";

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

  checkObjectID(channelId, "Channel id is invalid");

  const isChannelExist = await User.findById(channelId);

  if (!isChannelExist) {
    throw new ApiError(404, "Channel with the requested id doesn't exist");
  }

  // check - is requested user owner of the channel?
  if (channelId === req.user._id) {
    throw new ApiError(
      400,
      "You own this channel. You can't subscribe or unsubscribe it."
    );
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
  // Extract channelID
  const { channelId } = req.params;

  // Validate ObjectId
  checkObjectID(channelId, "Channel id is invalid");

  // Check if channel exists
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel with the requested ID doesn't exist");
  }

  // Get subscribers using aggregation
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberData",
      },
    },
    {
      $unwind: "$subscriberData",
    },
    {
      $project: {
        _id: 0,
        userName: "$subscriberData.userName",
        fullName: "$subscriberData.fullName",
        avatarURL: "$subscriberData.avatar.secureURL",
      },
    },
  ]);

  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// Controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // Validate ObjectId
  checkObjectID(subscriberId, "Subscriber ID is invalid");

  // Check if subscriber exists
  const subscriber = await User.findById(subscriberId);
  if (!subscriber) {
    throw new ApiError(404, "Subscriber with the requested ID doesn't exist");
  }

  // Get subscribed channels using aggregation
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelData",
      },
    },
    {
      $unwind: "$channelData",
    },
    {
      $project: {
        _id: 0,
        userName: "$channelData.userName",
        fullName: "$channelData.fullName",
        avatarURL: "$channelData.avatar.secureURL",
      },
    },
  ]);

  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
