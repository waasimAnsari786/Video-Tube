import React from "react";
import { Icon, Row, Column } from "../../../index";

const FormInput = ({
  type,
  placeholder,
  customClass,
  customInpClass = "py-3 sm:py-4",
  iconOnClick,
  icon,
  ...props
}) => {
  return (
    <Row
      customRowClass={`px-2 rounded-lg ${customClass} my-border-light focus-within:ring-2 focus-within:ring-(--my-border-dark)`}
    >
      <Column
        customColClass={`col-span-1 flex justify-center items-center ${
          iconOnClick ? "cursor-pointer" : ""
        }`}
        onClick={iconOnClick}
      >
        <Icon icon={icon} className={"text-gray-400 text-sm md:text-[1rem]"} />
      </Column>
      <Column customColClass="col-span-11">
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full text-sm focus:outline-none ${customInpClass}`}
          {...props}
        />
      </Column>
    </Row>
  );
};

export default FormInput;
