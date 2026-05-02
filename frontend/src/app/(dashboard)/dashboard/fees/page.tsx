"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Eye,
  Download,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import InvoiceModal from "@/components/InvoiceModal";

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  PAID: { color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
  PARTIAL: { color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
  UNPAID: { color: "text-slate-700", bg: "bg-slate-100", icon: CreditCard },
  OVERDUE: { color: "text-red-700", bg: "bg-red-50", icon: AlertCircle },
};

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "collect" | "generate">("invoices");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    invoiceId: "",
    paidAmount: "",
    paymentMethod: "Cash",
    transactionRef: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Generate Invoice Form State
  const [invoiceData, setInvoiceData] = useState({
    studentId: "",
    dueDate: "",
    items: [{ feeType: "Tution Fee", amount: "" }]
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get("/fees/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchStudents();
  }, []);

  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/fees/payments", paymentData);
      setPaymentData({ invoiceId: "", paidAmount: "", paymentMethod: "Cash", transactionRef: "" });
      setActiveTab("invoices");
      fetchInvoices();
    } catch (error) {
      alert("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/fees/invoices", invoiceData);
      setInvoiceData({ studentId: "", dueDate: "", items: [{ feeType: "Tution Fee", amount: "" }] });
      setActiveTab("invoices");
      fetchInvoices();
    } catch (error) {
      alert("Failed to generate invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => {
    const paid = inv.payments?.reduce((pSum: number, p: any) => pSum + p.paidAmount, 0) || 0;
    return sum + paid;
  }, 0);

  const totalDue = invoices.reduce((sum, inv) => {
    const paid = inv.payments?.reduce((pSum: number, p: any) => pSum + p.paidAmount, 0) || 0;
    return sum + (inv.totalAmount - paid);
  }, 0);

  const paidCount = invoices.filter(i => i.status === "PAID").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <IndianRupee className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total Collected</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">₹{totalDue.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total Pending</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{invoices.length}</p>
            <p className="text-xs text-slate-500">Total Invoices</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{paidCount}/{invoices.length}</p>
            <p className="text-xs text-slate-500">Fully Paid</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("invoices")}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "invoices" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          All Invoices
        </button>
        <button
          onClick={() => setActiveTab("collect")}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "collect" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          Collect Payment
        </button>
        <button
          onClick={() => setActiveTab("generate")}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "generate" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          Generate Invoice
        </button>
      </div>

      {activeTab === "invoices" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search by invoice no or student..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Student</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Total</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <p className="text-sm font-medium">Loading invoices...</p>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">No invoices found.</td>
                </tr>
              ) : invoices.map((inv) => {
                const config = statusConfig[inv.status] || statusConfig.UNPAID;
                const paid = inv.payments?.reduce((sum: number, p: any) => sum + p.paidAmount, 0) || 0;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-700">{inv.invoiceNo}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{inv.student?.user?.fullName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{inv.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">₹{paid.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", config.bg, config.color)}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedInvoice(inv); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedInvoice(inv); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : activeTab === "collect" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Collect Payment</h3>
          <form onSubmit={handleCollectPayment} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Invoice Number</label>
              <select 
                required
                value={paymentData.invoiceId}
                onChange={(e) => setPaymentData({ ...paymentData, invoiceId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Invoice</option>
                {invoices.filter(i => i.status !== "PAID").map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNo} — {inv.student?.user?.fullName} (Balance: ₹{(inv.totalAmount - (inv.payments?.reduce((s: number, p: any) => s + p.paidAmount, 0) || 0)).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  value={paymentData.paidAmount}
                  onChange={(e) => setPaymentData({ ...paymentData, paidAmount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Payment Method</label>
                <select 
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Transaction Reference (Optional)</label>
              <input
                type="text"
                placeholder="Transaction ID / Receipt No"
                value={paymentData.transactionRef}
                onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button 
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              Record Payment
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Generate New Invoice</h3>
          <form onSubmit={handleGenerateInvoice} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Select Student</label>
              <select 
                required
                value={invoiceData.studentId}
                onChange={(e) => setInvoiceData({ ...invoiceData, studentId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.user?.fullName} ({s.admissionNo})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Due Date</label>
              <input
                required
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Invoice Items</label>
              {invoiceData.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Fee Type (e.g. Tution Fee)"
                    value={item.feeType}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[idx].feeType = e.target.value;
                      setInvoiceData({ ...invoiceData, items: newItems });
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[idx].amount = e.target.value;
                      setInvoiceData({ ...invoiceData, items: newItems });
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              ))}
            </div>
            <button 
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Generate Invoice
            </button>
          </form>
        </div>
      )}

      {isModalOpen && (
        <InvoiceModal 
          invoice={selectedInvoice} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
