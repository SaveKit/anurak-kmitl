'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// กำหนด Type ของการตอบกลับ
type AuthState = {
  message?: string
  success?: boolean
} | null

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login Error:', error.message)
    // ⚠️ คืนค่า Error กลับไปหน้าเว็บแทนการ Redirect
    return { 
      message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่ หรือสมัครสมาชิกหากยังไม่มีบัญชี',
      success: false 
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_url: `https://ui-avatars.com/api/?name=${fullName}&background=random`,
      },
    },
  })

  if (error) {
    console.error('Signup Error:', error.message)
    return { 
      message: 'ไม่สามารถสมัครสมาชิกได้ (อีเมลนี้อาจถูกใช้งานแล้ว)',
      success: false 
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}