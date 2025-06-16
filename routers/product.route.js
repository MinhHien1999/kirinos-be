import express from 'express';
import multer from 'multer';
import * as productMiddleware from '../middlewares/product.middleware.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//product
router.get('/products', productController.getAllProduct);
router.get('/product/:product_id', productMiddleware.validateProductId, productController.getProductById)
router.get(
  '/search',
  productMiddleware.validateSearchProduct,
  productController.searchProduct,
);
router.post(
  '/product/add',
  upload.single('image'),
  productMiddleware.validateAddProduct,
  productController.addProduct,
);
router.patch(
  '/product/:product_id',
  productMiddleware.validateProductId,
  upload.none(),
  productMiddleware.validateUpdateProduct,
  productController.updateProduct,
);
router.delete(
  '/product/:product_id',
  productMiddleware.validateProductId,
  productController.deleteProduct,
);
router.post('/product/product-import/:product_id',
  productMiddleware.validateProductId,
  productController.addProductImport

)
export default router;
