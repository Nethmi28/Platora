import express from 'express';
import { fetchMessages, sendMessage } from '../controllers/chatController.js';
import verifyJWT from '../middleware/verifyToken.js'; 

const router = express.Router();

// Fetch messages for a specific order (no auth for demo)
router.get('/messages/:orderId', fetchMessages);

// Send a new message (no auth for demo)
router.post('/messages', sendMessage);

router.get('/messages/:orderId', verifyJWT, fetchMessages);
router.post('/messages', verifyJWT, sendMessage);

export default router;


