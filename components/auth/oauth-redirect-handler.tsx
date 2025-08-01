"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@stackframe/stack';
import { Locale } from '@/lib/i18n/config';

export function OAuthRedirectHandler() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      // Check if we have a stored locale from OAuth flow
      const storedLocale = localStorage.getItem('tubespark-oauth-locale') as Locale;
      
      if (storedLocale) {
        // Clear the stored locale
        localStorage.removeItem('tubespark-oauth-locale');
        
        // Redirect to dashboard with correct locale
        console.log('OAuth success: redirecting to', `/${storedLocale}/dashboard`);
        router.push(`/${storedLocale}/dashboard`);
      }
    }
  }, [user, router]);

  return null; // This component doesn't render anything
}