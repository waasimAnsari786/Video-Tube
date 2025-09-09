import { useRef, useEffect } from "react";

export const useAbortController = () => {
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  return abortController;
};
