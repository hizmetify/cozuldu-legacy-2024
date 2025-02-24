const express = require('express'); 

const router = express.Router();
const {
    userInfoUpdate,
userPasswordUpdate
}=require('../controllers/userControllers');
const validateAd = require('../middlewares/adMiddleware');


router.post('/userUpdate', userInfoUpdate);
router.post('/passwordUpdate',userPasswordUpdate);
module.exports = router;
