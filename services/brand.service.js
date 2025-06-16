import Model from '../models/index.js';


export const getAllBrand = async () => {
  try {
    const brands = await Model.Brand.findAll();
    return { success: true, data: brands };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const add = async (brandData) => {
  try {
    const brandNew = await Model.Brand.create(brandData);
    return { success: true, data: brandNew };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const del = async (brand_id) => {
  try {
    const brand = await Model.Brand.findByPk(brand_id);
    if (!brand) {
      return { success: false, message: 'Không tìm thấy hãng' };
    }
    const productCount = await Model.Product.count({
      where: { brand_id },
    });
    if (productCount > 0) {
      return {
        success: false,
        message: 'Không thể xoá vì còn sản phẩm thuộc hãng này',
      };
    }
    await brand.destroy();
    return { success: true, message: 'Xoá thành công' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const update = async (brand_id, data) => {
  try {
    const brand = await Model.Brand.findByPk(brand_id);
    if (!brand) {
      return { success: false, message: 'Không tìm thấy hãng để cập nhật' };
    }
    await Model.Brand.update(data, {
      where: { id: brand_id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
