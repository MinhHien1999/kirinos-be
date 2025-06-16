import { validateImage, resizeImage } from '../utils/image-utils.js';

const regex = /^[a-zA-Z0-9\s\-]+$/;

export const validateProductId = (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id || isNaN(product_id) || parseInt(product_id) <= 0) {
    return res.status(400).json({
      message: 'ID sản phẩm không hợp lệ',
    });
  }

  req.validatedProductId = parseInt(product_id);
  next();
};

export const validateAddProduct = async (req, res, next) => {
  const errors = {};
  const productImage = req.file;
  const { name, brand_id, purchase_price, sale_price, quantity, status } =
    req.body;
  const requiredFields = {
    name,
    brand_id,
    purchase_price,
    sale_price,
    quantity,
    status,
  };
  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) =>
        value === undefined || value === null || value.trim() === '',
    )
    .map(([key]) => key);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Thiếu thông tin: ${missingFields.join(', ')}`,
    });
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    errors['name'] = 'Tên sản phẩm phải là chuỗi không được rỗng';
  }

  if (!regex.test(name.trim())) {
    errors['name'] = 'Tên hợp lệ chỉ chứ số, chữ cái và dấu gạch ngang';
  }

  if (!Number.isInteger(Number(brand_id))) {
    errors['brand_id'] = 'brand_id phải là số nguyên';
  }

  if (isNaN(sale_price) || sale_price <= 0) {
    errors['sale_price'] = 'Chỉ được nhập số, giá bán phải là số lớn hơn 0';
  }

  if (isNaN(purchase_price) || purchase_price <= 0) {
    errors['purchase_price'] =
      'Chỉ được nhập số, giá nhập phải là số lớn hơn 0';
  }

  if (
    Number.isInteger(Number(purchase_price)) >
    Number.isInteger(Number(sale_price))
  )
    errors['sale_price'] = 'giá bán phải lớn hơn giá nhập';

  if (!Number.isInteger(Number(quantity)) || quantity < 0) {
    errors['quantity'] = 'Số lượng phải là số nguyên >= 0';
  }

  const validStatuses = ['AVAILABLE', 'UNAVAILABLE'];
  if (!validStatuses.includes(status)) {
    errors['status'] = `Trạng thái phải là ${validStatuses.join(' hoặc ')}`;
  }

  const validatedImage = await validateImage(productImage);
  if (!validatedImage.success) {
    errors['image'] = validatedImage.message;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors, message: 'Sai thông tin' });
  }

  const resizedImage = await resizeImage(
    productImage.path,
    productImage.filename,
  );
  if (!resizedImage.success) {
    errors['image'] = resizedImage.message;
    return res.status(400).json({ errors, message: 'Lỗi resize ảnh' });
  }

  req.validatedProductData = requiredFields;
  req.validatedProductImage = resizedImage.data;
  next();
};

export const validateUpdateProduct = (req, res, next) => {
  const data = req.body;
  const allowedFields = [
    'name',
    'brand_id',
    'image',
    'purchase_price',
    'sale_price',
    'quantity',
    'status',
  ];
  const keys = Object.keys(data);
  // Không có field nào
  if (keys.length === 0) {
    return res.status(400).json({ message: 'Không có dữ liệu để cập nhật' });
  }
  // Các field không hợp lệ
  const invalidFields = keys.filter((key) => !allowedFields.includes(key));
  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: `Trường không hợp lệ: ${invalidFields.join(', ')}`,
    });
  }

  const { name, brand_id, image, sale_price, quantity, status } = data;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res
        .status(400)
        .json({ message: 'Tên sản phẩm phải là chuỗi không được rỗng' });
    }
    if (!regex.test(name.trim())) {
      return res
        .status(400)
        .json({ message: 'Tên hợp lệ chỉ chứ số, chữ cái và dấu gạch ngang' });
    }
  }

  if (brand_id !== undefined && !Number.isInteger(Number(brand_id))) {
    return res.status(400).json({ message: 'Id hãng không hợp lệ' });
  }

  if (image !== undefined && typeof image !== 'string') {
    return res.status(400).json({ message: 'image không hợp lệ' });
  }

  if (sale_price !== undefined && (isNaN(sale_price) || sale_price <= 0)) {
    return res.status(400).json({ message: 'Giá bán phải là số > 0' });
  }

  if (
    quantity !== undefined &&
    (!Number.isInteger(Number(quantity)) || quantity < 0)
  ) {
    return res.status(400).json({ message: 'Số lượng phải là số nguyên >= 0' });
  }
  const validStatuses = ['AVAILABLE', 'UNAVAILABLE'];
  if (status !== undefined && !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: `Trạng thái phải là ${validStatuses.join(' hoặc ')}` });
  }
  req.validatedProductData = data;
  next();
};

export const validateSearchProduct = (req, res, next) => {
  const keyword = req.query.keyword;

  if (!regex.test(keyword)) {
    return res.status(400).json({
      message: 'Từ khóa không hợp lệ',
    });
  }

  if (!keyword) {
    return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
  }
  req.validatedKeyword = keyword;
  next();
};
