import { Sequelize } from 'sequelize';
import models from '../models/index.js';
import { createMockData } from '../seeders/initData.js';

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true }); // Xóa và tạo lại bảng

    // await createMockData(models); // ✅ Tạo dữ liệu mẫu
    console.log('Kết nối database thành công');
  } catch (error) {
    console.error('Không thể kết nối database: ', error);
  }
})();

export default sequelize;
