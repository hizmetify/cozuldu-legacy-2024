const express = require('express');
const {getStats} = require("../controllers/statsControllers")

const router = express.Router();

router.get("/getStats", getStats)

module.exports = router;
