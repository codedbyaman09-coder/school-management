"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { GraduationCap, Lock, Mail, User, School, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  schoolName: z.string().min(3, "School name must be at least 3 characters"),
  schoolCode: z.string().min(3, "School code must be at least 3 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  plan: z.enum(["STARTER", "PREMIUM", "CUSTOM"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<"STARTER" | "PREMIUM" | "CUSTOM">("STARTER");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { plan: "STARTER" }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // 1. Create School
      const schoolRes = await api.post("/schools", {
        name: data.schoolName,
        code: data.schoolCode,
        plan: data.plan,
      });

      // 2. Register Admin
      const response = await api.post("/auth/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        schoolId: schoolRes.data.id,
        role: "ADMIN",
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Join EduFlow Pro Pro</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn("w-2 h-2 rounded-full", step >= 1 ? "bg-blue-500" : "bg-slate-700")} />
              <span className={cn("w-2 h-2 rounded-full", step >= 2 ? "bg-blue-500" : "bg-slate-700")} />
              <span className={cn("w-2 h-2 rounded-full", step >= 3 ? "bg-blue-500" : "bg-slate-700")} />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">School Name</label>
                  <div className="relative">
                    <School className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      {...register("schoolName")}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                        errors.schoolName && "border-red-500/50"
                      )}
                      placeholder="e.g. Global International School"
                    />
                  </div>
                  {errors.schoolName && <p className="text-red-400 text-xs ml-1">{errors.schoolName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">School Code</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      {...register("schoolCode")}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                        errors.schoolCode && "border-red-500/50"
                      )}
                      placeholder="e.g. GIS001"
                    />
                  </div>
                  {errors.schoolCode && <p className="text-red-400 text-xs ml-1">{errors.schoolCode.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue to Plans <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: "STARTER", name: "Starter Plan", price: "₹2,499", limit: "200 Students" },
                    { id: "PREMIUM", name: "Premium Plan", price: "₹5,999", limit: "1000 Students" },
                    { id: "CUSTOM", name: "Custom Plan", price: "₹5/Extra", limit: "Unlimited" },
                  ].map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => { setSelectedPlan(p.id as any); setValue("plan", p.id as any); }}
                      className={cn(
                        "p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between",
                        selectedPlan === p.id ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10" : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", selectedPlan === p.id ? "border-blue-500" : "border-slate-500")}>
                          {selectedPlan === p.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.limit}</p>
                        </div>
                      </div>
                      <p className="font-black text-white">{p.price}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-white/5 text-white py-3.5 rounded-xl">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold">Admin Setup</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Admin Name</label>
                  <input
                    {...register("fullName")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-400 text-xs ml-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Admin Email</label>
                  <input
                    {...register("email")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="admin@school.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-white/5 text-white py-3.5 rounded-xl">Back</button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
