const initializeLoading = (state) => {
  state.loading = true;
  state.error = null;
};

const updateloadingAndError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

export { initializeLoading, updateloadingAndError };
