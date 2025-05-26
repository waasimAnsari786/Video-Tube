import React from "react";
import { InputContainer } from "../../../index";

export default function SearchForm({
  icon,
  customClass,
  iconOnClick = undefined,
}) {
  return (
    <form className={customClass}>
      <InputContainer
        type="text"
        placeholder="Search..."
        icon={icon}
        customInpClass="py-2"
        iconOnClick={iconOnClick}
      />
    </form>
  );
}
