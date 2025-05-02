const updateStateFromResponse = (state, payload) => {
  if (!payload || typeof payload !== "object") return;
  Object.entries(payload).forEach(([key, value]) => {
    if (key in state && !["loading", "error", "authStatus"].includes(key)) {
      state[key] = value;
    }
  });
};

export default updateStateFromResponse;
