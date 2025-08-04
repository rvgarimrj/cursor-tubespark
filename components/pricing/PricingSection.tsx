"use client";

import { useState } from "react";
import { Check, Star, Zap } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  id: string;
  name: string;
  isFree: boolean;
  isBestOffer?: boolean;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  credits: number;
  costPer100Credits: number;
  features: string[];
}

const PRICING_DATA = {
  'pt': {
    currency: 'R$',
    plans: [
      {
        id: 'freemium',
        name: 'Gratuito',
        isFree: true,
        monthlyPrice: 0,
        annualPrice: 0,
        credits: 0,
        costPer100Credits: 0,
        features: [
          'get_credits_monthly_by_logging_in',
          'try_member_only_features_monthly_by_logging_in'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        isFree: false,
        monthlyPrice: 47,
        annualPrice: 470,
        credits: 100,
        costPer100Credits: 47,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        isFree: false,
        isBestOffer: true,
        monthlyPrice: 97,
        annualPrice: 970,
        credits: 300,
        costPer100Credits: 32.33,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling',
          'priority_access_to_new_features'
        ]
      }
    ]
  },
  'en': {
    currency: '$',
    plans: [
      {
        id: 'freemium',
        name: 'Free',
        isFree: true,
        monthlyPrice: 0,
        annualPrice: 0,
        credits: 0,
        costPer100Credits: 0,
        features: [
          'get_credits_monthly_by_logging_in',
          'try_member_only_features_monthly_by_logging_in'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        isFree: false,
        monthlyPrice: 12,
        annualPrice: 120,
        credits: 100,
        costPer100Credits: 12,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        isFree: false,
        isBestOffer: true,
        monthlyPrice: 24,
        annualPrice: 240,
        credits: 300,
        costPer100Credits: 8,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling',
          'priority_access_to_new_features'
        ]
      }
    ]
  },
  'es': {
    currency: '€',
    plans: [
      {
        id: 'freemium',
        name: 'Gratuito',
        isFree: true,
        monthlyPrice: 0,
        annualPrice: 0,
        credits: 0,
        costPer100Credits: 0,
        features: [
          'get_credits_monthly_by_logging_in',
          'try_member_only_features_monthly_by_logging_in'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        isFree: false,
        monthlyPrice: 11,
        annualPrice: 110,
        credits: 100,
        costPer100Credits: 11,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        isFree: false,
        isBestOffer: true,
        monthlyPrice: 22,
        annualPrice: 220,
        credits: 300,
        costPer100Credits: 7.33,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling',
          'priority_access_to_new_features'
        ]
      }
    ]
  },
  'fr': {
    currency: '€',
    plans: [
      {
        id: 'freemium',
        name: 'Gratuit',
        isFree: true,
        monthlyPrice: 0,
        annualPrice: 0,
        credits: 0,
        costPer100Credits: 0,
        features: [
          'get_credits_monthly_by_logging_in',
          'try_member_only_features_monthly_by_logging_in'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        isFree: false,
        monthlyPrice: 11,
        annualPrice: 110,
        credits: 100,
        costPer100Credits: 11,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        isFree: false,
        isBestOffer: true,
        monthlyPrice: 22,
        annualPrice: 220,
        credits: 300,
        costPer100Credits: 7.33,
        features: [
          'fast_track_generation',
          'professional_mode_for_videos',
          'watermark_removal',
          'video_extension',
          'image_upscaling',
          'priority_access_to_new_features'
        ]
      }
    ]
  }
};

interface TranslationsProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
  billing: {
    annual: string;
    monthly: string;
  };
  bestOffer: string;
  perYear: string;
  freeForever: string;
  nextYear: string;
  annualDiscount: string;
  cancelAnytime: string;
  current: string;
  subscribe: string;
  yearly: string;
  monthly: string;
  creditsPerMonth: string;
  per100Credits: string;
  features: {
    get_credits_monthly_by_logging_in: string;
    try_member_only_features_monthly_by_logging_in: string;
    fast_track_generation: string;
    professional_mode_for_videos: string;
    watermark_removal: string;
    video_extension: string;
    image_upscaling: string;
    priority_access_to_new_features: string;
  };
}

export function PricingSection({ translations, locale }: { translations: TranslationsProps; locale: string }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const t = translations;
  
  const pricingData = PRICING_DATA[locale as keyof typeof PRICING_DATA] || PRICING_DATA['en'];
  const { currency, plans } = pricingData;

  const formatPrice = (price: number) => {
    if (price === 0) return '0';
    return price.toLocaleString(locale === 'pt' ? 'pt-BR' : locale === 'en' ? 'en-US' : 'es-ES', {
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  };

  const getDisplayPrice = (plan: any) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice * 12;
  };

  const getMonthlyPrice = (plan: any) => {
    return isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;
  };

  return (
    <section id="precos" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">{t.title}</span><br />
            <span className="gradient-text">{t.titleHighlight}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            {t.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setIsAnnual(true)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  isAnnual
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{t.billing.annual}</span>
                <span className="text-green-400 text-sm font-bold">-17%</span>
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  !isAnnual
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{t.billing.monthly}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-gray-800 border rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                plan.isBestOffer
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20'
                  : plan.isFree
                  ? 'border-gray-700'
                  : index === 1
                  ? 'border-orange-500/50'
                  : 'border-blue-500/50'
              }`}
            >
              {/* Best Offer Badge */}
              {plan.isBestOffer && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{t.bestOffer}</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                
                {plan.isFree ? (
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-white">
                      {currency} 0
                    </div>
                    <div className="text-gray-400 mt-2">
                      {t.perYear}
                    </div>
                    <div className="text-gray-500 text-sm mt-2">
                      {t.freeForever}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-white mb-2">
                      {currency} {formatPrice(getDisplayPrice(plan))}
                    </div>
                    <div className="text-gray-400">
                      {t.perYear} 
                      {isAnnual && (
                        <span className="text-gray-500 line-through ml-2">
                          {currency}{formatPrice(plan.monthlyPrice * 12)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {t.nextYear}: {currency}{formatPrice(getDisplayPrice(plan))} {isAnnual && t.annualDiscount}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {t.cancelAnytime}
                    </div>
                  </div>
                )}

                {/* Subscribe Button */}
                {plan.isFree ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 bg-gray-600 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    {t.current}
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/auth/signup?plan=${plan.id}&billing=${isAnnual ? 'annual' : 'monthly'}`}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 inline-block text-center ${
                      plan.isBestOffer
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : index === 1
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {t.subscribe} {plan.name} {isAnnual ? t.yearly : t.monthly}
                  </Link>
                )}
              </div>

              {/* Credits and Cost */}
              {!plan.isFree && (
                <div className="mb-6 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {plan.credits} {t.creditsPerMonth}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {currency}{formatPrice(plan.costPer100Credits)} {t.per100Credits}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      {t.features[feature as keyof typeof t.features]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}