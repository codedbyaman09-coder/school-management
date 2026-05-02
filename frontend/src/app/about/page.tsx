"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Heart, Users, Target, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <div className="relative pt-32 pb-20 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 -z-10 blur-3xl" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Our Mission to <br/><span className="text-blue-500">Transform Education</span></h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We believe that every school deserves the best technology to nurture 
          the next generation of leaders, thinkers, and creators.
        </p>
      </div>

      {/* Story */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">The EduMaster Story</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Founded in 2024, EduMaster Pro started with a simple observation: 
            most school management systems were clunky, outdated, and frustrating for teachers. 
            We set out to build a platform that feels like a modern smartphone app—intuitive, fast, and beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Empowerment", desc: "We give teachers their time back so they can focus on what matters—teaching.", icon: Heart },
            { title: "Precision", desc: "Our data analytics help administrators make informed decisions with accuracy.", icon: Target },
            { title: "Security", desc: "We use enterprise-grade encryption to protect every student's data.", icon: ShieldCheck },
            { title: "Community", desc: "We connect parents, teachers, and students in one seamless ecosystem.", icon: Users },
          ].map((v, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
              <v.icon className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="text-slate-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Ready to see the difference?</h2>
          <Link href="/register" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg hover:shadow-2xl transition-all">
            Join the Revolution
          </Link>
        </div>
      </section>

      {/* Simple Footer Link */}
      <div className="py-12 text-center border-t border-white/5">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors">← Back to Home</Link>
      </div>
    </div>
  );
}
