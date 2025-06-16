export const validateBrand = (req, res, next) => {
  const { name } = req.body;
  const requiredFields = { name };
  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) => value === undefined || value === null || value === '',
    )
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Thiếu thông tin: ${missingFields.join(', ')}`,
    });
  }

  if (typeof name !== 'string') {
    return res.status(400).json({ message: 'Tên sản phẩm phải là chuỗi' });
  }

  // gửi data đã được validate qua cho controller
  req.validatedBrandData = requiredFields;
  next();
};

