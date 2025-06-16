import Model from '../models/index.js';
import { Op } from 'sequelize';

export const getAllProduct = async () => {
  try {
    const products = await Model.Product.findAll({
      include: [
        {
          model: Model.Brand,
          as: 'brand',
        },
        {
          model: Model.ProductImport,
          as: 'product_import',
          separate: true,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
    });
    return { success: true, data: products };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getProductById = async (product_id) => {
  try {
    const product = await Model.Product.findByPk(product_id);
    if (!product) return { success: false, message: 'Không tìm thấy sản phẩm' };
    return { success: true, data: product };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const searchProductByName = async (keyword) => {
  const likePattern = `${keyword.trim().split(/\s+/).join('%')}`;

  try {
    const products = await Model.Product.findAll({
      where: {
        name: {
          [Op.like]: `%${likePattern}%`,
        },
      },
    });
    return { success: true, data: products };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const add = async (prod) => {
  const {
    name,
    image,
    brand_id,
    quantity,
    purchase_price,
    current_sale_price,
    status,
  } = prod;
  const prodData = {
    name,
    image,
    brand_id,
    quantity,
    current_sale_price: current_sale_price,
    status,
  };
  try {
    const prodNew = await Model.Product.create(prodData);
    const prodImportData = {
      product_id: prodNew.id,
      purchase_price,
      sale_price,
      purchase_quantity: quantity,
    };
    await Model.ProductImport.create(prodImportData);
    return { success: true, data: prodNew };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const del = async (product_id) => {
  try {
    const prod = await Model.Product.findByPk(product_id);
    if (!prod) {
      return { success: false, message: 'Không tìm thấy sản phẩm' };
    }
    await prod.destroy();
    return { success: true, message: 'Xoá thành công' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const update = async (product_id, data) => {
  const fixedProductData = {};
  const fixedProductImportData = {};
  try {
    const prod = await Model.Product.findByPk(product_id);
    const prodImportId = prod.product_import[0].id;
    const ProdImport = await Model.ProductImport.findByPk(prodImportId);
    if (data.name) fixedProductData.name = data.name;
    if (data.brand_id) fixedProductData.brand_id = data.brand_id;
    if (data.quantity) {
      if (Number(data.quantity) > Number(prod.quantity)) {
        fixedProductData.quantity = Number(data.quantity);
        fixedProductImportData.purchase_quantity =
          Number(ProdImport.purchase_quantity) +
          (Number(data.quantity) - Number(prod.quantity));
      } else if (Number(data.quantity) < Number(prod.quantity)) {
        fixedProductData.quantity = Number(data.quantity);
        fixedProductImportData.purchase_quantity =
          Number(ProdImport.purchase_quantity) -
          (Number(prod.quantity) - Number(data.quantity));
      }
    }
    if (data.purchase_price) {
      fixedProductImportData.purchase_price = Number(data.purchase_price);
    }
    if (data.sale_price) {
      fixedProductData.current_sale_price = Number(data.sale_price);
      fixedProductImportData.sale_price = Number(data.sale_price);
    }
    if (data.status) fixedProductData.status = data.status;
    await prod.update(fixedProductData, {
      where: { id: product_id },
    });
    await ProdImport.update(fixedProductImportData);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addProdImport = async (prodImportData) => {
  const prodUpdateData = {};
  try {
    const prod = await Model.Product.findByPk(prodImportData.product_id);
    const productImport = await Model.ProductImport.create(prodImportData);

    prodUpdateData.current_sale_price = Number(prodImportData.sale_price);
    prodUpdateData.quantity = Number(prod.quantity) + Number(prodImportData.purchase_quantity);
    await prod.update(prodUpdateData);
    return { success: true, data: productImport };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
