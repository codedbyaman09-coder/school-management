"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft, 
  Save, 
  User, 
  UserCircle, 
  MapPin, 
  Calendar, 
  Upload
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  admissionNo: z.string().min(1, "Admission number is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  parentName: z.string().min(2, "Parent name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function AddStudentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
  });

  const onSubmit = (data: StudentFormValues) => {
    console.log(data);
    alert("Student added successfully (Mock)");
    window.location.href = "/dashboard/students";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/students" 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Add New Student</h1>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all"
        >
          <Save className="w-4 h-4" />
          Save Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Photo Upload */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 relative group cursor-pointer hover:border-blue-400 transition-all">
              <UserCircle className="w-20 h-20 text-slate-300 group-hover:text-blue-200" />
              <div className="absolute inset-0 bg-blue-600/10 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">Upload Photo</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Academic Year</span>
                <span className="text-slate-800 font-medium">2026-27</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-600 font-bold">New</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {/* Section: Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Full Name</label>
                  <input 
                    {...register("fullName")}
                    className={cn(
                      "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                      errors.fullName && "border-red-500"
                    )}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Admission No</label>
                  <input 
                    {...register("admissionNo")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="SCH-2026-001"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Class</label>
                  <select 
                    {...register("class")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Class</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Section</label>
                  <select 
                    {...register("section")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Date of Birth</label>
                  <input 
                    type="date"
                    {...register("dob")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Gender</label>
                  <div className="flex gap-4 pt-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" {...register("gender")} value={g} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                        <span className="text-sm text-slate-600">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Guardian Info */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <UserCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-800">Guardian Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Guardian Name</label>
                  <input 
                    {...register("parentName")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Robert Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Phone Number</label>
                  <input 
                    {...register("phone")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            {/* Section: Address */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800">Address Details</h3>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Residential Address</label>
                <textarea 
                  {...register("address")}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="Street name, City, State, Zip"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
