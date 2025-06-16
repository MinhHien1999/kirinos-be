import * as productServices from '../services/product.service.js';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

export const getAllProduct = async (req, res) => {
  const result = await productServices.getAllProduct();
  if (!result.success) {
    return res.status(500).json({ message: result.message || 'Lỗi server' });
  }

  return res.status(200).json(result.data);
};
export const getProductById = async (req, res) => {
  const product_id = req.validatedProductId;
  const result = await productServices.getProductById(product_id);
  if (!result.success) {
    return res.status(404).json({ message: result.message || 'Lỗi server' });
  }
  return res.status(200).json(result.data);
};
export const searchProduct = async (req, res) => {
  const keyword = req.validatedKeyword;
  const result = await productServices.searchProductByName(keyword);

  if (!result.success) {
    return res.status(404).json({ message: result.message || 'Lỗi server' });
  }
  return res.status(200).json(result.data);
};

export const addProduct = async (req, res) => {
  const productData = req.validatedProductData;
  const productImage = req.validatedProductImage;
  const IMGBB_API_KEY = 'f0235840829446d8409f0edbee0e4597';
  const filePath = productImage.path;
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    form,
    { headers: form.getHeaders() },
  );
  fs.unlinkSync(filePath);

  const image = response.data.data.url;
  const result = await productServices.add({ ...productData, image });
  if (!result.success) {
    return res
      .status(400)
      .json({ message: result.message || 'Không thể thêm sản phẩm' });
  }

  return res.status(201).json({
    message: 'Sản phẩm đã được thêm thành công!',
    data: result.data,
  });
};
export const deleteProduct = async (req, res) => {
  const product_id = req.validatedProductId;

  const result = await productServices.del(product_id);
  if (!result.success) {
    return res
      .status(404)
      .json({ message: result.message || 'Không tìm thấy sản phẩm' });
  }

  return res.status(200).json({ message: result.message });
};

export const updateProduct = async (req, res) => {
  const product_id = req.validatedProductId;
  const data = req.validatedProductData;
  const result = await productServices.update(product_id, data);
  if (!result.success) {
    return res
      .status(404)
      .json({ message: result.message || 'Không cập nhật được sản phẩm' });
  }

  return res.status(200).json({
    message: 'Cập nhật sản phẩm thành công!',
  });
};

export const addProductImport = async (req, res) => {
  const product_id = req.validatedProductId;
  const data = req.body;
  const result = await productServices.addProdImport({ product_id, ...data });
  if (!result.success) {
    return res.status(404).json({ message: result.message || 'Lỗi server' });
  }
  return res.status(200).json(result.data);
};
