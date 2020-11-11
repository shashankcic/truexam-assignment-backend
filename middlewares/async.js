//Handling the try and catch in a middleware function by passing it here, 
//wrapping with a promise and handling it.
const asyncHandlers = fn => (req, res, next) => {
  Promise.resolve(fn(req,res,next)).catch(next);
}

module.exports = asyncHandlers;