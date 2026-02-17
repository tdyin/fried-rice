import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Maximum execution time in seconds

// This endpoint runs daily to check database health
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {} as Record<string, any>,
    };

    // 1. Check database connectivity
    const { data: pingData, error: pingError } = await supabase
      .from('interview_experiences')
      .select('count')
      .limit(1);

    checks.checks.connectivity = {
      status: pingError ? 'failed' : 'passed',
      error: pingError?.message,
    };

    // 2. Count total submissions
    const { count: totalCount, error: countError } = await supabase
      .from('interview_experiences')
      .select('*', { count: 'exact', head: true });

    checks.checks.totalSubmissions = {
      status: countError ? 'failed' : 'passed',
      count: totalCount,
      error: countError?.message,
    };

    // Determine overall status
    const failedChecks = Object.values(checks.checks).filter(
      (check: any) => check.status === 'failed'
    );

    if (failedChecks.length > 0) {
      checks.status = 'unhealthy';
    }

    // Log results (these will appear in Vercel logs)
    console.log('Daily Database Check Results:', JSON.stringify(checks, null, 2));

    if (checks.status === 'unhealthy') {
      console.error('⚠️ Database health check failed:', failedChecks);
    }

    return NextResponse.json({
      success: true,
      ...checks,
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
