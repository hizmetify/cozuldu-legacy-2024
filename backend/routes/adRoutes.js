const express = require('express');
const {
  createAd,
  deleteAd,
  getAllAds,
  getUserAds,
  getSingleAd,
  updateAd,
} = require('../controllers/adControllers');
const validateAd = require('../middlewares/adMiddleware');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllAds); // Tüm ilanlar
router.get('/my-ads', protect, getUserAds); // Kendi ilanlarını görüntüle
router.get('/:id', getSingleAd); // Tek ilan görüntüleme

router.use(protect);
router.post('/', validateAd, createAd); // Yeni ilan oluştur
router.put('/:id', validateAd, updateAd); // İlan güncelle
router.delete('/:id',protect, deleteAd); // İlan sil

module.exports = router;
