export default (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    'Brand',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'brands',
      createdAt: true,
      updatedAt: true,
    },
  );

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, {
      foreignKey: 'brand_id',
      onDelete: 'CASCADE',
    });
  };

  return Brand;
};
