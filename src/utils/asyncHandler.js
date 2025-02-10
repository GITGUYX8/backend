// Higher order function that takes a request handler function as parameter
const asyncHandler = (requestHandler) => {
  // Returns a middleware function that handles async operations
  return (req, res, next) => {
    // Resolves the request handler promise and passes any errors to next middleware
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// Exports the asyncHandler function to be used in other files
export { asyncHandler };

// const asyncHandler = (fn) => async (req, res, next) =>
// {
//     try{
//         await fn(req, res, next)
//     }catch(error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
