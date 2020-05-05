const sendErrorPro = (err, req, res) => {
  // console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    name: err.name,
    error: err,
    // stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  console.log("ERROR FOUND");
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  sendErrorPro(err, req, res);
};

// catch Async will throw an error with a new error object  using next(errObject) and this will catch that error
// in some cases we will also manually throw errors using AppError in which case we will specify the error codes and error message
