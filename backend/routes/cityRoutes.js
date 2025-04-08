const express = require('express');
const { getCities } = require('../controllers/cityControllers');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const City = require('../models/City');
const Ad = require('../models/ad');

const router = express.Router();

router.get('/', getCities);
router.put('/test', async (req, res) => {
    try {
      const newCityId = '6759566056a64feeb5b39e60';
  
      const result = await City.find({_id:newCityId});
  
      res.json({ message: 'Tüm ilanlar güncellendi.', result });
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  });
  
module.exports = router;
