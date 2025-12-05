'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// 1. สร้าง Schema ตรวจสอบข้อมูล (Validation)
const profileSchema = z.object({
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
  phone_number: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  faculty: z.string().min(1, "กรุณาระบุคณะ"),
  major: z.string().min(1, "กรุณาระบุสาขา"),
  admission_year: z.coerce.number().min(2500, "ปีการศึกษาไม่ถูกต้อง").max(3000),
})

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // เช็คว่า User คือใคร
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { message: 'Unauthorized' }

  // แปลง FormData เป็น Object
  const rawData = {
    nickname: formData.get('nickname'),
    phone_number: formData.get('phone_number'),
    faculty: formData.get('faculty'),
    major: formData.get('major'),
    admission_year: formData.get('admission_year'),
  }

  // ตรวจสอบความถูกต้องด้วย Zod
  const validatedFields = profileSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
    }
  }

  // อัปเดตลง Database
  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: validatedFields.data.nickname,
      phone_number: validatedFields.data.phone_number,
      faculty: validatedFields.data.faculty,
      major: validatedFields.data.major,
      admission_year: validatedFields.data.admission_year,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
  }

  revalidatePath('/') // รีเฟรชข้อมูลหน้าแรก
  redirect('/') // บันทึกเสร็จดีดกลับไปหน้า Dashboard
}