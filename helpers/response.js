export const response = (res, success, statusCode, data, message) => {
  const response = {
    success,
    statusCode,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};
