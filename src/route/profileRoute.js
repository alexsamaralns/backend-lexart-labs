const { authentication } = require("../controller/authController");
const { getProfile } = require("../controller/profileController");

const router = require("express").Router();

router.route("/").get(authentication, getProfile);


module.exports = router;
