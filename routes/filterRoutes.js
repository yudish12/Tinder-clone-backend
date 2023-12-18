import express from 'express';
import { body } from 'express-validator';
import { applyFilter } from '../controllers/filterControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.patch('/apply',[body('filters').notEmpty()],authMiddleware,applyFilter)

export default router