const { Sequelize } = require('sequelize');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT });
const product = require("../db/models/products");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createProduct = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  const newProduct = await product.create({
    name: body.name,
    brand: body.brand,
    model: body.model,
    price: body.price,
    operating_system: body.operating_system,
    createBy: userId,
  });

  return res.status(201).json({
    status: "success",
    data: newProduct,
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const { page = 1, searchProduct } = req.body;
  const limit = 50;
  let lastPage = 1;

  const searchProductPrice = Number(searchProduct);

  let whereCondition = {};

  if (searchProduct) {
    whereCondition = {
      [Sequelize.Op.or]: [
        { name: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
        { brand: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
        { model: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
        { operating_system: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
      ],
    };

    if (!isNaN(searchProductPrice)) {
      whereCondition[Sequelize.Op.or].push({ price: { [Sequelize.Op.eq]: searchProductPrice } });
    }
  }

  const count = await product.count({ where: whereCondition });

  if (count !== 0) {
    lastPage = Math.ceil(count / limit);
  } else {
    return res.status(200).json({
      status: "success",
      data: [],
    });
  }

  const offset = ((page * limit) - limit);

  const products = await product.findAll({
    limit,
    offset,
    order: [["id", "ASC"]],
    where: whereCondition,
  });

  return res.status(200).json({
    status: "success",
    data: products,
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

const getProductById = catchAsync(async (req, res, next) => {
  const productById = req.params.id;
  const result = await product.findByPk(productById);

  if (!result) return next(new AppError("Product id not found", 400));

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const productById = req.params.id;
  const body = req.body;

  const result = await product.findOne({
    where: { id: productById },
  });

  if (!result) return next(new AppError("Invalid product id", 400));

  result.name = body.name;
  result.brand = body.brand;
  result.model = body.model;
  result.price = body.price;
  result.operating_system = body.operating_system;

  const updatedResult = await result.save();

  return res.json({
    status: "success",
    data: updatedResult,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const productById = +req.params.id;

  const result = await product.findOne({
    where: { id: productById },
  });

  if (!result) return next(new AppError("Invalid product id", 400));

  await result.destroy();

  return res.json({
    status: "success",
    message: 'Product deleted successfully',
  });
});

const deleteAllProducts = catchAsync(async (req, res, next) => {
  const totalProducts = await product.count();
  let deletedCount = 0;

  const deleteProducts = async () => {
    const products = await product.findAll();

    for (const prod of products) {
      await product.destroy({ where: { id: prod.id } });
      deletedCount++;

      const progress = Math.round((deletedCount / totalProducts) * 100);

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(progress);
        }
      });
    }

    return res.json({
      status: "success",
      message: 'All products deleted successfully',
    });
  };

  deleteProducts();
});

const getDeletedProducts = catchAsync(async (req, res, next) => {
  const { page = 1, searchProduct } = req.body;
  const limit = 50;
  let lastPage = 1;

  const searchProductPrice = Number(searchProduct);

  let whereCondition = {
    deletedAt: {
      [Sequelize.Op.not]: null,
    },
  };

  if (searchProduct) {
    const orConditions = [
      { name: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
      { brand: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
      { model: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
      { operating_system: { [Sequelize.Op.iLike]: `%${searchProduct}%` } },
    ];

    if (!isNaN(searchProductPrice)) {
      orConditions[Sequelize.Op.or].push({ price: { [Sequelize.Op.eq]: searchProductPrice } });
    }

    whereCondition = {
      ...whereCondition,
      [Sequelize.Op.and]: [
        {
          [Sequelize.Op.or]: orConditions,
        },
      ],
    };
  }

  const count = await product.count({
    where: whereCondition,
    paranoid: false,
  });

  if (count !== 0) {
    lastPage = Math.ceil(count / limit);
  } else {
    return res.status(200).json({
      status: "success",
      data: [],
    });
  }

  const offset = ((page * limit) - limit);

  const deletedProducts = await product.findAll({
    where: whereCondition,
    paranoid: false,
    limit,
    offset,
    order: [["id", "ASC"]]
  });

  return res.status(200).json({
    status: "success",
    data: deletedProducts,
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

const postProductsTest = catchAsync(async (req, res, next) => {
  const products = [];
  const brands = ['Apple', 'Samsung', 'Google', 'Sony', 'LG', 'Nokia', 'Motorola', 'Xiaomi'];
  const operatingSystems = ['iOS', 'Android'];

  const getLastId = await product.findOne({
    order: [['id', 'DESC']],
    limit: 1
  });

  const lastId = getLastId ? getLastId.dataValues.id + 1 : 1;

  for (let i = lastId; i < 50 + lastId; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const operating_system = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
    const price = (Math.random() * 1000).toFixed(2);

    products.push({
      name: `Product ${i}`,
      brand: brand,
      model: `Model ${i}`,
      price: price,
      operating_system: operating_system,
      createBy: Math.floor(Math.random() * 10) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  await product.bulkCreate(products);

  return res.status(201).json({
    status: "success",
    data: {},
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getDeletedProducts,
  postProductsTest,
};
