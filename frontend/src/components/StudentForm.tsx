"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface StudentFormProps {
  student?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentForm({ student, onClose, onSuccess }: StudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [formData, setFormData] = useState({
    fullName: student?.user?.fullName || "",
    email: student?.user?.email || "",
    phone: student?.user?.phone || "",
    password: "",
    admissionNo: student?.admissionNo || "",
    dob: student?.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
    gender: student?.gender || "MALE",
    bloodGroup: student?.bloodGroup || "",
    address: student?.address || "",
    classId: student?.enrollments?.[0]?.classId || "",
    sectionId: student?.enrollments?.[0]?.sectionId || "",
    parentName: student?.guardians?.[0]?.guardian?.user?.fullName || "",
    parentEmail: student?.guardians?.[0]?.guardian?.user?.email || "",
    parentPhone: student?.guardians?.[0]?.guardian?.user?.phone || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await api.get("/classes");
        setClasses(classRes.data);
        if (student?.enrollments?.[0]?.classId) {
          const sectionRes = await api.get(`/sections?classId=${student.enrollments[0].classId}`);
          setSections(sectionRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      }
    };
    fetchData();
  }, [student]);

  const handleClassChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setFormData({ ...formData, classId, sectionId: "" });
    if (classId) {
      try {
        const res = await api.get(`/sections?classId=${classId}`);
        setSections(res.data);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    } else {
      setSections([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        dob: formData.dob === "" ? null : formData.dob,
        phone: formData.phone === "" ? null : formData.phone,
        parentPhone: formData.parentPhone === "" ? null : formData.parentPhone,
      };

      if (student) {
        await api.patch(`/students/${student.id}`, submissionData);
      } else {
        await api.post("/students", submissionData);
      }
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">{student ? "Edit Student" : "Add New Student"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Basic Info */}
          <section>
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              {!student && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                  <input
                    type="password"
                    placeholder="student123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Admission No</label>
                <input
                  required
                  value={formData.admissionNo}
                  onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Academic Info */}
          <section>
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Academic Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Class</label>
                <select
                  required
                  value={formData.classId}
                  onChange={handleClassChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Section</label>
                <select
                  required
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Parent Info */}
          <section>
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Parent/Guardian Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Parent Name</label>
                <input
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Parent Email</label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Parent Phone</label>
                <input
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            </div>
          </section>
          
          <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex items-center justify-end gap-3 -mx-8 -mb-8 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {student ? "Update Student" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
