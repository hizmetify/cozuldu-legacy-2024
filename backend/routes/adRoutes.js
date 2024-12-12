const express = require('express');
const {
  createAd,
  updateAd,
  deleteAd,
  getAllAds,
  getAd,
} = require('../controllers/adControllers');

const router = express.Router();

router.post('/createAd', createAd);
router.put('/updateAd/:id', updateAd);
router.delete('/deleteAd/:id', deleteAd);
router.get('/getAllAds', getAllAds);
router.get('/getAd/:id', getAd);

module.exports = router;
