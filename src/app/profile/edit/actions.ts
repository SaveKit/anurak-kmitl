'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// สร้าง Schema ตรวจสอบข้อมูล (Validation)
const profileSchema = z.object({
  title: z.string().min(1, "กรุณาเลือกคำนำหน้า"),
  full_name: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
  student_id: z.string().length(8, "รหัสนักศึกษาต้องมี 8 หลัก"),
  phone_number: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  faculty: z.string().min(1, "กรุณาเลือกคณะ"),
  major: z.string().min(1, "กรุณากรอกสาขาวิชา"),
  admission_year: z.coerce.number().min(2500, "ปีการศึกษาไม่ถูกต้อง").max(3000),
})

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { message: 'Unauthorized' }

  // ดึงค่าจากฟอร์มให้ครบ
  const rawData = {
    title: formData.get('title'),
    full_name: formData.get('full_name'),
    nickname: formData.get('nickname'),
    student_id: formData.get('student_id'),
    phone_number: formData.get('phone_number'),
    faculty: formData.get('faculty'),
    major: formData.get('major'),
    admission_year: formData.get('admission_year'),
  }

  const validatedFields = profileSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
    }
  }

  // บันทึกลง Database
  const { error } = await supabase
    .from('profiles')
    .update({
      ...validatedFields.data, // ใช้ spread operator เทข้อมูลลงไปเลย
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error(error)
    return { message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
  }

  revalidatePath('/')
  redirect('/')
}