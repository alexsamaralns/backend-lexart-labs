const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");

const getProfile = catchAsync(async (req, res, next) => {
  const idUser = req.user.id;

  const userInfo = await user.findOne({
    where: {
      id: idUser,
    },
  });

  return res.status(200).json({
    status: "success",
    data: userInfo,
  });
});

module.exports = { getProfile };
