"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "./actions";
import { TITLES, FACULTIES } from "@/constants/options";
import Link from "next/link";
import Image from "next/image";
import { type Profile } from "@/types";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, action, isPending] = useActionState(updateProfile, null);

  // State 1: เก็บชื่อที่พิมพ์ (เพื่อเอาไปทำ Live Preview UI Avatars)
  const [name, setName] = useState(profile.full_name || "");

  // State 2: เก็บรูปที่เลือกจากเครื่อง (File Upload Preview)
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // ฟังก์ชันจัดการเมื่อเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  // Logic เลือกรูปที่จะแสดงผล (ตามลำดับความสำคัญ)
  // 1. ถ้าเลือกไฟล์ใหม่ -> โชว์ไฟล์ใหม่
  // 2. ถ้ามีรูปเดิมใน DB -> โชว์รูปเดิม
  // 3. ถ้าไม่มีสักอย่าง -> สร้างรูปจากชื่อที่กำลังพิมพ์ (Live)
  const displayAvatarUrl =
    filePreview ||
    profile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=random`;

  return (
    <form action={action} className="space-y-8">
      {/* --- ส่วนอัปโหลดรูปโปรไฟล์ --- */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 border-b border-gray-100 pb-8">
        <div className="relative group">
          <div className="h-32 w-32 shrink-0 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gray-100 relative">
            <Image
              src={displayAvatarUrl}
              alt="Profile Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Overlay icon กล้องถ่ายรูป */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            รูปโปรไฟล์
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            เลือกรูปภาพที่แสดงความเป็นตัวคุณ (รองรับ .jpg, .png ขนาดไม่เกิน 5MB)
          </p>
          <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
            <label
              htmlFor="avatar-upload"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              เปลี่ยนรูป
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Error Message Global */}
      {state?.message && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        {/* 1. คำนำหน้า */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            คำนำหน้า
          </label>
          <select
            name="title"
            defaultValue={profile.title || ""}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border shadow-sm"
          >
            <option value="" disabled>
              เลือก...
            </option>
            {TITLES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {state?.errors?.title && (
            <p className="text-xs text-red-600 mt-1">{state.errors.title}</p>
          )}
        </div>

        {/* 2. ชื่อ-นามสกุล (แก้ไขเพิ่ม onChange เพื่อ update รูป) */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            ชื่อ-นามสกุล (ภาษาไทย)
          </label>
          <input
            type="text"
            name="full_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.full_name && (
            <p className="text-xs text-red-600 mt-1">
              {state.errors.full_name}
            </p>
          )}
        </div>

        {/* 3. ชื่อเล่น */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            ชื่อเล่น
          </label>
          <input
            type="text"
            name="nickname"
            defaultValue={profile.nickname || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.nickname && (
            <p className="text-xs text-red-600 mt-1">{state.errors.nickname}</p>
          )}
        </div>

        {/* 4. รหัสนักศึกษา */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            รหัสนักศึกษา
          </label>
          <input
            type="text"
            name="student_id"
            maxLength={8}
            placeholder="เช่น 6601xxxx"
            defaultValue={profile.student_id || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.student_id && (
            <p className="text-xs text-red-600 mt-1">
              {state.errors.student_id}
            </p>
          )}
        </div>

        {/* 5. เบอร์โทร */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            name="phone_number"
            defaultValue={profile.phone_number || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.phone_number && (
            <p className="text-xs text-red-600 mt-1">
              {state.errors.phone_number}
            </p>
          )}
        </div>

        {/* 6. ปีการศึกษาที่เข้า */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            ปีการศึกษาที่เข้า (พ.ศ.)
          </label>
          <input
            type="number"
            name="admission_year"
            placeholder="เช่น 2566"
            defaultValue={profile.admission_year || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.admission_year && (
            <p className="text-xs text-red-600 mt-1">
              {state.errors.admission_year}
            </p>
          )}
        </div>

        {/* 7. คณะ */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">คณะ</label>
          <select
            name="faculty"
            defaultValue={profile.faculty || ""}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border shadow-sm"
          >
            <option value="" disabled>
              เลือกคณะ...
            </option>
            {FACULTIES.map((facultyName) => (
              <option key={facultyName} value={facultyName}>
                {facultyName}
              </option>
            ))}
          </select>
          {state?.errors?.faculty && (
            <p className="text-xs text-red-600 mt-1">{state.errors.faculty}</p>
          )}
        </div>

        {/* 8. สาขาวิชา */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            สาขาวิชา
          </label>
          <input
            type="text"
            name="major"
            defaultValue={profile.major || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.major && (
            <p className="text-xs text-red-600 mt-1">{state.errors.major}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          ยกเลิก
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
            ${
              isPending
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-nature hover:bg-nature-dark"
            }`}
        >
          {isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>
    </form>
  );
}
