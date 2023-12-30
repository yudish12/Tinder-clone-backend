import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getMessages,sendMessage,editMessage,deleteMessage } from '../controllers/messageControllers.js';
import { body, query } from 'express-validator';

const router = express.Router();

router.use(authMiddleware)

router.route('/').
    get(query('matchId').notEmpty,getMessages).
    post([
        body('message').notEmpty(),
        body('recieverId').notEmpty(),
        body('matchId').notEmpty()
    ],sendMessage).
    patch(editMessage).
    delete(query('messageId').notEmpty,deleteMessage)

export default router;