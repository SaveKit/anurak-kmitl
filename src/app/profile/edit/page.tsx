import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { EditProfileForm } from './form' // เราจะแยก Component ฟอร์มออกมา

export default async function EditProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ดึงข้อมูลเก่ามาแสดงในฟอร์ม
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h1>
          <p className="mt-2 text-sm text-gray-600">
            ข้อมูลนี้จะถูกนำไปใช้ในการสมัครกิจกรรมต่างๆ โดยอัตโนมัติ
          </p>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* ส่งข้อมูลเก่า (profile) เข้าไปในฟอร์ม */}
            <EditProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}