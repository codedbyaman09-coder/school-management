import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// ===== FEE STRUCTURES =====
export const getFeeStructures = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).schoolId;
    const feeStructures = await prisma.feeStructure.findMany({
      where: { schoolId },
      include: { class: { select: { name: true } } },
      orderBy: { feeType: 'asc' },
    });
    res.json(feeStructures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fee structures' });
  }
};

export const createFeeStructure = async (req: Request, res: Response) => {
  const { classId, academicYearId, feeType, amount, dueFrequency } = req.body;
  const schoolId = (req as any).schoolId;
  try {
    let ayId = academicYearId;
    if (!ayId) {
      const currentAY = await (prisma as any).academicYear.findFirst({
        where: { schoolId, isCurrent: true }
      });
      ayId = currentAY?.id;
    }

    if (!ayId) return res.status(400).json({ error: 'Current academic year not found' });

    const fee = await prisma.feeStructure.create({
      data: { schoolId, classId, academicYearId: ayId, feeType, amount: parseFloat(amount), dueFrequency },
    });
    res.status(201).json(fee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create fee structure' });
  }
};

// ===== INVOICES =====
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { studentId, status } = req.query;
    let where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        student: { include: { user: { select: { fullName: true } } } },
        items: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    });
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  const { studentId, academicYearId, dueDate, items } = req.body;
  // items: [{ feeType, amount, discount, fine }]
  try {
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + parseFloat(item.amount) - parseFloat(item.discount || 0) + parseFloat(item.fine || 0);
    }, 0);

    // Generate invoice number
    const count = await prisma.invoice.count();
    const invoiceNo = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        studentId,
        academicYearId: academicYearId || '2026-27',
        invoiceNo,
        dueDate: new Date(dueDate),
        totalAmount,
        items: {
          create: items.map((item: any) => ({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

// ===== PAYMENTS =====
export const collectPayment = async (req: Request, res: Response) => {
  const { invoiceId, paidAmount, paymentMethod, transactionRef } = req.body;
  const receivedById = (req as any).userId;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.paidAmount, 0) + parseFloat(paidAmount);

    const payment = await prisma.$transaction(async (tx) => {
      const pay = await (tx as any).payment.create({
        data: {
          invoiceId,
          paidAmount: parseFloat(paidAmount),
          paymentMethod,
          transactionRef,
          receivedById,
        },
      });

      // Update invoice status
      let status: 'PAID' | 'PARTIAL' | 'UNPAID' = 'PARTIAL';
      if (totalPaid >= invoice.totalAmount) status = 'PAID';
      else if (totalPaid <= 0) status = 'UNPAID';

      await (tx as any).invoice.update({
        where: { id: invoiceId },
        data: { status },
      });

      return pay;
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to collect payment' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.query;
    let where: any = {};
    if (invoiceId) where.invoiceId = invoiceId;

    const payments = await prisma.payment.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getFeeDues = async (req: Request, res: Response) => {
  try {
    const dues = await prisma.invoice.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch fee dues' });
  }
};
