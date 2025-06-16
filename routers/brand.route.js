import express from 'express';
import * as brandMiddleware from '../middlewares/brand.middleware.js';
import * as brandController from '../controllers/brand.controller.js';

const router = express.Router();

//brand
router.get('/brands', brandController.getAllBrand);
router.post(
  '/brand/add',
  brandMiddleware.validateBrand,
  brandController.addBrand,
);
router.patch('/brand/:brand_id', brandController.updateBrand);
router.delete('/brand/:brand_id', brandController.deleteBrand);

export default router