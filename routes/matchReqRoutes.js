import express from 'express';
import { body, param } from 'express-validator';
import { acceptRequest, crossedMatchRequest, getMatchRequest, rejectRequest, sendMatchRequest } from '../controllers/matchReqControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware)

router.route('/').get(getMatchRequest)

router.route('/:reqid',param('reqid').notEmpty()).get(acceptRequest).delete(rejectRequest)

router.post('/like',[
        body('recieverId').notEmpty()
    ],
    sendMatchRequest
)

router.post('/dislike',[
        body('recieverId').notEmpty()
    ],crossedMatchRequest
)

export default router