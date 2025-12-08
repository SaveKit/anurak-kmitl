import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { EditProfileForm } from './form'

// รับ searchParams เพื่อดูว่าถูกดีดมาแบบ first_time หรือไม่
export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // รอรับค่า params (Next.js 15 ต้อง await)
  const params = await searchParams
  const isFirstTime = params.first_time === 'true'

  return (
    <div className="min-h-screen bg-nature-50 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-nature opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-kmitl opacity-10 rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-8 text-center">
          {isFirstTime ? (
            // แสดงข้อความต้อนรับสำหรับสมาชิกใหม่
            <>
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-3xl">
                👋
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ยินดีต้อนรับสมาชิกใหม่!</h1>
              <p className="mt-2 text-lg text-gray-600">
                กรุณากรอกข้อมูลส่วนตัวเบื้องต้นให้ครบถ้วน<br/>เพื่อเริ่มใช้งานระบบและสมัครกิจกรรมครับ
              </p>
            </>
          ) : (
            // ข้อความปกติสำหรับคนมาแก้ไขเอง
            <>
              <h1 className="text-3xl font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h1>
              <p className="mt-2 text-sm text-gray-600">
                ข้อมูลที่ถูกต้องจะช่วยให้การสมัครกิจกรรมรวดเร็วขึ้น
              </p>
            </>
          )}
        </div>
        
        <div className="bg-white/80 backdrop-blur-md shadow-xl sm:rounded-2xl border border-white/20">
          <div className="px-4 py-8 sm:p-8">
            <EditProfileForm profile={profile} />
          </div>
        </div>

      </div>
    </div>
  )
}