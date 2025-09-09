import { useRef, useEffect } from "react";

const useAbortController = () => {
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  return abortController;
};

export default useAbortController;
