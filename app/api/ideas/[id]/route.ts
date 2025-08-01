import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/supabase/ideas';
import { stackServerApp } from '@/lib/auth/stack-auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from Stack Auth
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ideaId = params.id;

    // Delete idea from database
    await IdeasService.deleteIdea(ideaId, user.id);

    return NextResponse.json({
      success: true,
      message: 'Idea deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting idea:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete idea',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}