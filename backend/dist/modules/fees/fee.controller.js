"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeeDues = exports.getPayments = exports.collectPayment = exports.createInvoice = exports.getInvoices = exports.createFeeStructure = exports.getFeeStructures = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// ===== FEE STRUCTURES =====
const getFeeStructures = async (req, res) => {
    try {
        const schoolId = req.schoolId;
        const feeStructures = await prisma_1.default.feeStructure.findMany({
            where: { schoolId },
            include: { class: { select: { name: true } } },
            orderBy: { feeType: 'asc' },
        });
        res.json(feeStructures);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch fee structures' });
    }
};
exports.getFeeStructures = getFeeStructures;
const createFeeStructure = async (req, res) => {
    const { classId, academicYearId, feeType, amount, dueFrequency } = req.body;
    const schoolId = req.schoolId;
    try {
        let ayId = academicYearId;
        if (!ayId) {
            const currentAY = await prisma_1.default.academicYear.findFirst({
                where: { schoolId, isCurrent: true }
            });
            ayId = currentAY?.id;
        }
        if (!ayId)
            return res.status(400).json({ error: 'Current academic year not found' });
        const fee = await prisma_1.default.feeStructure.create({
            data: { schoolId, classId, academicYearId: ayId, feeType, amount: parseFloat(amount), dueFrequency },
        });
        res.status(201).json(fee);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create fee structure' });
    }
};
exports.createFeeStructure = createFeeStructure;
// ===== INVOICES =====
const getInvoices = async (req, res) => {
    try {
        const { studentId, status } = req.query;
        let where = {};
        if (studentId)
            where.studentId = studentId;
        if (status)
            where.status = status;
        const invoices = await prisma_1.default.invoice.findMany({
            where,
            include: {
                student: { include: { user: { select: { fullName: true } } } },
                items: true,
                payments: true,
            },
            orderBy: { issueDate: 'desc' },
        });
        res.json(invoices);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};
exports.getInvoices = getInvoices;
const createInvoice = async (req, res) => {
    const { studentId, academicYearId, dueDate, items } = req.body;
    // items: [{ feeType, amount, discount, fine }]
    try {
        const totalAmount = items.reduce((sum, item) => {
            return sum + parseFloat(item.amount) - parseFloat(item.discount || 0) + parseFloat(item.fine || 0);
        }, 0);
        // Generate invoice number
        const count = await prisma_1.default.invoice.count();
        const invoiceNo = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const invoice = await prisma_1.default.invoice.create({
            data: {
                studentId,
                academicYearId: academicYearId || '2026-27',
                invoiceNo,
                dueDate: new Date(dueDate),
                totalAmount,
                items: {
                    create: items.map((item) => ({
                        feeType: item.feeType,
                        amount: parseFloat(item.amount),
                        discount: parseFloat(item.discount || 0),
                        fine: parseFloat(item.fine || 0),
                    })),
                },
            },
            include: { items: true },
        });
        res.status(201).json(invoice);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
};
exports.createInvoice = createInvoice;
// ===== PAYMENTS =====
const collectPayment = async (req, res) => {
    const { invoiceId, paidAmount, paymentMethod, transactionRef } = req.body;
    const receivedById = req.userId;
    try {
        const invoice = await prisma_1.default.invoice.findUnique({
            where: { id: invoiceId },
            include: { payments: true },
        });
        if (!invoice)
            return res.status(404).json({ error: 'Invoice not found' });
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.paidAmount, 0) + parseFloat(paidAmount);
        const payment = await prisma_1.default.$transaction(async (tx) => {
            const pay = await tx.payment.create({
                data: {
                    invoiceId,
                    paidAmount: parseFloat(paidAmount),
                    paymentMethod,
                    transactionRef,
                    receivedById,
                },
            });
            // Update invoice status
            let status = 'PARTIAL';
            if (totalPaid >= invoice.totalAmount)
                status = 'PAID';
            else if (totalPaid <= 0)
                status = 'UNPAID';
            await tx.invoice.update({
                where: { id: invoiceId },
                data: { status },
            });
            return pay;
        });
        res.status(201).json(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to collect payment' });
    }
};
exports.collectPayment = collectPayment;
const getPayments = async (req, res) => {
    try {
        const { invoiceId } = req.query;
        let where = {};
        if (invoiceId)
            where.invoiceId = invoiceId;
        const payments = await prisma_1.default.payment.findMany({
            where,
            include: {
                invoice: {
                    include: { student: { include: { user: { select: { fullName: true } } } } },
                },
                receivedBy: { select: { fullName: true } },
            },
            orderBy: { paymentDate: 'desc' },
        });
        res.json(payments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};
exports.getPayments = getPayments;
const getFeeDues = async (req, res) => {
    try {
        const dues = await prisma_1.default.invoice.findMany({
            where: { status: { in: ['UNPAID', 'PARTIAL', 'OVERDUE'] } },
            include: {
                student: { include: { user: { select: { fullName: true } } } },
                payments: true,
            },
            orderBy: { dueDate: 'asc' },
        });
        const result = dues.map((inv) => {
            const paid = inv.payments.reduce((sum, p) => sum + p.paidAmount, 0);
            return {
                ...inv,
                paidAmount: paid,
                balanceAmount: inv.totalAmount - paid,
            };
        });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch fee dues' });
    }
};
exports.getFeeDues = getFeeDues;
//# sourceMappingURL=fee.controller.js.map