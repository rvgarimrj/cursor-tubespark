import { getTranslations } from 'next-intl/server';
import { PricingSection } from './PricingSection';

export async function PricingSectionServer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  
  // Pass the translations as props to the client component
  const translations = {
    title: t('title'),
    titleHighlight: t('titleHighlight'),
    subtitle: t('subtitle'),
    billing: {
      annual: t('billing.annual'),
      monthly: t('billing.monthly')
    },
    bestOffer: t('bestOffer'),
    perYear: t('perYear'),
    freeForever: t('freeForever'),
    nextYear: t('nextYear'),
    annualDiscount: t('annualDiscount'),
    cancelAnytime: t('cancelAnytime'),
    current: t('current'),
    subscribe: t('subscribe'),
    yearly: t('yearly'),
    monthly: t('monthly'),
    creditsPerMonth: t('creditsPerMonth'),
    per100Credits: t('per100Credits'),
    perMonth: t('perMonth'),
    billedAnnually: t('billedAnnually'),
    features: {
      get_credits_monthly_by_logging_in: t('features.get_credits_monthly_by_logging_in'),
      try_member_only_features_monthly_by_logging_in: t('features.try_member_only_features_monthly_by_logging_in'),
      fast_track_generation: t('features.fast_track_generation'),
      professional_mode_for_videos: t('features.professional_mode_for_videos'),
      watermark_removal: t('features.watermark_removal'),
      video_extension: t('features.video_extension'),
      image_upscaling: t('features.image_upscaling'),
      priority_access_to_new_features: t('features.priority_access_to_new_features')
    },
    plans: {
      freemium: {
        name: t('plans.freemium.name'),
        price: t('plans.freemium.price'),
        perfectFor: t('plans.freemium.perfectFor'),
        features: t.raw('plans.freemium.features'),
        blockedFeatures: t.raw('plans.freemium.blockedFeatures')
      },
      starter: {
        name: t('plans.starter.name'),
        price: t('plans.starter.price'),
        annualPrice: t('plans.starter.annualPrice'),
        discount: t('plans.starter.discount'),
        perfectFor: t('plans.starter.perfectFor'),
        features: t.raw('plans.starter.features'),
        blockedFeatures: t.raw('plans.starter.blockedFeatures')
      },
      pro: {
        name: t('plans.pro.name'),
        price: t('plans.pro.price'),
        annualPrice: t('plans.pro.annualPrice'),
        discount: t('plans.pro.discount'),
        perfectFor: t('plans.pro.perfectFor'),
        features: t.raw('plans.pro.features'),
        fairUse: t('plans.pro.fairUse')
      }
    }
  };
  
  return <PricingSection translations={translations} locale={locale} />;
}