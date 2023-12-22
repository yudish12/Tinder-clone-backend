import express from 'express'
import { getMatches } from '../controllers/matchControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .get(getMatches)


export default router