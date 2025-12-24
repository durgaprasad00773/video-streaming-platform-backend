const errorHandler = (err, req, res, next) => {
  console.log("🔥 Error middleware triggered:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
};


export {errorHandler}