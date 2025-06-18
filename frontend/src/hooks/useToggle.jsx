import { useState } from "react";

export default function useToggle(initial = false) {
  const [toggle, setToggle] = useState(initial);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return { toggle, handleToggle };
}
