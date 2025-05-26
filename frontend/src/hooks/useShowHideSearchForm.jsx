import React, { useState } from "react";
export default function useShowHideSearchForm() {
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleShowHideSearchForm = () => {
    setShowSearchBar((prev) => !prev);
  };

  return { showSearchBar, handleShowHideSearchForm };
}
