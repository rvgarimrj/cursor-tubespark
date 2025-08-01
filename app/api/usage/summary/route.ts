import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserUsageSummary } from '@/lib/billing/limits';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Get comprehensive usage summary
    const usageSummary = await getUserUsageSummary(user.id);

    if (!usageSummary) {
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch usage summary' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      usage: usageSummary
    });

  } catch (error) {
    console.error('Error fetching usage summary:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}