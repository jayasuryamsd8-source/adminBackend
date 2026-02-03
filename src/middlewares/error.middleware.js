export default function errorHandler(err, req, res, next) {
  // If response already started, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  // Log error (full details only in development)
  if (!isProduction) {
    console.error("❌ ERROR:", {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    console.error("❌ ERROR:", err.message);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && isProduction
        ? "Internal Server Error"
        : err.message || "Something went wrong",
  });
}
