// This is a utility function for updating selected states of redux-toolkit's slices
// currently is is being used in authSlice.
const updateStateFromResponse = (state, payload) => {
  if (!payload || typeof payload !== "object") return;
  Object.entries(payload).forEach(([key, value]) => {
    if (key in state && !["loading", "error", "authStatus"].includes(key)) {
      state[key] = value;
    }
  });
};

export default updateStateFromResponse;
