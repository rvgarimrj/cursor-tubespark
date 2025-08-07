import { NextRequest, NextResponse } from 'next/server';
import { IdeasService } from '@/lib/supabase/ideas';
import { VideoIdea } from '@/types/ideas';
import { stackServerApp } from '@/lib/auth/server';
import { getErrorMessages } from '@/lib/i18n/server-translations';

export async function POST(request: NextRequest) {
  console.log("\n🔥 [FAVORITES API] Request received at", new Date().toISOString());
  
  try {
    // Get user from Stack Auth
    console.log("🔐 [FAVORITES API] Getting user from Stack Auth...");
    const user = await stackServerApp.getUser();
    if (!user) {
      console.log("❌ [FAVORITES API] No user found - unauthorized");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log("✅ [FAVORITES API] User authenticated:", user.id);

    const body = await request.json();
    console.log("📦 [FAVORITES API] Request body:", JSON.stringify(body, null, 2));
    
    const { idea }: { idea: VideoIdea } = body;

    if (!idea) {
      console.log("❌ [FAVORITES API] Missing idea data");
      return NextResponse.json({ error: 'Missing idea data' }, { status: 400 });
    }
    
    console.log("💡 [FAVORITES API] Processing idea:", {
      id: idea.id,
      title: idea.title?.substring(0, 50) + "...",
      isFavorite: idea.isFavorite
    });

    // Check if idea already exists for this user
    console.log("🔍 [FAVORITES API] Checking if idea already exists by title...");
    const existingIdea = await IdeasService.getIdeaByTitle(idea.title, user.id);
    
    if (existingIdea) {
      console.log("✅ [FAVORITES API] Existing idea found:", {
        id: existingIdea.id,
        currentFavorite: existingIdea.isFavorite
      });
      
      console.log("🔄 [FAVORITES API] Toggling favorite status...");
      const updatedIdea = await IdeasService.toggleFavorite(existingIdea.id, user.id);
      
      console.log("✅ [FAVORITES API] Favorite toggled successfully:", {
        id: updatedIdea.id,
        newFavorite: updatedIdea.isFavorite
      });
      
      return NextResponse.json({
        success: true,
        idea: updatedIdea,
        isFavorite: updatedIdea.isFavorite,
        message: 'Idea favorite status updated'
      });
    }

    console.log("📝 [FAVORITES API] No existing idea found, creating new one...");
    
    // Check user usage limits for new ideas
    console.log("🔢 [FAVORITES API] Checking user usage limits...");
    const usage = await IdeasService.getUserUsage(user.id);
    console.log("📊 [FAVORITES API] Usage:", usage);
    
    if (usage.used >= usage.limit) {
      console.log("❌ [FAVORITES API] Usage limit exceeded");
      const errorMessages = getErrorMessages();
      return NextResponse.json(
        { 
          error: errorMessages.usageExceeded.message,
          errorType: 'USAGE_LIMIT_EXCEEDED',
          errorDetails: errorMessages.usageExceeded
        },
        { status: 429 }
      );
    }

    console.log("💾 [FAVORITES API] Saving new idea to database...");
    const savedIdea = await IdeasService.saveIdea(idea, user.id, {
      email: user.primaryEmail || user.primaryEmailAddress,
      displayName: user.displayName || user.clientMetadata?.name || 'User'
    });
    console.log("✅ [FAVORITES API] Idea saved:", savedIdea.id);
    
    console.log("⭐ [FAVORITES API] Setting as favorite...");
    const favoritedIdea = await IdeasService.toggleFavorite(savedIdea.id, user.id);
    console.log("✅ [FAVORITES API] Favorited successfully:", {
      id: favoritedIdea.id,
      isFavorite: favoritedIdea.isFavorite
    });

    return NextResponse.json({
      success: true,
      idea: favoritedIdea,
      isFavorite: true,
      message: 'Idea saved and favorited successfully'
    });

  } catch (error) {
    console.error('❌ [FAVORITES API] Critical error:', error);
    console.error('❌ [FAVORITES API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Failed to save and favorite idea',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}