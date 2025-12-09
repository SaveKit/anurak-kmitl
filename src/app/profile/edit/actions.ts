"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { type Profile } from "@/types";

export type ProfileState = {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
} | null;

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
});

async function uploadAvatar(file: File, userId: string) {
  const supabase = await createClient();

  // ตั้งชื่อไฟล์: userId-timestamp.นามสกุล
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  // อัปโหลดลง Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true, // ถ้ามีไฟล์เดิมให้เขียนทับ
    });

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    throw new Error("ไม่สามารถอัปโหลดรูปภาพได้");
  }

  // ขอ Public URL เพื่อเอาไปบันทึกลง DB
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return data.publicUrl;
}

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
) {
  const supabase = await createClient();

  // เช็ค User จาก Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { message: "Unauthorized" };

  // จัดการอัปโหลดรูปภาพ (ถ้ามี)
  const avatarFile = formData.get("avatar") as File | null;
  let newAvatarUrl: string | null = null;

  if (avatarFile && avatarFile.size > 0) {
    // เช็คขนาดไฟล์ (เช่น 5MB)
    if (avatarFile.size > 5 * 1024 * 1024) {
      return { message: "รูปภาพต้องมีขนาดไม่เกิน 5MB" };
    }

    try {
      newAvatarUrl = await uploadAvatar(avatarFile, user.id);
    } catch (error) {
      console.error(error);
      return { message: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" };
    }
  }

  // ดึงค่าจากฟอร์มให้ครบ
  const rawData = {
    title: formData.get("title"),
    full_name: formData.get("full_name"),
    nickname: formData.get("nickname"),
    student_id: formData.get("student_id"),
    phone_number: formData.get("phone_number"),
    faculty: formData.get("faculty"),
    major: formData.get("major"),
    admission_year: formData.get("admission_year"),
  };

  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง",
    };
  }

  // เตรียม Object ที่จะบันทึก
  const updateData: Partial<Profile> = {
    ...validatedFields.data,
    updated_at: new Date().toISOString(),
  };

  if (newAvatarUrl) {
    // Case A: ถ้า User อัปโหลดรูปใหม่ -> ใช้รูปใหม่ทันที
    updateData.avatar_url = newAvatarUrl;
  } else {
    // Case B: ถ้าไม่ได้อัปโหลดรูปใหม่ เช็คดูว่ารูปเก่าเป็น ui-avatars ไหม?
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single<Pick<Profile, "avatar_url">>();
    if (
      existingProfile?.avatar_url &&
      existingProfile.avatar_url.startsWith("https://ui-avatars.com/api/")
    ) {
      // สร้าง URL ใหม่จากชื่อใหม่ (Full Name ที่เพิ่ง Validate ผ่าน)
      const encodedNewName = encodeURIComponent(validatedFields.data.full_name);
      updateData.avatar_url = `https://ui-avatars.com/api/?name=${encodedNewName}&background=random`;
    }
    // Case C: ถ้าเป็นรูปจาก Google หรือ Supabase Storage (อัปเอง) ก็ปล่อยไว้เหมือนเดิม ไม่ต้องทำอะไร
  }

  // บันทึกลง Database
  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error(error);
    return { message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }

  revalidatePath("/");
  redirect("/");
}
