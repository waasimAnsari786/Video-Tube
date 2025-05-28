import React, { forwardRef } from "react";

export default forwardRef(function MediaInput({ registerName, onChange }, ref) {
  return (
    <>
      <input
        type="file"
        accept="image/*"
        {...registerName}
        ref={(e) => {
          // Attach both refs: register's and custom
          registerName.ref?.(e); // react-hook-form's ref
          if (ref) {
            if (typeof ref === "function") {
              ref(e);
            } else {
              ref.current = e;
            }
          }
        }}
        style={{ display: "none" }}
        onChange={onChange}
      />
    </>
  );
});
