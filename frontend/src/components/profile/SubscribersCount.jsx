import React from "react";

const SubscribersCount = ({ count }) => {
  return (
    <div className="text-sm text-gray-300">
      <strong>{count}</strong> Subscribers
    </div>
  );
};

export default SubscribersCount;
