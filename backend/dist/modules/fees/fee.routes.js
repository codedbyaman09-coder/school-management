"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fee_controller_1 = require("./fee.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Fee Structures
router.get('/structures', fee_controller_1.getFeeStructures);
router.post('/structures', fee_controller_1.createFeeStructure);
// Invoices
router.get('/invoices', fee_controller_1.getInvoices);
router.post('/invoices', fee_controller_1.createInvoice);
// Payments
router.post('/payments', fee_controller_1.collectPayment);
router.get('/payments', fee_controller_1.getPayments);
// Dues
router.get('/dues', fee_controller_1.getFeeDues);
exports.default = router;
//# sourceMappingURL=fee.routes.js.map