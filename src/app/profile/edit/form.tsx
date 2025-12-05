'use client'

import { useActionState } from 'react' 
import { updateProfile } from './actions'

// รับ Props ข้อมูลเก่าเข้ามา
export function EditProfileForm({ profile }: { profile: any }) {
  const [state, action, isPending] = useActionState(updateProfile, null)

  return (
    <form action={action} className="space-y-6">
      
      {state?.message && (
        <div className={`rounded-md p-4 text-sm ${state.errors ? 'bg-red-50 text-red-700' : 'bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อเล่น</label>
          <input
            name="nickname"
            defaultValue={profile?.nickname || ''}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {/* แสดง Error ของ field นี้ถ้ามี */}
          {state?.errors?.nickname && (
            <p className="mt-1 text-xs text-red-600">{state.errors.nickname}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
          <input
            name="phone_number"
            defaultValue={profile?.phone_number || ''}
            type="tel"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {state?.errors?.phone_number && (
            <p className="mt-1 text-xs text-red-600">{state.errors.phone_number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">คณะ</label>
          <input
            name="faculty"
            defaultValue={profile?.faculty || ''}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
           {state?.errors?.faculty && (
            <p className="mt-1 text-xs text-red-600">{state.errors.faculty}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">สาขาวิชา</label>
          <input
            name="major"
            defaultValue={profile?.major || ''}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
           {state?.errors?.major && (
            <p className="mt-1 text-xs text-red-600">{state.errors.major}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            ปีการศึกษาที่เข้าศึกษา (เช่น 2566)
          </label>
          <input
            name="admission_year"
            defaultValue={profile?.admission_year || ''}
            type="number"
            placeholder="25XX"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            ระบบจะนำไปคำนวณชั้นปีอัตโนมัติ
          </p>
           {state?.errors?.admission_year && (
            <p className="mt-1 text-xs text-red-600">{state.errors.admission_year}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <a href="/" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          ยกเลิก
        </a>
        <button
          type="submit"
          disabled={isPending}
          className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
            ${isPending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        >
          {isPending ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>
    </form>
  )
}