// a utility function or wraper for controllers for avoiding redundancy of try-catch in each controller
const asyncHandler = requestHandler => (req, res, next) => {
  // try {
  //   requestHandler(req, res, next);
  // } catch (error) {
  //   next(error);
  // }
  Promise.resolve(requestHandler(req, res, next)).catch(error => next(error));
};

export default asyncHandler;
