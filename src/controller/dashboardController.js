const user = require("../db/models/user");
const product = require("../db/models/products");
const catchAsync = require("../utils/catchAsync");

const getData = catchAsync(async (req, res, next) => {
  const countUsers = await user.count();
  const countProducts = await product.count();
  return res.status(200).json({
    status: "success",
    data: {
      users: countUsers ?? 0,
      products: countProducts ?? 0,
    }
  });
});

module.exports = { getData };
