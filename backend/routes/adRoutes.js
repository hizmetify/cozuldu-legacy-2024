const express = require("express");
const {
  createAd,
  updateAd,
  getAllAds,
  getUserAds,
  getSingleAd,
  deleteAd,
  getAdsByCategory,
} = require("../controllers/adControllers");
const validateAd = require("../middlewares/adMiddleware");
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();
router.get("/", getAllAds);
router.get("/category/:categoryId", getAdsByCategory);
router.get("/my-ads", protect, getUserAds);
router.get("/:id", getSingleAd);

router.use(protect);
router.post("/", upload.array("images", 5), validateAd, createAd);
router.put("/:id", upload.array("images", 5), validateAd, updateAd);
router.delete("/:id", deleteAd);

module.exports = router;
