const express = require('express');
const {
  getCategories,
  getSubCategoriesByCategory,
  addSubcategoryByCategory,
} = require('../controllers/categoryControllers');

const router = express.Router();

router.get('/', getCategories);

router.get('/:categoryId/subcategories', getSubCategoriesByCategory);

router.post('/addSubcategoryByCategory',addSubcategoryByCategory)
module.exports = router;
