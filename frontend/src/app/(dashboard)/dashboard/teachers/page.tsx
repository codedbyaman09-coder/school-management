"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus,
  Filter, 
  Trash2,
  Edit2,
  Eye,
  BookOpen,
  Award,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import TeacherForm from "@/components/TeacherForm";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [search, setSearch] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAdd = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this teacher?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (error) {
      alert("Failed to delete teacher");
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.employeeCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search teachers by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-dashed border-slate-300">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Loading teachers...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
            No teachers found. Start by adding one!
          </div>
        ) : filteredTeachers.map((teacher: any) => (
          <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg uppercase">
                  {(teacher.user?.fullName || "T").split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{teacher.user?.fullName}</h3>
                  <p className="text-xs text-slate-500">{teacher.employeeCode || "TCH-" + teacher.id.slice(-4)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-slate-600">{teacher.specialization || "General"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-slate-600">{teacher.qualification || "N/A"}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-400">Hire Date: </span>
                <span className="text-slate-700 font-medium">{teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEdit(teacher)}
                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(teacher.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TeacherForm 
          teacher={selectedTeacher} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchTeachers();
          }}
        />
      )}
    </div>
  );
}
