import express from 'express'
import { sendMatchRequest,getMatches } from '../controllers/matchControllers.js';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route("/").post(
    [
        body('recieverId').notEmpty(),
    ],sendMatchRequest)
    .get(getMatches)

export default router