import * as brandServices from '../services/brand.service.js';

export const getAllBrand = async (req, res) => {
  const brands = await brandServices.getAllBrand();
  if (!brands.success) {
    return res.status(500).json({ message: brands.message || 'Lỗi server' });
  }

  res.status(200).json(brands.data);
};

export const addBrand = async (req, res) => {
  const brandData = req.validatedBrandData;
  const result = await brandServices.add(brandData);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: result.message || 'Không thể thêm hãng mới' });
  }

  res.status(201).json({
    message: 'Hãng đã được thêm thành công!',
    data: result.data,
  });
};
export const deleteBrand = async (req, res) => {
  const { brand_id } = req.params;
  if (!brand_id) {
    return res.status(400).json({ message: 'Thiếu ID' });
  }

  const result = await brandServices.del(brand_id);
  if (!result.success) {
    return res
      .status(404)
      .json({ message: result.message || 'Không tìm thấy hãng cần xoá' });
  }

  res.status(200).json({ message: result.message });
};

export const updateBrand = async (req, res) => {
  const { brand_id } = req.params;
  const data = req.body;
  if (!brand_id) {
    return res.status(400).json({ message: 'Thiếu ID' });
  }

  const result = await brandServices.update(brand_id, data);
  if (!result.success) {
    return res
      .status(404)
      .json({ message: result.message || 'Không cập nhật được hãng' });
  }

  res.status(200).json({
    message: 'Cập nhật hãng thành công!',
  });
};
