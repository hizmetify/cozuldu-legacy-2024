const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Favori = require('../models/favori');
const Ad = require('../models/ad');
const { default: mongoose } = require('mongoose');

const decodedId = async (req) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

const emailUpdate = async (req, res) => {
  try{
    let user = await decodedId(req);
    let { email } = req.body;
    let myUs=await User.findById(user)
    let users=await User.findOne({email}) 
   
    let response
    if(users){
      response= {
        success:false,
        message:'Mail Kullanımda'
      }}
    else{
    response = await User.findByIdAndUpdate(  user, { email } , { new: true } );
}
    if (!response) {
      return res.status(404).json({ message: 'Mail Güncellenmedi' });
    } 
    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Hata:', error);
    
  }
  
};
const nameInfoUpdate = async (req, res) => {
  try{
  let user = await decodedId(req);
  let { name, lastname } = req.body;
  let response = await User.findByIdAndUpdate(
    user,
   { name, lastname } ,
    { new: true }
  ); 
  if (!response) {
    return res.status(404).json({ message: 'Ad soyad güncellenmedi' });
  }
  return res.status(200).json({ message: 'Ad soyad güncellendi' });
} catch (error) {
  console.error('Hata:', error);
  
}

};

const deleteAccount = async (req, res) => {
  try{
  let { password } = req.body;
  let decoded = await decodedId(req);
  const user = await User.findById(decoded).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
  }
  const isMatch = await bcrypt.compare(password, user?.password);
  if (isMatch) {
    let response = await User.findByIdAndDelete(user?._id);
    if (!response)
      return res
        .status(404)
        .json({ message: 'Hesap silinemedi daha sonra tekrar deneyiniz...' });
    return res.status(200).json({ message: 'Hesap silindi.' });
  } else {
    return res.status(401).json({ message: 'Şifre doğru değil.' });
  }
} catch (error) {
  console.error('Hata:', error);
  
}

};

const favoriPostAndDelete = async (req, res) => {
  try {
    let decoded = await decodedId(req);
    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Favorilere eklemek için giriş yapmalısınız.' });
    }
    let { adId } = req.body;
    const value = {
      adId: adId,
      userId: user?._id,
    };
    const search = await Favori.find(value);
    if (search.length > 0) {
      const result = await Favori.deleteMany(value);
      return res.json({ message: 'Favorilerden Silindi.', success: true });
    } else {
      const adAds = await Ad.findOne({ _id: adId }).populate('user', '_id');
      if (adAds) {
        if (user?._id == adAds.user._id) {
          return res.json({
            message: 'Kendi ilanını favorileyemezsin.',
            success: false,
          });
        }
      }
      const result = await Favori.create(value);
      return res.json({ message: 'Favorilere Eklendi.', success: true });
    }
  } catch (error) {
    console.error('Hata:', error);
  }
};
const isFavori = async (req, res) => {
  try {
    const { adId } = req.body;
    let decoded = await decodedId(req);

    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    const ret = await Favori.find({ userId: user?._id, adId: adId });

    if (ret.length > 0) {
      return res.json({ success: 'bg-red-500' });
    }
    return res.json({ success: 'text-gray-600' });
  } catch (error) {
    console.log(error);
  }
};
const favoriGet = async (req, res) => {
  try {
    let decoded = await decodedId(req);
    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    const ret = await Favori.find({ userId: user?._id });
    if (!ret) {
      return res.send('Bir hata oluştu');
    }
    return res.send(ret);
  } catch (error) {
    console.log(error);
  }
};
const favoriCount = async (req, res) => {
  try {
    let decoded = await decodedId(req);
    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    let { adId } = req.body;
    const result = await Favori.countDocuments({ adId: adId });

    return res.json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
const isViewing = async (req, res) => {
  try {
    let { adId } = req.body;

    let decoded = await decodedId(req);
    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    const ad = await Ad.findById(adId);
    if (ad?.user?._id == user?.id || ad?.viewing?.includes(user?._id)) {
      return res.json({
        success: false,
        data: ad?.viewing?.length > 0 ? ad?.viewing.length : 0,
      });
    } else {
      await Ad.findByIdAndUpdate(
        ad?._id,
        { $addToSet: { viewing: user?._id } }, // Eğer zaten varsa ekleme
        { new: true }
      );
      return res.json({
        success: true,
        data: ad?.viewing?.length > 0 ? ad?.viewing.length : 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const contactInfo = async (req, res) => {
  try {
    let { adId } = req.body;
    let decoded = await decodedId(req);
    const user = await User.findById(decoded).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Bu işlem için üye olmanız gerekiyor.' });
    }
    const adids = await Ad.findById(adId);
    if (!adids) {
      return res.json({ message: 'Sonuç bulunamadı' });
    }
    const userids = await User.findById(adids?.user?._id);
    if (!userids) return res.json({ message: 'sonuç bulunamadı' });
 
    return res.json({
      phone: userids?.phone,
      mail: userids?.email,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = await decodedId(req);
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
module.exports = {
  emailUpdate,
  nameInfoUpdate,
  deleteAccount,
  favoriPostAndDelete,
  favoriGet,
  isFavori,
  isViewing,
  contactInfo,
  favoriCount,
  getUserDetails,
};
