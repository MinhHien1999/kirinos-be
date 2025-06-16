export default (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      current_sale_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
        defaultValue: 'AVAILABLE',
      },
    },
    {
      tableName: 'products',
      createdAt: true,
      updatedAt: true,
    },
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      as: 'brand',
      foreignKey: 'brand_id',
      onDelete: 'CASCADE',
    });

    Product.hasMany(models.InvoiceDetail, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
    });

    Product.hasMany(models.ProductImport, {
      as: 'product_import',
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
    });

    Product.addScope(
      'defaultScope',
      {
        include: [
          {
            model: models.ProductImport,
            as: 'product_import', // phải khớp với alias đã đặt
            separate: true,
            limit: 1,
            order: [['createdAt', 'DESC']],
          },
        ],
      },
      { override: true },
    );
  };

  return Product;
};
