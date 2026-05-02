"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  GraduationCap, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  PlayCircle,
  BookOpen,
  Globe,
  Award,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronDown,
  Layout,
  Layers,
  Sparkles,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import 3D Scene for performance
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [studentCount, setStudentCount] = useState(1200);

  const calculatePrice = (count: number) => {
    if (count <= 200) return 2499;
    if (count <= 1000) return 5999;
    return 5999 + (count - 1000) * 5;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 font-sans scroll-smooth overflow-x-hidden">
      {/* 3D Immersive Background Layer */}
      <Scene3D />

      {/* Professional Navbar */}
      <nav className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-500",
        scrolled ? "bg-white/80 backdrop-blur-2xl py-4 border-b border-slate-200 shadow-sm" : "bg-transparent py-8 border-b border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center shadow-2xl shadow-blue-600/20 group-hover:rotate-12 transition-all duration-500">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">EduFlow Pro</span>
              <span className="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase italic">Mastery in Education</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="#contact" className="hover:text-blue-600 transition-colors">Support</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">Login</Link>
            <Link 
              href="/register" 
              className="px-8 py-3.5 bg-slate-900 text-white hover:bg-blue-600 rounded-full text-[11px] font-black uppercase tracking-[0.15em] shadow-xl transition-all duration-500 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - High Impact & Immersive */}
      <section id="home" className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white border border-slate-200 rounded-full shadow-sm animate-fade-in-up">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">Global Standard for School ERP 2026</span>
            </div>
            
            <h1 className="text-7xl md:text-[92px] font-black tracking-tighter leading-[0.85] text-slate-900">
              Future of <br />
              <span className="text-blue-600 italic">Schools</span> <br />
              Management.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-xl leading-relaxed font-medium animate-fade-in-up delay-200">
              EduFlow Pro is the world's most intuitive school management system. 
              Designed for growth, built for efficiency, loved by admins.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 animate-fade-in-up delay-300">
              <Link 
                href="/register"
                className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1"
              >
                Join the Future <ArrowRight className="w-6 h-6" />
              </Link>
              <button className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-sm hover:text-blue-600 transition-colors">
                <PlayCircle className="w-10 h-10 text-blue-600" /> See How it Works
              </button>
            </div>
          </div>

          {/* Isometric Dashboard Mockup */}
          <div className="relative perspective-2000 group hidden lg:block">
            <div className="relative z-20 transition-all duration-1000 transform-3d rotate-x-12 rotate-y--25 group-hover:rotate-x-0 group-hover:rotate-y-0 shadow-[0_50px_100px_rgba(0,0,0,0.15)] bg-white border border-slate-200 p-2 rounded-[48px]">
               <div className="bg-slate-50 rounded-[44px] overflow-hidden aspect-[4/3] p-10 space-y-8 relative">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-32 bg-slate-200 rounded-xl" />
                    <div className="flex gap-2">
                       <div className="h-8 w-8 bg-blue-600 rounded-lg" />
                       <div className="h-8 w-8 bg-slate-200 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-40 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-sm translate-z-10">
                       <BarChart3 className="text-blue-600 w-10 h-10" />
                       <div className="h-3 w-full bg-slate-100 rounded-full" />
                       <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                    </div>
                    <div className="h-40 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-sm">
                       <Users className="text-emerald-500 w-10 h-10" />
                       <div className="h-3 w-full bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="h-32 bg-white rounded-3xl border border-slate-100 shadow-sm" />
               </div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/5 blur-[50px] rounded-full scale-y-50" />
          </div>
        </div>
      </section>

      {/* Stat Section */}
      <section className="py-24 border-y border-slate-100 bg-white/50 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Schools Managed", value: "4,500+" },
            { label: "Active Students", value: "1.2M+" },
            { label: "Parent Satisfaction", value: "98.5%" },
            { label: "Daily Transactions", value: "₹24M+" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Features Grid */}
      <section id="features" className="py-40 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">Everything You Need <br /> to Grow.</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">EduFlow Pro is built to handle the complexities of modern education with zero stress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Smart Fee Hub", icon: BarChart3, desc: "Automate invoicing, handle partial payments, and track every rupee with ease." },
              { title: "Academic Tracker", icon: BookOpen, desc: "Manage exams, assignments, and grades with real-time analytics for students." },
              { title: "Instant Alerts", icon: Zap, desc: "Send SMS and App notifications for attendance, holidays, and urgent updates." },
              { title: "Parent Portal", icon: Users, desc: "A dedicated mobile experience for parents to track their child's daily progress." },
              { title: "Security First", icon: ShieldCheck, desc: "Military-grade data encryption ensuring your school data stays private." },
              { title: "Multi-School ERP", icon: Globe, desc: "Manage multiple branches or schools from a single master dashboard." },
            ].map((f, i) => (
              <div key={i} className="group p-12 bg-white border border-slate-200 rounded-[48px] hover:shadow-2xl transition-all duration-500 hover:-translate-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Public Proof */}
      <section className="py-40 px-6 bg-slate-900 text-white rounded-[80px] mx-6 my-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[150px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">Public Choice <br /> Trusted Leader.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">Join 4,500+ principals who have transformed their schools with us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Dr. Rajesh Khanna", role: "Principal, Delhi Public Academy", text: "EduFlow Pro simplified our manual processes in just 48 hours. The parent response is overwhelming." },
              { name: "Mrs. Anjali Rao", role: "Admin, Silver Oaks High", text: "Fee management used to be a nightmare. Now it's the most favorite part of my job. Highly recommend!" },
              { name: "Mr. Thomas Cook", role: "Director, Global International", text: "The security and uptime are unmatched. Best school software we've used in 20 years." },
            ].map((t, i) => (
              <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-8 hover:bg-white/[0.08] transition-all">
                <div className="flex gap-1 text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-xl font-bold leading-relaxed italic text-slate-300">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                   <div className="w-12 h-12 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center text-xl font-black">
                      {t.name[0]}
                   </div>
                   <div>
                      <p className="font-black uppercase tracking-tighter">{t.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{t.role}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Engine */}
      <section id="pricing" className="py-40 px-6">
        <div className="max-w-4xl mx-auto space-y-16 text-center">
          <div className="space-y-4">
             <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85]">Clear Scale. <br /> Clear Price.</h2>
             <p className="text-slate-500 text-xl font-medium">Simple student-based pricing for any school size.</p>
          </div>

          <div className="p-16 bg-white border border-slate-200 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.05)] space-y-12 relative group">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">Total Students</p>
                  <p className="text-8xl font-black tracking-tighter text-slate-900">{studentCount.toLocaleString()}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Monthly Node Investment</p>
                  <p className="text-8xl font-black tracking-tighter text-blue-600">₹{calculatePrice(studentCount).toLocaleString()}</p>
                </div>
            </div>
              
            <div className="relative py-12">
               <input 
                type="range" 
                min="100" 
                max="5000" 
                step="50"
                value={studentCount}
                onChange={(e) => setStudentCount(parseInt(e.target.value))}
                className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
               />
               <div className="flex justify-between mt-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  <span>Starter Pack</span>
                  <span>Premium Core</span>
                  <span>Enterprise Grid</span>
               </div>
            </div>

            <Link href="/register" className="w-full block text-center py-7 bg-slate-900 text-white rounded-[32px] font-black text-2xl hover:bg-blue-600 transition-all shadow-2xl">
               Start Your Trial Protocol
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate FAQ */}
      <section className="py-40 px-6 bg-slate-50 relative z-10">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-5xl font-black text-slate-900">Your Questions, Answered.</h2>
             <p className="text-slate-500 font-medium">Everything you need to know about migrating to EduFlow Pro.</p>
          </div>
          <div className="space-y-6">
             {[
               { q: "Is the setup complex?", a: "Not at all. Our team handles your data migration and staff training within 48 hours." },
               { q: "Can we collect fees online?", a: "Yes, we integrate with all major payment gateways for direct school account transfers." },
               { q: "Do you have a mobile app?", a: "Absolutely. We have dedicated apps for Admins, Teachers, and Parents on both iOS and Android." },
             ].map((faq, i) => (
               <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 space-y-4 hover:shadow-xl transition-all">
                  <h4 className="text-2xl font-black text-slate-900 italic">{faq.q}</h4>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">{faq.a}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Ultimate Footer */}
      <footer id="contact" className="py-24 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8 col-span-1 md:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                 <GraduationCap className="w-6 h-6 text-white" />
               </div>
               <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">EduFlow Pro</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">The global leader in educational management technology. Empowering the next generation of schools.</p>
          </div>
          
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Product</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
               <li><Link href="#features" className="hover:text-blue-600">System Features</Link></li>
               <li><Link href="#solutions" className="hover:text-blue-600">Success Stories</Link></li>
               <li><Link href="#pricing" className="hover:text-blue-600">Plan Calculator</Link></li>
            </ul>
          </div>
          
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Support</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
               <li><Link href="#" className="hover:text-blue-600">Help Center</Link></li>
               <li><Link href="#" className="hover:text-blue-600">API Documentation</Link></li>
               <li><Link href="#" className="hover:text-blue-600">Security Audit</Link></li>
            </ul>
          </div>

          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Connect</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
               <li className="flex items-center justify-center md:justify-start gap-3"><Mail className="w-4 h-4" /> support@eduflow.pro</li>
               <li className="flex items-center justify-center md:justify-start gap-3"><Phone className="w-4 h-4" /> +91 9988 7766 55</li>
               <li className="flex items-center justify-center md:justify-start gap-3"><MapPin className="w-4 h-4" /> Tech Park, Bangalore</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 font-black text-[11px] uppercase tracking-[0.4em]">
          <span>© 2026 EduFlow Pro Global ERP. Secure & Encrypted.</span>
          <div className="flex gap-12">
             <Link href="#" className="hover:text-slate-900">Privacy Policy</Link>
             <Link href="#" className="hover:text-slate-900">Terms of Use</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .perspective-2000 { perspective: 2000px; }
        .transform-3d { transform-style: preserve-3d; }
        .rotate-x-12 { transform: rotateX(12deg); }
        .rotate-y--25 { transform: rotateY(-25deg); }
        .translate-z-10 { transform: translateZ(20px); }
      `}</style>
    </div>
  );
}
