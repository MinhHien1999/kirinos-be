// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import productRouter from './routers/product.route.js';
import brandRouter from './routers/brand.route.js';
const app = express();
const port = 3000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  }),
);

const jsonRouter = express.Router();
jsonRouter.use(express.json());
jsonRouter.use(productRouter);
jsonRouter.use(brandRouter);
app.use('/api', jsonRouter);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
