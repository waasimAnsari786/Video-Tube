import React from "react";
import { Row, Column } from "../../../index";

const FormInput = ({
  type,
  placeholder,
  customClass,
  customInpClass = "",
  iconOnClick,
  icon,
  margin = "",
  padding = "",
  ...props
}) => {
  return (
    <Row
      customRowClass={`px-2 rounded-lg ${customClass} ${margin} ${padding} my-border-light focus-within:ring-2 focus-within:ring-(--my-border-dark)`}
    >
      <Column
        customColClass={`col-span-1 flex justify-center items-center text-gray-400 text-sm md:text-[1rem] ${
          iconOnClick ? "cursor-pointer" : ""
        }`}
        onClick={iconOnClick}
      >
        {icon}
      </Column>
      <Column customColClass="col-span-11">
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full text-sm focus:outline-none ${customInpClass} `}
          {...props}
        />
      </Column>
    </Row>
  );
};

export default FormInput;
