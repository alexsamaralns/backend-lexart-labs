const { authentication } = require("../controller/authController");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getDeletedProducts,
  postProductsTest,
} = require("../controller/productController");

const router = require("express").Router();

router.route("/deleteAll").delete(authentication, deleteAllProducts);

router.route("/deleted").post(authentication, getDeletedProducts);

router
  .route("/:id")
  .get(authentication, getProductById)
  .patch(authentication, updateProduct)
  .delete(authentication, deleteProduct);

router
  .route("/getProducts")
  .post(authentication, getAllProducts);

router
  .route('/addProductsTest')
  .post(authentication, postProductsTest)

router
  .route("/")
  .post(authentication, createProduct);

module.exports = router;
