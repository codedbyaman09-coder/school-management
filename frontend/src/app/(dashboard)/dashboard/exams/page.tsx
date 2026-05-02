"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  FileSpreadsheet,
  Calendar,
  BookOpen,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"exams" | "marks">("exams");
  
  // Marks Entry State
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examSubjects, setExamSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await api.get("/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    api.get("/classes").then(res => setClasses(res.data));
  }, []);

  const handleExamChangeForMarks = async (examId: string) => {
    setSelectedExam(examId);
    if (examId) {
      const exam = exams.find(e => e.id === examId);
      setExamSubjects(exam?.examSubjects || []);
    }
  };

  const fetchStudentsForMarks = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) return;
    setLoading(true);
    try {
      const res = await api.get(`/exams/marks?examSubjectId=${selectedSubject}&classId=${selectedClass}`);
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students for marks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsForMarks();
  }, [selectedExam, selectedClass, selectedSubject]);

  const handleMarksSubmit = async () => {
    setSubmitting(true);
    try {
      const marksData = students.map(s => ({
        enrollmentId: s.enrollmentId,
        obtainedMarks: s.obtainedMarks,
        examSubjectId: selectedSubject
      }));
      await api.post("/exams/marks/bulk", { marks: marksData });
      alert("Marks submitted successfully!");
    } catch (error) {
      alert("Failed to submit marks");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStudentMark = (enrollmentId: string, mark: string) => {
    setStudents(prev => prev.map(s => 
      s.enrollmentId === enrollmentId ? { ...s, obtainedMarks: parseFloat(mark) || 0 } : s
    ));
  };

  const getGrade = (marks: number, max: number) => {
    const pct = (marks / max) * 100;
    if (pct >= 90) return { grade: "A+", color: "text-emerald-600 bg-emerald-50" };
    if (pct >= 80) return { grade: "A", color: "text-emerald-600 bg-emerald-50" };
    if (pct >= 70) return { grade: "B+", color: "text-blue-600 bg-blue-50" };
    if (pct >= 60) return { grade: "B", color: "text-blue-600 bg-blue-50" };
    if (pct >= 50) return { grade: "C", color: "text-amber-600 bg-amber-50" };
    if (pct >= 33) return { grade: "D", color: "text-orange-600 bg-orange-50" };
    return { grade: "F", color: "text-red-600 bg-red-50" };
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("exams")}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "exams" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          Exam Schedule
        </button>
        <button
          onClick={() => setActiveTab("marks")}
          className={cn(
            "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "marks" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          Enter Marks
        </button>
      </div>

      {activeTab === "exams" ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Examinations</h2>
              <p className="text-sm text-slate-500">Manage exam schedules and subject assignments</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" />
              Create Exam
            </button>
          </div>

          {/* Exam List */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-dashed border-slate-300">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-slate-500">Loading exams...</p>
              </div>
            ) : exams.length === 0 ? (
              <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                No exams found.
              </div>
            ) : exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800">{exam.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(exam.startDate).toLocaleDateString()} → {new Date(exam.endDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {exam.examSubjects?.length || 0} subjects
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        // handleDelete(exam.id)
                      }} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedExam === exam.id ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {expandedExam === exam.id && (
                  <div className="px-6 pb-6 border-t border-slate-100">
                    <table className="w-full mt-4 text-left">
                      <thead>
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <th className="pb-3">Subject</th>
                          <th className="pb-3">Class</th>
                          <th className="pb-3">Max Marks</th>
                          <th className="pb-3">Pass Marks</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {exam.examSubjects?.map((sub: any, i: number) => (
                          <tr key={i} className="text-sm">
                            <td className="py-3 font-medium text-slate-700">{sub.subject?.name}</td>
                            <td className="py-3 text-slate-600">{sub.class?.name}</td>
                            <td className="py-3 text-slate-600">{sub.maxMarks}</td>
                            <td className="py-3 text-slate-600">{sub.passMarks}</td>
                            <td className="py-3 text-slate-600">{sub.examDate ? new Date(sub.examDate).toLocaleDateString() : "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Marks Entry */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <select 
                value={selectedExam}
                onChange={(e) => handleExamChangeForMarks(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Exam</option>
                {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Subject</option>
                {examSubjects.filter(es => es.classId === selectedClass).map(es => (
                  <option key={es.id} value={es.id}>{es.subject?.name}</option>
                ))}
              </select>
            </div>

            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Roll No</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Student Name</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Obtained Marks</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Max Marks</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const maxMarks = examSubjects.find(es => es.id === selectedSubject)?.maxMarks || 100;
                      const { grade, color } = getGrade(s.obtainedMarks || 0, maxMarks);
                      return (
                        <tr key={s.enrollmentId} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-600">{s.rollNo}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-700">{s.name}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={s.obtainedMarks || ""}
                              onChange={(e) => updateStudentMark(s.enrollmentId, e.target.value)}
                              className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{maxMarks}</td>
                          <td className="px-4 py-3">
                            <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", color)}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleMarksSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                    Submit Marks
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Select exam, class and subject to enter marks</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
