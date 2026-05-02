"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  UserSquare2, 
  Clock, 
  TrendingUp,
  AlertCircle 
} from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    { label: "Total Students", value: stats?.studentCount?.toLocaleString() || "0", icon: Users, color: "bg-blue-500", trend: "+0%" },
    { label: "Total Teachers", value: stats?.teacherCount?.toLocaleString() || "0", icon: UserSquare2, color: "bg-purple-500", trend: "+0%" },
    { label: "Attendance Rate", value: (stats?.attendanceRate || "0") + "%", icon: Clock, color: "bg-emerald-500", trend: "+0%" },
    { label: "Total Revenue", value: "₹" + (stats?.totalRevenue?.toLocaleString() || "0"), icon: TrendingUp, color: "bg-amber-500", trend: "+0%" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Recent Admissions</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {stats?.recentAdmissions?.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No recent admissions found.</p>
            ) : stats?.recentAdmissions?.map((student: any) => (
              <div key={student.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {student.user?.fullName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{student.user?.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {student.enrollments?.[0]?.class?.name || "N/A"} • {student.enrollments?.[0]?.section?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(student.joinDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications/Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Important Notices</h3>
          <div className="space-y-4">
            {[
              { title: "Mid-term Exams", time: "Next Week", color: "text-amber-600", bg: "bg-amber-50" },
              { title: "Staff Meeting", time: "Today, 4 PM", color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Fee Deadline", time: "3 Days left", color: "text-red-600", bg: "bg-red-50" },
            ].map((notice, i) => (
              <div key={i} className={`${notice.bg} p-4 rounded-xl flex gap-3`}>
                <AlertCircle className={`w-5 h-5 ${notice.color} shrink-0`} />
                <div>
                  <p className={`font-semibold text-sm ${notice.color}`}>{notice.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{notice.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
