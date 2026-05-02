"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import { GraduationCap, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

// Use the same 3D Scene for branding consistency
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      {/* Immersive Background */}
      <Scene3D />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-3xl border border-slate-200 p-10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center mb-6 shadow-2xl shadow-blue-600/30 hover:rotate-12 transition-transform duration-500">
              <GraduationCap className="text-white w-10 h-10" />
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">EduFlow Pro</h1>
            <p className="text-slate-500 font-medium mt-2">Initialize Admin Protocol</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Command Input: Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  {...register("email")}
                  className={cn(
                    "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium",
                    errors.email && "border-red-500/50"
                  )}
                  placeholder="admin@school.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-1 font-bold">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Security Key: Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  {...register("password")}
                  className={cn(
                    "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium",
                    errors.password && "border-red-500/50"
                  )}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs ml-1 font-bold">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Enter Dashboard <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              New Institution? <Link href="/register" className="text-blue-600 hover:underline font-black">Register Node</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
