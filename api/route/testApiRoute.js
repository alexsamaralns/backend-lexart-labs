const { testApi } = require('../controller/testApiController');
const router = require('express').Router();

router.route('/').get(testApi);

module.exports = router;
