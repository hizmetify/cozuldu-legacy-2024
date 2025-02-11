const adValidationSchema = require('../validations/adValidation');

const validateAd = (req, res, next) => {
  const { error } = adValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const validationErrors = error.details.map((err) => err.message);

    return res.status(400).json({
      errors: validationErrors,
    });
  }

  next();
};

module.exports = validateAd;
