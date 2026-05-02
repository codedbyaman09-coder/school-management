import { Router } from 'express';
import { getFeeStructures, createFeeStructure, getInvoices, createInvoice, collectPayment, getPayments, getFeeDues } from './fee.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Fee Structures
router.get('/structures', getFeeStructures);
router.post('/structures', createFeeStructure);

// Invoices
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);

// Payments
router.post('/payments', collectPayment);
router.get('/payments', getPayments);

// Dues
router.get('/dues', getFeeDues);

export default router;
