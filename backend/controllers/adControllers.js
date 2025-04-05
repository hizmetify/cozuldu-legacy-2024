const mongoose = require('mongoose');
const Ad = require('../models/ad');
const Category = require('../models/category');
const fs = require('fs');
const path=require('path')
const BASE_URL = 'http://localhost:5000';


const normalizeImagePath = (originalPath) => {
  if (!originalPath) return '';

  let normalized = originalPath.toLowerCase();
  normalized = normalized.replace(/\\/g, '/');
  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://')
  ) {
    try {
      const url = new URL(normalized);
      normalized = url.pathname;
    } catch (err) {}
  }

  const index = normalized.indexOf('uploads/');
  if (index !== -1) {
    normalized = normalized.substring(index);
  }
  normalized = normalized.replace(/^\/+/, '');
  
  return normalized;
};
const formatImagePath = (imgPath) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  const cleanedPath = imgPath
    .replace(/^.*[\\/](uploads[\\/])/, '/uploads/')
    .replace(/\\/g, '/');
  return `${BASE_URL}${cleanedPath}`;
};

const createAd = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        message: 'Kullanıcı girişi gerekli. createAd başarısız.',
      });
    }
    const {
      title,
      description,
      serviceType,
      category,
      subCategory,
      city,
      price,
      priceType,
      status,
    } = req.body;

    const images = req.files ? req.files.map((file) => file.path) : [];

    const ad = new Ad({
      user: userId,
      title,
      description,
      serviceType,
      category,
      subCategory,
      city,
      price,
      priceType,
      images,
      status,
    });

    await ad.save();

    return res.status(201).json({
      message: 'İlan başarıyla oluşturuldu',
      data: {
        ...ad._doc,
      },
    });
  } catch (error) {
    console.error('createAd error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. createAd başarısız.',
      error: error.message,
    });
  }
};

module.exports = { createAd };

const updateAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return res.status(400).json({ message: 'Geçersiz ilan ID' });
    }

    const { title, description, category, subCategory, price, status } =
      req.body;
    const imagesToDelete = req.body.imagesToDelete || [];
    const newImages = req.files ? req.files.map((file) => file.path) : [];

    const existingAd = await Ad.findById(adId);
    if (!existingAd) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    if (existingAd.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Bu ilanı güncelleme yetkiniz yok' });
    }

    
    console.log('DB resimleri:');
    existingAd.images.forEach((img) => {
      console.log('  ', img, '=>', normalizeImagePath(img));
    });
    console.log('Silinecek resimler:');
    imagesToDelete.forEach((img) => {
      console.log('  ', img, '=>', normalizeImagePath(img)); 
      const pathDeleteImage= normalizeImagePath(img)
      const imagePath = path.join(pathDeleteImage); // imageUrl, uploads/altındaki dosya yolu olmalı
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          return console.log('File not found.');
        }
    
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Resim silinirken bir hata oluştu:", err);
            return 
          } 
        });
      });
    });
    let updatedImages = existingAd.images.filter((image) => {
      const normalizedImage = normalizeImagePath(image);
      return !imagesToDelete.some((del) => {
        const normalizedDel = normalizeImagePath(del);
        return normalizedImage === normalizedDel;
      });
    });
    updatedImages = [...updatedImages, ...newImages];
    console.log('Güncellenecek resim listesi:', updatedImages);

    existingAd.title = title || existingAd.title;
    existingAd.description = description || existingAd.description;
    existingAd.category = category || existingAd.category;
    existingAd.subCategory = subCategory || existingAd.subCategory;
    existingAd.price = price || existingAd.price;
    existingAd.images = updatedImages;
    existingAd.status = status || existingAd.status;

    await existingAd.save();

    return res.status(200).json({
      message: 'İlan başarıyla güncellendi',
      data: {
        ...existingAd._doc,
        images: existingAd.images.map(formatImagePath),
      },
    });
  } catch (error) {
    console.error('updateAd error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. updateAd başarısız.',
      error: error.message,
    });
  }
};

const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find
      .populate('user', 'name avatar')
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('city', 'name')
      .sort({ createdAt: -1 });

    const formattedAds = ads.map((ad) => ({
      ...ad._doc,
      images: ad.images.map(formatImagePath),
    }));

    return res.status(200).json({
      message: 'Tüm aktif ilanlar başarıyla getirildi',
      data: formattedAds,
    });
  } catch (error) {
    console.error('getAllAds error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. getAllAds başarısız.',
      error: error.message,
    });
  }
};

const getUserAds = async (req, res) => {
  try {
    const user= req.user._id; 
    const objectId = mongoose.Types.ObjectId.isValid(user) ? new mongoose.Types.ObjectId(user) : null;
    if (!user || !objectId) {
      return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
    } 
    
    const ads = await Ad.find({ user:objectId })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 }); 
    const formattedAds = ads.map((ad) => ({
      ...ad._doc,
      images: ad.images.map(formatImagePath),
    })); 
    return res.status(200).json({
      message: 'Kullanıcının ilanları başarıyla getirildi',
      data: formattedAds,
    });
  } catch (error) {
    console.error('getUserAds error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. getUserAds başarısız.',
      error: error.message,
    });
  }
};

const getSingleAd = async (req, res) => {
  try {
    const adId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return res.status(400).json({ message: 'Geçersiz ilan ID' });
    }

    const ad = await Ad.findById(adId)
      .populate('user', 'name avatar')
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('city', 'name');

    if (!ad) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    return res.status(200).json({
      message: 'İlan detayı başarıyla getirildi',
      data: {
        ...ad._doc,
        images: ad.images.map(formatImagePath),
      },
    });
  } catch (error) {
    console.error('getSingleAd error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. getSingleAd başarısız.',
      error: error.message,
    });
  }
};
const deleteAd = async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return res.status(400).json({ message: 'Geçersiz ilan ID' });
    }

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    if (ad.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu ilanı silmeye yetkiniz yok' });
    }
    const imagesToDelete=ad?.images
    imagesToDelete.forEach((img) => { 
      const pathDeleteImage= normalizeImagePath(img)
      const imagePath = path.join(pathDeleteImage); // imageUrl, uploads/altındaki dosya yolu olmalı
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          return console.log('File not found.');
        }
    
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Resim silinirken bir hata oluştu:", err);
            return 
          } 
        });
      });
    });
    await Ad.findByIdAndDelete(adId);
    
    return res.status(200).json({
      message: 'İlan başarıyla silindi',
    });
  } catch (error) {
    console.error('deleteAd error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. deleteAd başarısız.',
      error: error.message,
    });
  }
};
const makeAdStatusChange = async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return res.status(400).json({ message: 'Geçersiz ilan ID' });
    }
    const { status } = req.body;
    const existingAd = await Ad.findById(adId);
    if (!existingAd) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    if (existingAd.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Bu ilanı güncelleme yetkiniz yok' });
    }
    existingAd.status = status;

    await existingAd.save();

    return res.status(200).json({
      message: 'İlan başarıyla güncellendi',
      data: existingAd,
    });
  } catch (error) {
    console.error('updateAd error:', error);
    return res.status(500).json({
      message: 'Sunucu hatası. updateAd başarısız.',
      error: error.message,
    });
  }
};

const getAdsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      search = '',
      priceMin,
      priceMax,
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Geçersiz kategori ID' });
    }

    const query = {
      $or: [{ category: categoryId }, { subCategory: categoryId }],
      status: 'active',
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortDirection = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sort] = sortDirection;

    const ads = await Ad.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name avatar')
      .populate('category', 'name')
      .populate('subCategory', 'name');

    const formattedAds = ads.map((ad) => ({
      ...ad._doc,
      images: ad.images.map(formatImagePath),
    }));

    const total = await Ad.countDocuments(query);

    const category = await Category.findById(categoryId);
    const categoryName = category ? category.name : 'Kategori';

    res.status(200).json({
      success: true,
      message: 'Kategori ilanları başarıyla getirildi',
      data: formattedAds,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      categoryName,
    });
  } catch (error) {
    console.error('Kategori ilanlarını alırken hata oluştu:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message,
    });
  }
};

module.exports = {
  createAd,
  updateAd,
  getAllAds,
  getUserAds,
  getSingleAd,
  deleteAd,
  getAdsByCategory,
  makeAdStatusChange,
};
