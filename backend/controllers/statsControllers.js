const User = require('../models/user');
const SubCategory = require('../models/subCategory');
const City = require('../models/city');

const getStats = async (req, res) => {
  try {
    const models = [User, SubCategory, City];

    const result = {};
    for (const model of models) {
      const count = await model.countDocuments();
      result[model.modelName] = count;
    }
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getStats,
};
