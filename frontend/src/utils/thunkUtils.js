const updateStateOnPending = (state) => {
  state.loading = true;
  state.error = null;
};

const updateStateOnRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export { updateStateOnPending, updateStateOnRejected };
