const express = require('express');
const {
  createAd,
  viewAds,
  viewAdById,
  updateAd,
  deleteAd,
} = require('../controllers/adControllers');

const router = express.Router();

router.post('/createAd', createAd); 
router.get('/viewAds', viewAds); 
router.get('/viewAd/:id', viewAdById); 
router.put('/updateAd', updateAd); 
router.delete('/deleteAd', deleteAd); 

module.exports = router;
