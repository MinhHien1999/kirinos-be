export default (sequelize, DataTypes) => {
  const InvoiceDetail = sequelize.define(
    'InvoiceDetail',
    {
      invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      sale_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'invoice_details',
      createdAt: false,
      updatedAt: false,
    },
  );

  InvoiceDetail.associate = (models) => {
    InvoiceDetail.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id',
      onDelete: 'CASCADE',
    });
    InvoiceDetail.belongsTo(models.Product, {
      foreignKey: 'product_id',
    });
  };

  return InvoiceDetail;
};
