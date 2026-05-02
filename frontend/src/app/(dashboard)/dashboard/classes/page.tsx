"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  Users,
  BookOpen,
  Layers,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddSubject = async () => {
    const name = prompt("Enter Subject Name (e.g. Mathematics):");
    if (!name) return;
    const code = prompt("Enter Subject Code (e.g. MATH101):");
    
    try {
      await api.post("/subjects", { name, code });
      alert("Subject created successfully!");
    } catch (error) {
      alert("Failed to add subject");
    }
  };

  const handleAddClass = async () => {
    const name = prompt("Enter Class Name (e.g. Grade 10):");
    if (!name) return;
    const orderNo = prompt("Enter Order Number (optional):", "0");
    
    try {
      await api.post("/classes", { name, orderNo: parseInt(orderNo || "0") });
      fetchClasses();
    } catch (error) {
      alert("Failed to add class");
    }
  };

  const handleAddSection = async (classId: string) => {
    const name = prompt("Enter Section Name (e.g. A, B, Rose):");
    if (!name) return;
    
    try {
      await api.post("/sections", { name, classId });
      fetchClasses();
    } catch (error) {
      alert("Failed to add section");
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class? This will also delete sections.")) return;
    try {
      await api.delete(`/classes/${id}`);
      fetchClasses();
    } catch (error) {
      alert("Failed to delete class");
    }
  };

  const totalSections = classes.reduce((acc, c) => acc + (c.sections?.length || 0), 0);
  const totalStudents = classes.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Class & Section Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage classes, sections, and subject assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddSubject}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
          <button 
            onClick={handleAddClass}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{classes.length}</p>
            <p className="text-sm text-slate-500">Total Classes</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalSections}</p>
            <p className="text-sm text-slate-500">Total Sections</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
            <p className="text-sm text-slate-500">Total Students Enrolled</p>
          </div>
        </div>
      </div>

      {/* Class List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-dashed border-slate-300">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
            No classes found. Add your first class!
          </div>
        ) : classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div
              onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{cls.orderNo || "•"}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800">{cls.name}</h3>
                  <p className="text-sm text-slate-500">
                    {cls.sections?.length || 0} sections • {cls._count?.enrollments || 0} students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedClass === cls.id ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {expandedClass === cls.id && (
              <div className="px-6 pb-6 border-t border-slate-100 pt-4 space-y-4">
                {/* Sections */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Sections</h4>
                    <button 
                      onClick={() => handleAddSection(cls.id)}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Section
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {cls.sections?.length === 0 ? (
                      <p className="text-xs text-slate-400">No sections added yet.</p>
                    ) : cls.sections?.map((sec: any) => (
                      <div key={sec.id} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <span className="font-bold text-slate-700">Section {sec.name}</span>
                        <button 
                          onClick={async () => {
                            if(confirm("Delete section?")) {
                              await api.delete(`/sections/${sec.id}`);
                              fetchClasses();
                            }
                          }}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Subjects</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cls.subjects?.length === 0 ? (
                      <p className="text-xs text-slate-400">No subjects assigned.</p>
                    ) : cls.subjects?.map((sub: any, i: number) => (
                      <span key={i} className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        {sub.subject?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
