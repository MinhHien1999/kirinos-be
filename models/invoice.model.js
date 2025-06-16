export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      //   customer_name: {
      //     type: DataTypes.STRING,
      //     allowNull: false,
      //   },
      invoice_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'invoices',
      createdAt: true,
    },
  );

  Invoice.associate = (models) => {
    Invoice.hasMany(models.InvoiceDetail, {
      foreignKey: 'invoice_id',
      onDelete: 'CASCADE',
    });
  };

  return Invoice;
};
