import express from 'express'
import { getMatches,getMatched, unmatch } from '../controllers/matchControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { param } from 'express-validator';

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .get(getMatches)

router.get('/matched',getMatched)
router.delete('/unmatch',param('matchId').notEmpty(),unmatch)


export default router