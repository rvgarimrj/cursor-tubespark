import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUserLimits } from '@/lib/billing/limits';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action || !['idea', 'script_basic', 'script_premium', 'api_call'].includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action parameter' 
      }, { status: 400 });
    }

    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Check user limits
    const limits = await checkUserLimits(user.id, action as any);

    return NextResponse.json(limits);

  } catch (error) {
    console.error('Error checking usage limits:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}