// a utility function or wraper for controllers for avoiding redundancy of try-catch in each controller
const asyncHandler = requestHandler => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).reject(error => next(error));
};

export default asyncHandler;
