import { faker } from '@faker-js/faker';

export const createMockData = async (models) => {
  // 1. Tạo brands
  const brands = await Promise.all(
    Array.from({ length: 5 }, () =>
      models.Brand.create({ name: faker.company.name() }),
    ),
  );

  // 2. Tạo products
  const products = await Promise.all(
    Array.from({ length: 10 }, () =>
      models.Product.create({
        name: faker.commerce.productName(),
        brand_id: brands[Math.floor(Math.random() * brands.length)].id,
        current_sale_price: parseFloat(
          faker.commerce.price({ min: 10, max: 100 }),
        ),
        quantity: faker.number.int({ min: 10, max: 100 }),
        status: faker.helpers.arrayElement(['AVAILABLE', 'UNAVAILABLE']),
        image: faker.image.urlLoremFlickr({ category: 'product' }),
      }),
    ),
  );
  // 3. Tạo product_imports
  for (const product of products) {
    await models.ProductImport.create({
      product_id: product.id,
      purchase_price:
        product.current_sale_price - faker.number.int({ min: 1, max: 5 }),
      sale_price: product.current_sale_price,
      purchase_quantity: faker.number.int({ min: 10, max: 50 }),
    });
  }

  // 4. Tạo invoices
  const invoices = await Promise.all(
    Array.from({ length: 5 }, () =>
      models.Invoice.create({
        invoice_date: faker.date.recent(),
        total_amount: 0,
      }),
    ),
  );

  // 5. Tạo invoice_detail
  for (const invoice of invoices) {
    const items = await Promise.all(
      Array.from({ length: 2 }, () => {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = faker.number.int({ min: 1, max: 5 });

        return models.InvoiceDetail.create({
          invoice_id: invoice.id,
          product_id: product.id,
          product_name: product.name,
          quantity,
          sale_price: product.current_sale_price,
          total_price: quantity * product.current_sale_price
        });
      }),
    );

    // Tính lại tổng
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.sale_price,
      0,
    );
    invoice.total_amount = total;
    await invoice.save();
  }

  console.log('✅ Dữ liệu giả đã được tạo bằng faker!');
};
