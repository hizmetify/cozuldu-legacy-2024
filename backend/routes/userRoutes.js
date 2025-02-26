const express = require('express');

const router = express.Router();
const {
  deleteAccount,
  nameInfoUpdate,
  emailUpdate,
} = require('../controllers/userControllers');

router.put('/emailUpdate', emailUpdate);
router.put('/nameInfoUpdate', nameInfoUpdate);
router.delete('/deleteAccount', deleteAccount);

module.exports = router;
