import React, { useState } from "react";
export default function useToggle() {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return { toggle, handleToggle };
}
