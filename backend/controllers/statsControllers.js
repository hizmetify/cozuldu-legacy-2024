const User = require('../models/user');
const SubCategory = require('../models/subCategory');
const City = require('../models/city');
const { errorMessages } = require('../middlewares/errorMessageMiddleware');

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
    return res.json({ message: errorMessages.SERVER_ERROR});
  }
};

module.exports = {
  getStats,
};
