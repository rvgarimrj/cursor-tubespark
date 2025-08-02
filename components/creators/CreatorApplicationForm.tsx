"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Eye, 
  Video, 
  Globe,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import type { 
  ChannelAnalysis, 
  CreatorApplicationRequest,
  CreatorApplicationResponse,
  AffiliateTier
} from '@/types/creators';
import { TIER_CONFIG, formatCommissionRate, formatCurrency } from '@/types/creators';

interface CreatorApplicationFormProps {
  onSuccess?: (application: CreatorApplicationResponse['application']) => void;
  onError?: (error: string) => void;
}

export default function CreatorApplicationForm({ onSuccess, onError }: CreatorApplicationFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    channelUrl: '',
    contactEmail: (user as any)?.primaryEmail || (user as any)?.email || '',
    applicationNotes: '',
    agreesToTerms: false
  });

  const [analysis, setAnalysis] = useState<ChannelAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analyzeChannel = useCallback(async (channelUrl: string) => {
    if (!channelUrl.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/creators/analyze-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelUrl: channelUrl.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        setAnalysisError(data.error || 'Failed to analyze channel');
        return;
      }

      setAnalysis(data.analysis);
      
      // Auto-fill contact email if not already set
      const userEmail = (user as any)?.primaryEmail || (user as any)?.email;
      if (!formData.contactEmail && userEmail) {
        setFormData(prev => ({ ...prev, contactEmail: userEmail }));
      }

    } catch (error) {
      setAnalysisError('Network error during channel analysis');
      console.error('Channel analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData.contactEmail, user]);

  const handleChannelUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, channelUrl: value }));
    
    // Auto-analyze when URL looks complete
    if (value.includes('youtube.com/') && value.length > 30) {
      const timer = setTimeout(() => analyzeChannel(value), 1000);
      return () => clearTimeout(timer);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreesToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    if (!analysis) {
      setError('Please enter a valid YouTube channel URL and wait for analysis');
      return;
    }

    if (analysis.subscriberCount < 1000) {
      setError('Your channel needs at least 1,000 subscribers to join our affiliate program');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const applicationData: CreatorApplicationRequest = {
        channelUrl: formData.channelUrl.trim(),
        contactEmail: formData.contactEmail.trim(),
        applicationNotes: formData.applicationNotes.trim(),
        agreesToTerms: formData.agreesToTerms
      };

      const response = await fetch('/api/creators/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const data: CreatorApplicationResponse = await response.json();

      if (!data.success) {
        setError(data.error || 'Application submission failed');
        onError?.(data.error || 'Application submission failed');
        return;
      }

      // Success!
      onSuccess?.(data.application!);

    } catch (error) {
      const errorMessage = 'Network error during application submission';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Application submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierBadgeColor = (tier: AffiliateTier) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Join the TubeSpark Creator Partnership</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Partner with us and earn recurring commissions while helping your audience create better YouTube content.
          Get 20-30% commission for 12+ months on every referral.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Creator Application</CardTitle>
            <CardDescription>
              Tell us about your YouTube channel and join our affiliate program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Channel URL */}
              <div className="space-y-2">
                <Label htmlFor="channelUrl">YouTube Channel URL *</Label>
                <Input
                  id="channelUrl"
                  type="url"
                  placeholder="https://youtube.com/channel/..."
                  value={formData.channelUrl}
                  onChange={(e) => handleChannelUrlChange(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                {isAnalyzing && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing your channel...</span>
                  </div>
                )}
                {analysisError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{analysisError}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Application Notes */}
              <div className="space-y-2">
                <Label htmlFor="applicationNotes">Tell us about yourself (optional)</Label>
                <Textarea
                  id="applicationNotes"
                  placeholder="Tell us about your content style, audience, and why you want to partner with TubeSpark..."
                  value={formData.applicationNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationNotes: e.target.value }))}
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreesToTerms"
                  checked={formData.agreesToTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreesToTerms: checked as boolean }))
                  }
                  disabled={isSubmitting}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="agreesToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the Terms and Conditions *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you agree to our affiliate terms, commission structure, and partnership guidelines.
                  </p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !analysis || !formData.agreesToTerms}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Channel Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Analysis</CardTitle>
            <CardDescription>
              Real-time analysis of your YouTube channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysis && !isAnalyzing && (
              <div className="text-center py-12 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your YouTube channel URL to see real-time analysis</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your channel...</p>
                <Progress value={66} className="w-full mt-4" />
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Channel Overview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{analysis.channelName}</h3>
                    <Badge className={getTierBadgeColor(analysis.suggestedTier)}>
                      {analysis.suggestedTier.toUpperCase()} TIER
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{analysis.subscriberCount.toLocaleString()} subscribers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{analysis.averageViews.toLocaleString()} avg views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>{analysis.totalVideos} videos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{analysis.channelCountry || 'Global'}</span>
                    </div>
                  </div>
                </div>

                {/* Commission Details */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Your Commission Structure</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700 font-medium">Commission Rate:</span>
                      <div className="text-xl font-bold text-green-800">
                        {formatCommissionRate(analysis.commissionRate)}
                      </div>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Duration:</span>
                      <div className="text-xl font-bold text-green-800">
                        {analysis.suggestedTier === 'gold' ? 'Lifetime' : `${TIER_CONFIG[analysis.suggestedTier].commission_duration} months`}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="text-xs text-green-700">
                      <strong>Example:</strong> If you refer someone who pays $29.99/month, 
                      you'll earn <strong>{formatCurrency(29.99 * analysis.commissionRate)}/month</strong> for the commission period.
                    </div>
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Performance Analysis</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Overall Score</span>
                      <span className="font-semibold">{Math.round(analysis.analysis.overall_score)}/100</span>
                    </div>
                    <Progress value={analysis.analysis.overall_score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between">
                        <span>Content Quality</span>
                        <span>{analysis.analysis.content_quality_score}/100</span>
                      </div>
                      <Progress value={analysis.analysis.content_quality_score} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Engagement</span>
                        <span>{analysis.analysis.engagement_rate}%</span>
                      </div>
                      <Progress value={analysis.analysis.engagement_rate * 10} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {analysis.analysis.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Channel Strengths</span>
                    </h4>
                    <ul className="space-y-1">
                      {analysis.analysis.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Eligibility Check */}
                <div className={`p-3 rounded-lg border ${
                  analysis.subscriberCount >= 1000 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {analysis.subscriberCount >= 1000 ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Eligible for Partnership!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-800">Not Yet Eligible</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {analysis.subscriberCount >= 1000 
                      ? 'Your channel meets our minimum requirements. Submit your application to get started!'
                      : `You need ${(1000 - analysis.subscriberCount).toLocaleString()} more subscribers to be eligible.`
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Benefits</CardTitle>
          <CardDescription>What you get when you join the TubeSpark Creator Partnership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Recurring Commissions</h3>
              <p className="text-sm text-muted-foreground">
                Earn 20-30% commission on every referral for 12+ months (lifetime for Gold tier)
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Performance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Real-time dashboard with earnings, conversions, and performance metrics
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Creator Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated support, marketing materials, and content collaboration opportunities
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}