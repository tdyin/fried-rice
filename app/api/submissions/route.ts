import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const interviewDateSchema = z.object({
  label: z.string(),
  date: z.string(),
});

const submissionSchema = z.object({
  student_name: z.string().min(1, "Student name is required"),
  linkedin_url: z
    .url("Must be a valid LinkedIn URL")
    .refine((url) => url.includes("linkedin.com"), "Must be a LinkedIn URL"),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  interview_dates: z.array(interviewDateSchema).default([]),
  phone_screens: z.number().min(0).default(0),
  technical_interviews: z.number().min(0).default(0),
  behavioral_interviews: z.number().min(0).default(0),
  other_interviews: z.number().min(0).default(0),
  interview_questions: z
    .string()
    .min(10, "Please provide interview questions (minimum 10 characters)"),
  advice_tips: z
    .string()
    .min(10, "Please provide advice/tips (minimum 10 characters)"),
  is_anonymous: z.boolean().default(false),
  consent_given: z
    .boolean()
    .refine((val) => val === true, "You must give consent to proceed"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = submissionSchema.parse(body);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { consent_given, ...dataToInsert } = validatedData;

    const { data, error } = await supabase
      .from("interview_experiences")
      .insert([
        {
          ...dataToInsert,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit experience" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Submission successful! Your entry will be reviewed before being published.",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error submitting experience:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
