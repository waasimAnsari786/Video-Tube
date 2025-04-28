import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

const FormProvider = ({ children }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormContext.Provider value={{ showPassword, togglePasswordVisibility }}>
      {children}
    </FormContext.Provider>
  );
};

const useFormContextCustom = () => useContext(FormContext);

export { FormProvider, useFormContextCustom };
