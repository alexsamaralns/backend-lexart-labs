const { authentication } = require("../controller/authController");
const { getData} = require("../controller/dashboardController");

const router = require("express").Router();

router.route("/").get(authentication, getData);


module.exports = router;
