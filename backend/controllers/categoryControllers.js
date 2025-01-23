const Category = require('../models/category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCategories };
