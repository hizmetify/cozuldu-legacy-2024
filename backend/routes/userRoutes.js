const express = require('express');

const router = express.Router();
const {
  deleteAccount,
  nameInfoUpdate,
  emailUpdate,
  favoriGet,
  favoriPostAndDelete,
  isFavori,
  isViewing,
  contactInfo,
  favoriCount,
} = require('../controllers/userControllers');

router.post('/favoriAction',favoriPostAndDelete) ;
router.put('/emailUpdate', emailUpdate);
router.put('/nameInfoUpdate', nameInfoUpdate);
router.delete('/deleteAccount', deleteAccount);
router.get('/favori/get',favoriGet);
router.post('/favori/is',isFavori);
router.post('/isViewing',isViewing)
router.post('/teacherContact',contactInfo)
router.post('/favori/count',favoriCount)
module.exports = router;
