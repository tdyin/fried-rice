import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Database, InterviewDate } from "@/lib/database.types";

type InterviewExperience = Database['public']['Tables']['interview_experiences']['Row'];

// Simple admin authentication middleware
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('interview_experiences')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data for export' },
        { status: 500 }
      );
    }

    // Convert to CSV
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data to export' },
        { status: 404 }
      );
    }

    const headers = [
      "ID",
      "Student Name",
      "LinkedIn URL",
      "Company",
      "Position",
      "Interview Dates",
      "Phone Screens",
      "Technical Interviews",
      "Behavioral Interviews",
      "Other Interviews",
      "Interview Questions",
      "Advice/Tips",
      "Status",
      "Created At",
    ];

    const csvRows = [
      headers.join(","),
      ...data.map((row: InterviewExperience) =>
        [
          row.id,
          `"${row.student_name.replace(/"/g, '""')}"`,
          `"${row.linkedin_url}"`,
          `"${row.company.replace(/"/g, '""')}"`,
          `"${row.position.replace(/"/g, '""')}"`,
          `"${row.interview_dates
            .map((d: InterviewDate) => `${d.label}: ${d.date}`)
            .join("; ")}"`,
          row.phone_screens,
          row.technical_interviews,
          row.behavioral_interviews,
          row.other_interviews,
          `"${row.interview_questions.replace(/"/g, '""')}"`,
          `"${row.advice_tips.replace(/"/g, '""')}"`,
          row.status,
          row.created_at,
        ].join(",")
      ),
    ];

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="interview-experiences-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
