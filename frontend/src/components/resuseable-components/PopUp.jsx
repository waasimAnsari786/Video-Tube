import React from "react";

export default function PopUp({ button, content = [], position = "start" }) {
  return (
    <div className={`dropdown dropdown-${position}`}>
      <div tabIndex={0} role="button" className="cursor-pointer">
        {button}
      </div>

      <ul
        tabIndex={0}
        className="menu menu-md dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-xl my-border-light my-2"
      >
        {content.map((item, index) => (
          <li
            key={index}
            className="rounded hover:bg-(--my-blue) hover:text-(--my-white) cursor-pointer text-(--my-blue)"
            onClick={item.onClick}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
