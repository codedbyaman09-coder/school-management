"use client";

import React, { useState, useEffect } from "react";
import { 
  CalendarCheck,
  CheckCircle2, 
  XCircle, 
  Clock,
  Save,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type Status = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

const statusColors: Record<Status, { bg: string; text: string; icon: any }> = {
  PRESENT: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: CheckCircle2 },
  ABSENT: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: XCircle },
  LATE: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock },
  LEAVE: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: CalendarCheck },
};

export default function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (classId: string) => {
    setSelectedClass(classId);
    setSelectedSection("");
    setStudents([]);
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

  const fetchStudentsForAttendance = async () => {
    if (!selectedClass || !selectedSection) return;
    setLoading(true);
    try {
      // First fetch all students in this section
      const studentRes = await api.get(`/students?classId=${selectedClass}&sectionId=${selectedSection}`);
      
      // Then fetch existing attendance for this date
      const attendanceRes = await api.get(`/attendance?classId=${selectedClass}&sectionId=${selectedSection}&date=${selectedDate}`);
      
      const attendanceMap = new Map(attendanceRes.data.map((a: any) => [a.enrollmentId, a]));

      const studentsWithStatus = studentRes.data.map((s: any) => {
        const enrollment = s.enrollments?.[0];
        const existing = attendanceMap.get(enrollment?.id);
        return {
          id: s.id,
          enrollmentId: enrollment?.id,
          name: s.user?.fullName,
          rollNo: enrollment?.rollNo || "N/A",
          status: ((existing as any)?.status || "PRESENT") as Status,
          attendanceId: (existing as any)?.id
        };
      });

      setStudents(studentsWithStatus);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsForAttendance();
  }, [selectedSection, selectedDate]);

  const toggleStatus = (enrollmentId: string, newStatus: Status) => {
    setStudents(prev =>
      prev.map(s => s.enrollmentId === enrollmentId ? { ...s, status: newStatus } : s)
    );
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const records = students.map(s => ({
        enrollmentId: s.enrollmentId,
        status: s.status,
        id: s.attendanceId
      }));
      await api.post("/attendance/bulk", { date: selectedDate, records });
      alert("Attendance saved successfully!");
    } catch (error) {
      alert("Failed to save attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    present: students.filter(s => s.status === "PRESENT").length,
    absent: students.filter(s => s.status === "ABSENT").length,
    late: students.filter(s => s.status === "LATE").length,
    leave: students.filter(s => s.status === "LEAVE").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select Section</option>
            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={submitting || students.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Attendance
        </button>
      </div>

      {students.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Present", count: counts.present, color: "emerald", icon: CheckCircle2 },
              { label: "Absent", count: counts.absent, color: "red", icon: XCircle },
              { label: "Late", count: counts.late, color: "amber", icon: Clock },
              { label: "Leave", count: counts.leave, color: "blue", icon: CalendarCheck },
            ].map((stat) => (
              <div key={stat.label} className={cn("rounded-xl p-4 flex items-center gap-3 border", 
                stat.color === "emerald" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                stat.color === "red" ? "bg-red-50 border-red-200 text-red-700" :
                stat.color === "amber" ? "bg-amber-50 border-amber-200 text-amber-700" :
                "bg-blue-50 border-blue-200 text-blue-700"
              )}>
                <stat.icon className="w-8 h-8 opacity-80" />
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-xs font-medium opacity-80">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Attendance Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Mark Attendance — {selectedDate}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setStudents(prev => prev.map(s => ({ ...s, status: "PRESENT" as Status })))}
                  className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => setStudents(prev => prev.map(s => ({ ...s, status: "ABSENT" as Status })))}
                  className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="font-medium">Loading student list...</p>
                </div>
              ) : students.map((student) => (
                <div key={student.enrollmentId} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {student.rollNo}
                    </span>
                    <span className="font-semibold text-slate-700">{student.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["PRESENT", "ABSENT", "LATE", "LEAVE"] as Status[]).map((status) => {
                      const colors = statusColors[status];
                      const isActive = student.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => toggleStatus(student.enrollmentId, status)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                            isActive
                              ? `${colors.bg} ${colors.text} border-current`
                              : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                          )}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!selectedSection && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div className="p-4 bg-slate-50 rounded-full">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-600">Select Class & Section</p>
            <p className="text-sm">Please select a class and section to mark attendance</p>
          </div>
        </div>
      )}
    </div>
  );
}
