export default (sequelize, DataTypes) => {
  const ProductImport = sequelize.define(
    'ProductImport',
    {
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
        allowNull: false,
      },
      purchase_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sale_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'product_imports',
      createdAt: true,
      updatedAt: true,
    },
  );

  ProductImport.associate = (models) => {
    ProductImport.belongsTo(models.Product, {
      as: 'products',
      foreignKey: 'product_id',
    });
  };

  return ProductImport;
};
