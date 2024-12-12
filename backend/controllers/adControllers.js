const Ad = require('../models/ad');
const adSchema = require('../validations/adValidation');

const createAd = async (req, res) => {
  try {
    const { error } = adSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }

    const newAd = new Ad(req.body);
    await newAd.save();
    res.status(201).json({
      message: 'İlan oluşturuldu',
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const updateAd = async (req, res) => {
  try {
    const { error } = adSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
        message: 'Validasyon Hatası',
      });
    }

    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAd) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    res.status(200).json({ message: 'İlan başarıyla güncellendi' });
  } catch (error) {
    res.status(500).json({
      message:
        'İlan güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin',
    });
  }
};

const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('user', 'name email');
    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'İlanlar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin',
    });
  }
};

const getAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('user', 'name email');
    if (!ad) {
      return res
        .status(404)
        .json({ message: 'İlan bulunamadı. Kaldırılmış olabilir.' });
    }
    res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'İlan getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin',
    });
  }
};

const deleteAd = async (req, res) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);
    if (!deletedAd) {
      res.status(401).json({ message: 'İlan bulunamadı' });
    }

    res.status(200).json({ message: 'İlan başarıyla silindi' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message:
        'İlan silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin',
    });
  }
};

module.exports = {
  createAd,
  deleteAd,
  getAllAds,
  getAd,
  updateAd,
};
