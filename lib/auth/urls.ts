import { Locale } from '@/lib/i18n/config';

export function getAuthUrls(locale: Locale = 'pt') {
  return {
    signIn: `/${locale}/auth/signin`,
    signUp: `/${locale}/auth/signup`,
    afterSignIn: `/${locale}/dashboard`,
    afterSignUp: `/${locale}/dashboard`,
    afterSignOut: `/${locale}`,
    home: `/${locale}/dashboard`,
    forgotPassword: `/${locale}/auth/forgot-password`,
    passwordReset: `/${locale}/auth/reset-password`,
  };
}

// Default URLs for initial setup (will be overridden by dynamic ones)
export const defaultAuthUrls = getAuthUrls('pt');