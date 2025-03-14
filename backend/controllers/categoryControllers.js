const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const mongoose = require('mongoose');

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

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Geçersiz kategori ID' });
    }

    const subCategories = await SubCategory.find({ category: categoryId }).sort(
      { name: 1 }
    );

    if (!subCategories.length) {
      return res
        .status(404)
        .json({ message: 'Bu kategoriye ait alt kategori bulunamadı' });
    }

    res.status(200).json(subCategories);
  } catch (error) {
    console.error('Alt kategorileri alırken hata oluştu:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
const addSubcategoryByCategory=async(req,res)=>{
  const {subCategory, category,name}=req.body
  const subs=await SubCategory.findById(subCategory) 
    let newSubCategory=await SubCategory.create({category,name})
    return res.json({data:newSubCategory._id}) 
}
module.exports = { getCategories, getSubCategoriesByCategory, addSubcategoryByCategory };
