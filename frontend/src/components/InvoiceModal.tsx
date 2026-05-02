"use client";

import React from "react";
import { X, Download, Printer, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceModalProps {
  invoice: any;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  if (!invoice) return null;

  const paidAmount = invoice.payments?.reduce((sum: number, p: any) => sum + p.paidAmount, 0) || 0;
  const balanceDue = invoice.totalAmount - paidAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Non Printable */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 print:hidden">
          <h3 className="font-bold text-slate-800">Invoice Details</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              Download / Print
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content - Printable */}
        <div id="invoice-content" className="flex-1 overflow-y-auto p-12 bg-white print:p-0">
          <div className="max-w-2xl mx-auto space-y-12">
            {/* Logo & Info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <GraduationCap className="text-white w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">EDUMASTER</h2>
                  <p className="text-xs font-bold text-blue-600 tracking-widest uppercase">School Management</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <h1 className="text-4xl font-black text-slate-900/10 tracking-tighter">INVOICE</h1>
                <p className="text-sm font-mono font-bold text-slate-800">{invoice.invoiceNo}</p>
                <p className="text-xs text-slate-500">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-100">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed To</p>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-lg">{invoice.student?.user?.fullName}</p>
                  <p className="text-sm text-slate-500">Admission No: {invoice.student?.admissionNo}</p>
                  <p className="text-sm text-slate-500">{invoice.student?.address || "Delhi, India"}</p>
                </div>
              </div>
              <div className="space-y-3 text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</p>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-lg">EduMaster International</p>
                  <p className="text-sm text-slate-500">123 Education Hub, Knowledge City</p>
                  <p className="text-sm text-slate-500">support@edumaster.com</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-slate-900 px-2">
                <div className="col-span-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</div>
                <div className="col-span-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</div>
              </div>
              <div className="divide-y divide-slate-100">
                {invoice.items?.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 py-4 px-2 hover:bg-slate-50 transition-colors">
                    <div className="col-span-8 font-semibold text-slate-700">{item.feeType}</div>
                    <div className="col-span-4 text-right font-bold text-slate-900">₹{item.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-8 border-t border-slate-100">
              <div className="w-64 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{invoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Amount Paid</span>
                  <span className="text-emerald-600 font-bold">-₹{paidAmount.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow-xl shadow-slate-900/10">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Balance Due</span>
                  <span className="text-xl font-black">₹{balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-12 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", balanceDue === 0 ? "bg-emerald-500" : "bg-amber-500")} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Status: {invoice.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                This is a computer generated invoice and does not require a physical signature.<br/>
                Thank you for your timely payment!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
