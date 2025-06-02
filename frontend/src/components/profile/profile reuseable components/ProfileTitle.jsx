import React from "react";

export default function ProfileTitle({ title }) {
  return (
    <h2 className="md:text-xl sm:text-lg text-sm font-bold my-4">{title}</h2>
  );
}
