import React from "react";

const SubscribedToCount = ({ count }) => {
  return (
    <div className="text-sm text-gray-300">
      <strong>{count}</strong> Subscribed To
    </div>
  );
};

export default SubscribedToCount;
