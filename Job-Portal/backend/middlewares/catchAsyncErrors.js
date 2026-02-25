export const catchAsyncErrors = (cbFunction) => {
  return (req, res, next) => {
    Promise.resolve(cbFunction(req, res, next)).catch(next);
  };
};
