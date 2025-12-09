"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import { TITLES, FACULTIES } from "@/constants/options";
import Link from "next/link";
import { type Profile } from "@/types";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-6">
      {/* Error Message Global */}
      {state?.message && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        {/* 1. คำนำหน้า (Dropdown) */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            คำนำหน้า
          </label>
          <select
            name="title"
            defaultValue={profile?.title || ""}
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

        {/* 2. ชื่อ-นามสกุล */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            ชื่อ-นามสกุล (ภาษาไทย)
          </label>
          <input
            type="text"
            name="full_name"
            defaultValue={profile?.full_name || ""}
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
            defaultValue={profile?.nickname || ""}
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
            defaultValue={profile?.student_id || ""}
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
            defaultValue={profile?.phone_number || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.phone_number && (
            <p className="text-xs text-red-600 mt-1">
              {state.errors.phone_number}
            </p>
          )}
        </div>

        {/* 6. ปีการศึกษาที่เข้า (Admission Year) */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            ปีการศึกษาที่เข้า (พ.ศ.)
          </label>
          <input
            type="number"
            name="admission_year"
            placeholder="เช่น 2566"
            defaultValue={profile?.admission_year || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.admission_year && (
            <p className="text-xs text-red-600 mt-1">
              {state.errors.admission_year}
            </p>
          )}
        </div>

        {/* 7. คณะ (Dropdown จาก Constants) */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">คณะ</label>
          <select
            name="faculty"
            defaultValue={profile?.faculty || ""}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border shadow-sm"
          >
            <option value="" disabled>
              เลือกคณะ...
            </option>
            {/* วนลูปสร้าง Option จากไฟล์ constants */}
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
            defaultValue={profile?.major || ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
          {state?.errors?.major && (
            <p className="text-xs text-red-600 mt-1">{state.errors.major}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
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
