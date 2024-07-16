const catchAsync = require("../utils/catchAsync");

const testApi = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "It is working correctly",
  });
});

module.exports = { testApi };
