// App Configuration
export const APP_CONFIG = {
  name: "TubeSpark",
  description: "AI Video Idea Generator for YouTubers",
  url: "https://tubespark.ai",
  version: "1.0.0",
} as const;

// API Configuration
export const API_CONFIG = {
  youtube: {
    baseUrl: "https://www.googleapis.com/youtube/v3",
    analyticsUrl: "https://youtubeanalytics.googleapis.com/v2",
    scopes: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
    quotaCosts: {
      search: 100,
      channels: 1,
      videos: 1,
      playlists: 1,
      analytics: 1,
    },
    dailyQuota: 10000,
  },
  ai: {
    providers: {
      openai: {
        baseUrl: "https://api.openai.com/v1",
        models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
        defaultModel: "gpt-4-turbo",
      },
      anthropic: {
        baseUrl: "https://api.anthropic.com/v1",
        models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
        defaultModel: "claude-3-sonnet",
      },
      groq: {
        baseUrl: "https://api.groq.com/openai/v1",
        models: ["mixtral-8x7b-32768", "llama2-70b-4096"],
        defaultModel: "mixtral-8x7b-32768",
      },
    },
    defaultProvider: "openai",
    temperature: 0.7,
    maxTokens: 2000,
  },
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  free: {
    name: "Free",
    price: 0,
    currency: "USD",
    interval: "month",
    features: [
      "10 video ideas per month",
      "Basic trend analysis",
      "SEO suggestions",
      "Email support",
    ],
    limits: {
      ideasPerMonth: 10,
      apiCallsPerDay: 50,
      channelAnalysis: false,
      competitorAnalysis: false,
      advancedAnalytics: false,
    },
  },
  pro: {
    name: "Pro",
    price: 29,
    currency: "USD",
    interval: "month",
    features: [
      "Unlimited video ideas",
      "Advanced trend analysis",
      "Competitor analysis",
      "Channel analytics",
      "Content calendar",
      "Priority support",
    ],
    limits: {
      ideasPerMonth: -1, // unlimited
      apiCallsPerDay: 1000,
      channelAnalysis: true,
      competitorAnalysis: true,
      advancedAnalytics: true,
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    currency: "USD",
    interval: "month",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "API access",
      "White-label options",
      "Dedicated support",
      "Custom integrations",
    ],
    limits: {
      ideasPerMonth: -1,
      apiCallsPerDay: 10000,
      channelAnalysis: true,
      competitorAnalysis: true,
      advancedAnalytics: true,
    },
  },
} as const;

// Content Categories
export const CONTENT_CATEGORIES = [
  "Gaming",
  "Education",
  "Entertainment",
  "Technology",
  "Lifestyle",
  "Beauty & Fashion",
  "Food & Cooking",
  "Travel",
  "Music",
  "Sports",
  "News & Politics",
  "Science",
  "Health & Fitness",
  "DIY & Crafts",
  "Business",
  "Finance",
  "Automotive",
  "Pets & Animals",
  "Comedy",
  "Reviews",
] as const;

// Content Styles
export const CONTENT_STYLES = [
  {
    value: "educational",
    label: "Educational",
    description: "Teach and inform your audience",
  },
  {
    value: "entertainment",
    label: "Entertainment",
    description: "Fun and engaging content",
  },
  {
    value: "review",
    label: "Review",
    description: "Product or service reviews",
  },
  {
    value: "vlog",
    label: "Vlog",
    description: "Personal vlogs and life updates",
  },
  {
    value: "tutorial",
    label: "Tutorial",
    description: "Step-by-step how-to guides",
  },
  { value: "news", label: "News", description: "Current events and updates" },
] as const;

// Duration Preferences
export const DURATION_PREFERENCES = [
  {
    value: "shorts",
    label: "Shorts (<60s)",
    description: "Quick, snackable content",
  },
  {
    value: "medium",
    label: "Medium (1-10min)",
    description: "Standard video length",
  },
  {
    value: "long",
    label: "Long (10min+)",
    description: "In-depth, detailed content",
  },
] as const;

// Target Audiences
export const TARGET_AUDIENCES = [
  "Kids (2-12)",
  "Teens (13-17)",
  "Young Adults (18-24)",
  "Adults (25-34)",
  "Middle-aged (35-54)",
  "Seniors (55+)",
  "General Audience",
  "Professionals",
  "Students",
  "Parents",
  "Entrepreneurs",
  "Hobbyists",
] as const;

// Trending Topic Sources
export const TREND_SOURCES = {
  youtube: {
    trending:
      "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular",
    search: "https://www.googleapis.com/youtube/v3/search",
  },
  google: {
    trends: "https://trends.googleapis.com/v1beta",
  },
  twitter: {
    trends: "https://api.twitter.com/1.1/trends",
  },
} as const;

// SEO Keywords
export const SEO_KEYWORDS = {
  high_volume: [
    "how to",
    "tutorial",
    "review",
    "best",
    "top 10",
    "guide",
    "tips",
    "tricks",
    "vs",
    "unboxing",
  ],
  trending: [
    "latest",
    "new",
    "2025",
    "trending",
    "viral",
    "popular",
    "breaking",
    "update",
  ],
  emotional: [
    "amazing",
    "incredible",
    "shocking",
    "surprising",
    "unbelievable",
    "mind-blowing",
    "epic",
    "insane",
  ],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  auth: {
    unauthorized: "You must be logged in to access this feature",
    forbidden: "You do not have permission to perform this action",
    invalidCredentials: "Invalid email or password",
    accountNotFound: "Account not found",
    emailAlreadyExists: "An account with this email already exists",
  },
  youtube: {
    apiQuotaExceeded: "YouTube API quota exceeded. Please try again later",
    channelNotFound: "YouTube channel not found",
    accessTokenExpired:
      "YouTube access token expired. Please reconnect your account",
    invalidChannelId: "Invalid YouTube channel ID",
  },
  ai: {
    generationFailed: "Failed to generate video ideas. Please try again",
    providerError: "AI provider is currently unavailable",
    rateLimitExceeded:
      "Rate limit exceeded. Please wait before making another request",
    invalidPrompt: "Invalid prompt provided",
  },
  general: {
    serverError: "An unexpected error occurred. Please try again later",
    networkError: "Network error. Please check your connection",
    validationError: "Please check your input and try again",
    notFound: "The requested resource was not found",
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  auth: {
    signInSuccess: "Successfully signed in",
    signUpSuccess: "Account created successfully",
    signOutSuccess: "Successfully signed out",
    passwordReset: "Password reset email sent",
  },
  youtube: {
    channelConnected: "YouTube channel connected successfully",
    channelDisconnected: "YouTube channel disconnected",
    dataRefreshed: "Channel data refreshed successfully",
  },
  ideas: {
    generated: "Video ideas generated successfully",
    saved: "Video idea saved successfully",
    deleted: "Video idea deleted successfully",
    updated: "Video idea updated successfully",
  },
} as const;

// Routes
export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  ideas: "/ideas",
  calendar: "/calendar",
  analytics: "/analytics",
  settings: "/settings",
  billing: "/billing",
  auth: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  api: {
    auth: "/api/auth",
    youtube: "/api/youtube",
    ideas: "/api/ideas",
    trends: "/api/trends",
    analytics: "/api/analytics",
  },
} as const;
