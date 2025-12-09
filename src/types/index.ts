// src/types/index.ts

export interface Profile {
  id: string;
  updated_at: string | null;
  avatar_url: string | null;

  title: string | null;
  full_name: string | null;
  nickname: string | null;
  student_id: string | null;
  phone_number: string | null;
  faculty: string | null;
  major: string | null;
  admission_year: number | null;

  xp_total: number;
  role: string;
}
