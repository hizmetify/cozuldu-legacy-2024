const Ad = require('../models/ad');

const createAd = async (req, res) => {
  console.log('req.body', req.body);

  try {
    const imagePaths = req.files.map((file) => file.path);

    const ad = new Ad({
      ...req.body,
      images: imagePaths,
      user: req.user.id,
    });

    await ad.save();

    const populatedAd = await Ad.findById(ad._id).populate(
      'user',
      'name email'
    );

    res.status(201).json({
      success: true,
      message: 'İlan başarıyla oluşturuldu',
      data: populatedAd,
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin',
    });
  }
};

const updateAd = async (req, res) => {
  const { id } = req.params;
  try {
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    const ad = await Ad.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        ...req.body,
        images: imagePaths.length > 0 ? imagePaths : undefined,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    res.status(200).json({
      success: true,
      message: 'İlan başarıyla güncellendi',
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlan güncellenirken bir hata oluştu. Lütfen tekrar deneyin',
    });
  }
};

const getUserAds = async (req, res) => {
  try {
    const userAds = await Ad.find({ user: req.user.id });

    if (!userAds.length) {
      return res.status(200).json({
        success: true,
        message: 'Henüz hiç ilanınız yok. Hemen bir tane ekleyin! 🚀',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Kullanıcıya ait ilanlar getirildi.',
      data: userAds,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'İlanlar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      error: error.message,
    });
  }
};

const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('user', 'name email');
    res.status(200).json({
      success: true,
      message: 'İlanlar başarıyla getirildi',
      data: ads,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'İlanlar getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin',
    });
  }
};

const getSingleAd = async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await Ad.findById(id).populate('user', 'name email');
    if (!ad) {
      return res.status(404).json({ message: 'Böyle bir ilan bulunamadı.' });
    }
    res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    res.status(500).json({
      message:
        'İlan görüntülenirken bir hata oluştu. Lütfen daha cemcemsonra tekrar deneyin',
    });
  }
};

const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!ad) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    res.status(200).json({ success: true, message: 'İlan başarıyla silindi' });
  } catch (error) {
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
  getUserAds,
  getSingleAd,
  updateAd,
};
