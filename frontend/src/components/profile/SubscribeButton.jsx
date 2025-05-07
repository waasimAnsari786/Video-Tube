import React from "react";

const SubscribeButton = ({ isSubscribed }) => {
  return (
    <button
      className={`px-4 py-2 rounded text-white ${
        isSubscribed ? "bg-gray-600" : "bg-blue-600"
      }`}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;
