import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from './login/actions'

export default async function Home() {
  const supabase = await createClient()

  // 1. เช็ค User จาก Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. ดึงข้อมูล Profile ของ User นี้
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // คำนวณชั้นปี (ตัวอย่าง logic)
  const currentYear = new Date().getFullYear() + 543
  const yearLevel = profile?.admission_year 
    ? `ปี ${currentYear - profile.admission_year + 1}` 
    : 'ยังไม่ระบุชั้นปี'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="text-xl font-bold text-indigo-600">ANURAK KMITL</div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 hidden sm:block">
                สวัสดี, {profile?.full_name}
              </span>
              <form action={signout}>
                <button className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Profile Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center gap-6">
              <img
                className="h-24 w-24 rounded-full bg-gray-200 object-cover ring-4 ring-indigo-50"
                src={profile?.avatar_url || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.full_name}
                </h1>
                <p className="text-sm font-medium text-indigo-600">
                  {profile?.role?.toUpperCase()} • {yearLevel}
                </p>
                <div className="mt-2 flex gap-2 text-sm text-gray-500">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    XP: {profile?.xp_total}
                  </span>
                  <span>{profile?.faculty || 'ยังไม่ระบุคณะ'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <a href="/profile/edit" className="font-medium text-indigo-600 hover:text-indigo-500">
                แก้ไขข้อมูลส่วนตัว <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dashboard Grid (Placeholder สำหรับ Phase ต่อไป) */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Upcoming Events */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">กิจกรรมเร็วๆ นี้</h3>
            <p className="mt-2 text-sm text-gray-500">ยังไม่มีกิจกรรมเปิดรับสมัคร</p>
          </div>

           {/* Card 2: My Tickets */}
           <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">ตั๋วของฉัน</h3>
            <p className="mt-2 text-sm text-gray-500">คุณยังไม่ได้ลงทะเบียนกิจกรรมใดๆ</p>
          </div>
        </div>

      </main>
    </div>
  )
}