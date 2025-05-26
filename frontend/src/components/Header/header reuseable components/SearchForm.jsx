import React from "react";
import { InputContainer } from "../../../index";

export default function SearchForm({ icon, iconOnClick }) {
  return (
    <form>
      <InputContainer
        name="search"
        type="text"
        placeholder="Search..."
        icon={icon}
        customInpClass="py-2 hidden lg:block"
        iconOnClick={iconOnClick}
      />
    </form>
  );
}
