const Ad = require('../models/ad');

const BASE_URL = 'http://localhost:5000';

const formatImagePath = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;

  let cleanedPath = imgPath
    .replace(/^.*[\\/](uploads[\\/])/, '/uploads/')
    .replace(/\\/g, '/');

  return `${BASE_URL}${cleanedPath}`;
};

const createAd = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) =>
      formatImagePath(`/uploads/${file.filename}`)
    );

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

const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate('user', 'name email')
      .populate('category', 'name')
      .populate('subCategory', 'name');

    const updatedAds = ads.map((ad) => ({
      ...ad._doc,
      images: ad.images.map(formatImagePath),
    }));

    res.status(200).json({
      success: true,
      message: 'İlanlar başarıyla getirildi',
      data: updatedAds,
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlanlar getirilirken bir hata oluştu. Lütfen tekrar deneyin',
    });
  }
};

const getUserAds = async (req, res) => {
  try {
    const userAds = await Ad.find({ user: req.user.id })
      .populate('category', 'name')
      .populate('subCategory', 'name');

    if (!userAds.length) {
      return res.status(200).json({
        success: true,
        message: 'Henüz hiç ilanınız yok.',
        data: [],
      });
    }

    const updatedAds = userAds.map((ad) => ({
      ...ad._doc,
      images: ad.images.map(formatImagePath),
    }));

    res.status(200).json({
      success: true,
      message: 'Kullanıcıya ait ilanlar getirildi.',
      data: updatedAds,
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlanlar getirilirken bir hata oluştu. Lütfen tekrar deneyin.',
      error: error.message,
    });
  }
};

const updateAd = async (req, res) => {
  const { id } = req.params;
  try {
    const imagePaths = req.files
      ? req.files.map((file) => formatImagePath(`/uploads/${file.filename}`))
      : [];

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


const getSingleAd = async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await Ad.findById(id)
      .populate('user', 'name email')
      .populate('category', 'name')  
      .populate('subCategory', 'name');  

    if (!ad) {
      return res.status(404).json({ message: 'Böyle bir ilan bulunamadı.' });
    }

    ad.images = ad.images.map(formatImagePath);

    console.log('Populated Ad:', {
      ...ad.toObject(),
      category: ad.category,
      subCategory: ad.subCategory
    });

    res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    console.error('Error fetching ad:', error);
    res.status(500).json({
      message:
        'İlan görüntülenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin',
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

const getAdsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const ads = await Ad.find({ category: categoryId }).populate(
      'user',
      'name email'
    );

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.status(200).json({ ads, categoryName: category.name });
  } catch (error) {
    console.error('Kategoriye ait ilanları getirirken hata oluştu:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  createAd,
  deleteAd,
  getAllAds,
  getUserAds,
  getSingleAd,
  updateAd,
  getAdsByCategory,
};
