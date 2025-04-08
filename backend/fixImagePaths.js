const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ad = require('./models/ad');
const path = require('path');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const BASE_URL = process.env.BASE_URL;

const fixImagePaths = async () => {
  try {
    const ads = await Ad.find();

    for (let ad of ads) {
      if (ad.images && ad.images.length > 0) {
        ad.images = ad.images.map((imgPath) => {
          if (imgPath.startsWith('http')) return imgPath;

          let cleanedPath = imgPath
            .replace(/^.*uploads[\\/]/, '/uploads/')
            .replace(/\\/g, '/');

          return `${BASE_URL}${cleanedPath}`;
        });
      }

      await ad.save();
    }

    mongoose.connection.close();
  } catch (error) {
    mongoose.connection.close();
  }
};

fixImagePaths();
