const { authentication } = require('../controller/authController');
const { getAllUser } = require('../controller/userController');
const router = require('express').Router();

router.route('/').post(authentication, getAllUser);

module.exports = router;
