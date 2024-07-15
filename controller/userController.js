const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");

const getAllUser = catchAsync(async (req, res, next) => {
  const { page = 1 } = req.body;
  const limit = 10;
  let lastPage = 1;

  const count = await user.count();

  if (count !== 0) {
    lastPage = Math.ceil(count / limit);
  } else {
    return res.status(200).json({
      status: "success",
      data: [],
    });
  }

  const offset = ((page * limit) - limit);

  const users = await user.findAll({
    attributes: { exclude: ["password"] },
    limit,
    offset,
    order: [["id", "ASC"]]
  });
  return res.status(200).json({
    status: "success",
    data: users,
    pagination: {
      page: +page,
      prevPage: +page - 1 >= 1 ? +page - 1 : false,
      nextPage: +page + 1 >= lastPage ? lastPage : +page + 1,
      itemsPerPage: limit,
      totalPages: lastPage,
      totalRegisters: count,
    }
  });
});

module.exports = { getAllUser };
