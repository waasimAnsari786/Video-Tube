import React, { useEffect } from "react";
import useToggle from "../../hooks/useToggle"; // Adjust path as needed

const RadioInputContainer = ({
  label = "Status",
  defaultChecked = true,
  onStatusChange,
}) => {
  const { toggle, handleToggle } = useToggle(defaultChecked); // ← uses defaultChecked

  useEffect(() => {
    onStatusChange(toggle ? "Public" : "Private");
  }, [toggle]);

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        checked={toggle}
        onChange={handleToggle}
        className="toggle border-red-600 bg-red-500 checked:border-green-600 checked:bg-green-500"
      />
      <span
        className={`text-sm font-bold ${
          toggle ? "text-green-600" : "text-red-600"
        }`}
      >
        {toggle ? "Public" : "Private"}
      </span>
    </label>
  );
};

export default RadioInputContainer;
