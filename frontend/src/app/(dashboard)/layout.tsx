"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck, 
  FileSpreadsheet, 
  CreditCard, 
  Settings,
  LogOut,
  GraduationCap,
  Bell,
  Cpu,
  Search
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Students", href: "/dashboard/students" },
  { icon: UserSquare2, label: "Teachers", href: "/dashboard/teachers" },
  { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
  { icon: CalendarCheck, label: "Attendance", href: "/dashboard/attendance" },
  { icon: FileSpreadsheet, label: "Exams", href: "/dashboard/exams" },
  { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "AD";

  if (!user) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-[#020617] text-white flex flex-col relative overflow-hidden">
        {/* Subtle Background Atmosphere */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <div className="p-8 flex items-center gap-4 relative z-10">
          <Link href="/" className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:rotate-12 transition-all">
            <GraduationCap className="w-7 h-7 text-white" />
          </Link>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter uppercase italic">EduFlow Pro</span>
            <span className="text-[8px] font-black tracking-[0.4em] text-blue-500 uppercase">System Active</span>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-2 relative z-10 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 ml-4">Command Center</p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                pathname === item.href 
                  ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] scale-[1.02]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-blue-400"
              )} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {pathname === item.href && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 relative z-10">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all mb-2"
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">System Settings</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Node */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Modern Header */}
        <header className="h-24 bg-white/50 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-50 rounded-xl">
                <Cpu className="text-blue-600 w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter capitalize italic">
                  {pathname.split("/").pop() || "Dashboard"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator: {user?.fullName || "Admin"}</p>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
               <Search className="w-4 h-4 text-slate-400" />
               <input placeholder="Search Node..." className="bg-transparent border-none focus:outline-none text-xs font-bold text-slate-500 w-40" />
            </div>

            <div className="flex items-center gap-6">
               <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
               </button>
               
               <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="text-right">
                     <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{user?.fullName}</p>
                     <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">{user?.role} NODE</p>
                  </div>
                  <div className="w-12 h-12 rounded-[18px] bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-xl">
                    <span className="text-lg font-black">{initials}</span>
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-100">
          <div className="max-w-7xl mx-auto animate-fade-in">
             {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
