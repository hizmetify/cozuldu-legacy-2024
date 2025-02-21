import { useState, useEffect } from 'react';
import { fetchCategories, fetchSubCategories } from '../api/categoryAPI';

const CategorySelector = ({ onCategoryChange, onSubCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Kategorileri alırken hata oluştu:', error);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value; 
    setSelectedCategory(categoryId);
    setSelectedSubCategory('');
    onCategoryChange(categoryId);

    if (categoryId) {
      try {
        const data = await fetchSubCategories(categoryId);
        setSubCategories(data);
      } catch (error) {
        console.error('Alt kategorileri alırken hata oluştu:', error);
      }
    } else {
      setSubCategories([]);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Kategori Seç</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Kategori Seç</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}> {/* 📌 ID kullanılıyor */}
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alt Kategori Seç</label>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          disabled={!selectedCategory}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Alt Kategori Seç</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory._id} value={subCategory._id}>
              {subCategory.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategorySelector;
