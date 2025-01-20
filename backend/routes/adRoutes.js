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

router.get('/', getAllAds);
router.get('/my-ads', protect, getUserAds); 
router.get('/:id', getSingleAd); 

router.use(protect);
router.post('/', validateAd, createAd);
router.put('/:id', validateAd, updateAd); 
router.delete('/:id',protect, deleteAd); 

module.exports = router;
