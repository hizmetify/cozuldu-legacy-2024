const express = require('express');
const {
  getCategories,
  getSubCategoriesByCategory,
} = require('../controllers/categoryControllers');

const router = express.Router();

router.get('/', getCategories);

router.get('/:categoryId/subcategories', getSubCategoriesByCategory);

module.exports = router;
