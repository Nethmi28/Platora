import express from 'express';
import { checkProductionController } from '../controllers/orderController.js';
import verifyJWT from '../middleware/verifyToken.js';
import checkRole from '../middleware/requireRole.js';

const router = express.Router();

router.post('/inventoryCheck', verifyJWT, checkRole('customer'), checkProductionController);

export default router;
