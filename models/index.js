import sequelize from '../db/db.js';
import { DataTypes } from 'sequelize';
import BrandModel from './brand.model.js';
import ProductModel from './product.model.js';
import ProductImportModel from './product-import.model.js';
import InvoiceModel from './invoice.model.js';
import InvoiceDetailModel from './invoice-detail.model.js';

const models = {
  Brand: BrandModel(sequelize, DataTypes),
  Product: ProductModel(sequelize, DataTypes),
  ProductImport: ProductImportModel(sequelize, DataTypes),
  Invoice: InvoiceModel(sequelize, DataTypes),
  InvoiceDetail: InvoiceDetailModel(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize };
export default models;