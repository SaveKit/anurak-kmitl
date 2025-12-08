import { redirect } from "next/navigation";

// กำหนดว่า field ไหนบ้างที่ "จำเป็นต้องมี"
export function checkProfileCompleteness(profile: any) {
  if (!profile) return false;

  // รายการข้อมูลที่ห้ามเป็นค่าว่าง
  const requiredFields = [
    profile.title,
    profile.full_name,
    profile.nickname,
    profile.student_id,
    profile.phone_number,
    profile.faculty,
    profile.major,
    profile.admission_year,
  ];

  // ถ้ามีอันไหนเป็น null หรือ empty string ให้ถือว่า "ไม่ครบ"
  const isComplete = requiredFields.every(
    (field) => field && field.toString().trim() !== ""
  );

  return isComplete;
}

export function enforceProfileCompletion(profile: any) {
  if (!checkProfileCompleteness(profile)) {
    // ถ้าไม่ครบ ให้ดีดไปหน้า Edit พร้อมแนบ query param ไปบอกด้วย
    redirect("/profile/edit?first_time=true");
  }
}
