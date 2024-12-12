const City = require('../models/City');

const getCities = async (req, res) => {
  try {
    const cities = await City.find({}).sort({ name: 1 });

    res.status(200).json(cities);
  } catch (error) {
    console.log(error);
  }
};


module.exports = { getCities };