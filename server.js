// server.js
import express from "express";
import connection from "./db.js";
import cors from "cors";

const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.get("/api/products", async (req, res) => {
  try {
    const [result, fields] = await connection.query("SELECT * FROM product");
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi truy vấn:", err);
    res.status(500).send("Lỗi server");
  }
});
app.get("/api/search", async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
  }
  const likePattern = `%${keyword.trim().split(/\s+/).join('%')}%`;

  try {
    const [result, fields] = await connection.query(
      "SELECT * FROM product WHERE name LIKE ?",
      [likePattern]
    );
    res.json(result); // result sẽ là mảng
  } catch (err) {
    console.error("❌ Lỗi truy vấn:", err);
    res.status(500).send("Lỗi server");
  }
});
app.post('/api/product/add', async (req, res) => {
  console.log(req.body)
  const { name, quantity, purchase_price, sale_price, status } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !quantity || !purchase_price || !sale_price || !status) {
    return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
  }

  const query = `
    INSERT INTO product (name, quantity, purchase_price, sale_price, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(query, [
      name,
      quantity,
      purchase_price,
      sale_price,
      status,
    ]);
    res.status(201).json({
      message: 'Sản phẩm đã được thêm thành công!',
      productId: result.insertId, 
    });
  } catch (err) {
    console.error('❌ Lỗi truy vấn:', err);
    res.status(500).send('Lỗi server');
  }
});
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
