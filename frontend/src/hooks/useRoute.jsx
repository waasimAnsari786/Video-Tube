import React from "react";
import { useNavigate } from "react-router-dom";

export default function useRoute() {
  const navigate = useNavigate();

  const handleRoute = (route) => {
    navigate(route);
  };

  return { handleRoute };
}
