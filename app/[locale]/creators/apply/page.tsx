'use client';

import { Suspense } from 'react';
import CreatorApplicationForm from '@/components/creators/CreatorApplicationForm';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading creator application...</p>
      </div>
    </div>
  );
}

export default function CreatorApplicationPage() {
  const handleApplicationSuccess = (application: any) => {
    // Handle successful application submission
    console.log('Application submitted successfully:', application);
    
    // You could redirect to a success page or show a success message
    // For now, we'll just log it
  };

  const handleApplicationError = (error: string) => {
    // Handle application error
    console.error('Application error:', error);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <CreatorApplicationForm
          onSuccess={handleApplicationSuccess}
          onError={handleApplicationError}
        />
      </Suspense>
    </div>
  );
}