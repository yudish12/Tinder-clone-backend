import express from 'express';
import { body } from 'express-validator';
import { sendMatchRequest } from '../controllers/matchReqControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware)

router.post('/like',[
        body('recieverId').notEmpty()
    ],
    sendMatchRequest
)

export default router