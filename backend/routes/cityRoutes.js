const express = require('express');
const { getCities } = require('../controllers/cityControllers');

const router = express.Router();

router.get('/', getCities);

module.exports = router;
