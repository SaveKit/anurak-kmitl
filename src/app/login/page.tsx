'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true) // true = Login, false = Signup
  const [loading, setLoading] = useState(false)

  // ฟังก์ชัน Login ด้วย Google
  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nature-50 p-4 relative overflow-hidden">
      
      {/* Background Decor (วงกลมสีเขียว/ส้ม จางๆ ด้านหลัง) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-nature opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-kmitl opacity-10 rounded-full blur-3xl"></div>

      {/* Glass Card Container */}
      <div className="glass w-full max-w-md rounded-3xl p-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            ANURAK <span className="text-kmitl">KMITL</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin ? 'ยินดีต้อนรับกลับสู่ครอบครัวนักอนุรักษ์' : 'ร่วมเป็นส่วนหนึ่งกับเราในการรักษาธรรมชาติ'}
          </p>
        </div>

        {/* Toggle Switch (Login / Sign up) */}
        <div className="flex bg-gray-100/50 p-1 rounded-xl mb-8 relative">
          <div 
            className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[51%]'}`}
          ></div>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${isLogin ? 'text-gray-900' : 'text-gray-500'}`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${!isLogin ? 'text-gray-900' : 'text-gray-500'}`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          {/* ชื่อจริง (โชว์เฉพาะตอน Signup) พร้อม Animation */}
          <div className={`transition-all duration-300 overflow-hidden ${isLogin ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">ชื่อ-นามสกุล</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required={!isLogin}
              placeholder="เช่น สมรักษ์ รักษ์ป่า"
              className="glass-input w-full rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">อีเมลสถาบัน (@kmitl.ac.th)</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="student@kmitl.ac.th"
              className="glass-input w-full rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">รหัสผ่าน</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="glass-input w-full rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              formAction={isLogin ? login : signup}
              className="w-full bg-nature hover:bg-nature-dark text-white font-semibold py-3 rounded-xl shadow-lg shadow-nature/30 transition-all active:scale-95"
            >
              {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/50 px-2 text-gray-500 rounded-lg backdrop-blur-sm">หรือดำเนินการต่อด้วย</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          {loading ? (
             <span className="animate-spin">🌀</span> 
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Google Account
        </button>

      </div>
    </div>
  )
}