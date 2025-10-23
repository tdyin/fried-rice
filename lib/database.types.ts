export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      interview_experiences: {
        Row: {
          id: string
          student_name: string
          linkedin_url: string
          company: string
          position: string
          applied_date: string | null
          interviewed_date: string | null
          result_date: string | null
          phone_screens: number
          technical_interviews: number
          behavioral_interviews: number
          other_interviews: number
          interview_questions: string
          advice_tips: string
          consent_given: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_name: string
          linkedin_url: string
          company: string
          position: string
          applied_date?: string | null
          interviewed_date?: string | null
          result_date?: string | null
          phone_screens?: number
          technical_interviews?: number
          behavioral_interviews?: number
          other_interviews?: number
          interview_questions: string
          advice_tips: string
          consent_given: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_name?: string
          linkedin_url?: string
          company?: string
          position?: string
          applied_date?: string | null
          interviewed_date?: string | null
          result_date?: string | null
          phone_screens?: number
          technical_interviews?: number
          behavioral_interviews?: number
          other_interviews?: number
          interview_questions?: string
          advice_tips?: string
          consent_given?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
