import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword') || '';
    const company = searchParams.get('company') || '';

    let query = supabase
      .from('interview_experiences')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Apply company filter if provided
    if (company) {
      query = query.ilike('company', `%${company}%`);
    }

    // Apply keyword search if provided
    if (keyword) {
      // Search in interview_questions, advice_tips, position, and company
      query = query.or(
        `interview_questions.ilike.%${keyword}%,advice_tips.ilike.%${keyword}%,position.ilike.%${keyword}%,company.ilike.%${keyword}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experiences' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
