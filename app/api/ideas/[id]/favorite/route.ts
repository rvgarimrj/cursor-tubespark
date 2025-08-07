import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/supabase/ideas';
import { stackServerApp } from '@/lib/auth/server';

export async function PATCH(
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

    // Toggle favorite status in database
    const updatedIdea = await IdeasService.toggleFavorite(ideaId, user.id);

    return NextResponse.json({
      success: true,
      idea: updatedIdea,
      isFavorite: updatedIdea.isFavorite
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to toggle favorite',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}