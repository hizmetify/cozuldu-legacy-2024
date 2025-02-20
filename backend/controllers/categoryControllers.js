const Category = require('../models/category');
const SubCategory = require('../models/subCategory');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Kategorileri alırken hata oluştu:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId }).sort({ name: 1 });

    if (!subCategories.length) {
      return res.status(404).json({ message: 'Bu kategoriye ait alt kategori bulunamadı' });
    }

    res.status(200).json(subCategories);
  } catch (error) {
    console.error('Alt kategorileri alırken hata oluştu:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = { getCategories, getSubCategoriesByCategory };
