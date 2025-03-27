const adValidationSchema = require('../validations/adValidation');

const validateAd = (req, res, next) => {
  if (req.body && typeof req.body.imagesToDelete === 'string') {
    try {
      req.body.imagesToDelete = JSON.parse(req.body.imagesToDelete);
    } catch (error) {
      console.error('imagesToDelete parse error:', error);
      req.body.imagesToDelete = [];
    }
  }

  const { error, value } = adValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      message: 'Validation hatası',
      errors: error.details.map((detail) => detail.message),
    });
  }
  req.body = value;
  next();
};

module.exports = validateAd;
