"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Get in <span className="text-blue-500">Touch</span></h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">Have questions? Our team is here to help you 24/7.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-32">
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Contact Info</h3>
            <p className="text-slate-500">Reach out through any of these channels.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><Mail className="w-6 h-6" /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase">Email</p><p className="font-bold">hello@edumaster.com</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><Phone className="w-6 h-6" /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase">Phone</p><p className="font-bold">+91 98765 43210</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><MapPin className="w-6 h-6" /></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase">Office</p><p className="font-bold">123 Tech Park, Bangalore</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-10 rounded-[40px]">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Full Name</label>
                <input className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 ml-1">Work Email</label>
                <input className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="john@school.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 ml-1">Message</label>
              <textarea rows={5} className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Tell us about your school..." />
            </div>
            <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3">
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="py-12 text-center border-t border-white/5">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors">← Back to Home</Link>
      </div>
    </div>
  );
}
