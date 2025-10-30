export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type InterviewDate = {
  label: string;
  date: string;
};

export interface Database {
  public: {
    Tables: {
      interview_experiences: {
        Row: {
          id: string;
          student_name: string;
          linkedin_url: string;
          company: string;
          position: string;
          interview_dates: InterviewDate[];
          phone_screens: number;
          technical_interviews: number;
          behavioral_interviews: number;
          other_interviews: number;
          interview_questions: string;
          advice_tips: string;
          status: "pending" | "approved" | "rejected";
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          linkedin_url: string;
          company: string;
          position: string;
          interview_dates?: InterviewDate[];
          phone_screens?: number;
          technical_interviews?: number;
          behavioral_interviews?: number;
          other_interviews?: number;
          interview_questions: string;
          advice_tips: string;
          status?: "pending" | "approved" | "rejected";
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_name?: string;
          linkedin_url?: string;
          company?: string;
          position?: string;
          interview_dates?: InterviewDate[];
          phone_screens?: number;
          technical_interviews?: number;
          behavioral_interviews?: number;
          other_interviews?: number;
          interview_questions?: string;
          advice_tips?: string;
          status?: "pending" | "approved" | "rejected";
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
