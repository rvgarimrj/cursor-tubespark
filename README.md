# TubeSpark - AI Video Idea Generator for YouTubers

TubeSpark is an AI-powered platform that helps YouTubers generate viral video ideas by analyzing their channel data, current trends, and competitor strategies.

## 🚀 Features

- **AI-Powered Idea Generation**: Generate unlimited video ideas tailored to your niche and audience
- **Trend Analysis**: Stay ahead with real-time trend analysis and viral topic suggestions
- **Competitor Insights**: Analyze similar channels and discover content gaps
- **SEO Optimization**: Get titles, tags, and descriptions optimized for YouTube's algorithm
- **Channel Analytics**: Deep insights based on your YouTube performance data
- **Content Calendar**: Plan and schedule your content with intelligent recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Stack Auth with YouTube OAuth
- **AI**: Multiple providers (OpenAI, Anthropic, Groq)
- **Styling**: Tailwind CSS with shadcn/ui
- **APIs**: YouTube Data API v3, Google Trends

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Stack Auth account
- YouTube API credentials
- AI provider API keys (OpenAI, Anthropic, or Groq)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd tubespark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TubeSpark
NODE_ENV=development

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stack Auth Configuration
STACK_AUTH_PROJECT_ID=your_stack_auth_project_id
STACK_AUTH_CLIENT_ID=your_stack_auth_client_id
STACK_AUTH_CLIENT_SECRET=your_stack_auth_client_secret

# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_youtube_oauth_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_oauth_client_secret

# AI Providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database migration:

```bash
# Using Supabase CLI (recommended)
npx supabase db push

# Or manually execute the SQL file in Supabase SQL Editor
# Copy and run the contents of lib/supabase/migrations/001_initial_schema.sql
```

### 5. Stack Auth Setup

1. Create a Stack Auth project at [stack-auth.com](https://stack-auth.com)
2. Configure OAuth providers (Google/YouTube)
3. Add your project credentials to `.env.local`

### 6. YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable YouTube Data API v3 and YouTube Analytics API
4. Create credentials (API Key and OAuth 2.0 Client ID)
5. Configure OAuth consent screen
6. Add authorized redirect URIs

### 7. AI Provider Setup

Choose at least one AI provider:

#### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env.local`

#### Anthropic
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add to `.env.local`

#### Groq
1. Go to [Groq Console](https://console.groq.com/)
2. Create an API key
3. Add to `.env.local`

### 8. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
tubespark/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Feature components
├── lib/                  # Utility libraries
│   ├── supabase/         # Database client and queries
│   ├── auth/             # Authentication utilities
│   ├── youtube/          # YouTube API integration
│   ├── ai/               # AI providers integration
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run check` - Run Biome checks
- `npm run check:fix` - Fix Biome issues automatically

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t tubespark .

# Run container
docker run -p 3000:3000 tubespark
```

## 📊 API Usage

### Generate Video Ideas

```typescript
const response = await fetch('/api/ideas/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    niche: 'technology',
    target_audience: 'developers',
    content_style: 'educational',
    count: 5,
  }),
});

const ideas = await response.json();
```

### Get Trending Topics

```typescript
const response = await fetch('/api/trends');
const trends = await response.json();
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Stack Auth
- API rate limiting
- Input validation and sanitization
- HTTPS-only in production

## 📈 Monitoring

- Analytics with Vercel Analytics
- Error tracking with Sentry
- Performance monitoring
- Usage metrics tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tubespark/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tubespark/discussions)
- **Email**: support@tubespark.ai

## 🎯 Roadmap

- [x] Basic idea generation
- [x] YouTube channel integration
- [x] Trend analysis
- [ ] Advanced competitor analysis
- [ ] Video performance prediction
- [ ] Mobile app
- [ ] Team collaboration features
- [ ] White-label solutions

---

Built with ❤️ for the YouTube creator community.