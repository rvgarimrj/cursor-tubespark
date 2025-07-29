import { Play, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: "Generate viral video ideas for your YouTube channel using AI",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg youtube-gradient">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">TubeSpark</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center justify-center rounded-md youtube-gradient px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-6xl text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Generate{" "}
              <span className="youtube-gradient bg-clip-text text-transparent">
                Viral Video Ideas
              </span>{" "}
              with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stop struggling with writer's block. TubeSpark analyzes your
              YouTube channel, current trends, and competitors to generate
              personalized video ideas that drive engagement and growth.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md youtube-gradient px-8 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Start Creating Ideas
              </Link>
              <Link
                href="#demo"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary"
              >
                Watch Demo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                <dt className="flex items-center gap-x-3 text-sm leading-6 text-gray-600">
                  <Users className="h-5 w-5 text-gray-400" />
                  Active Creators
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  10,000+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                <dt className="flex items-center gap-x-3 text-sm leading-6 text-gray-600">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                  Ideas Generated
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  500K+
                </dd>
              </div>
              <div className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                <dt className="flex items-center gap-x-3 text-sm leading-6 text-gray-600">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  Viral Videos Created
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  25,000+
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to create viral content
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Our AI analyzes your channel data, trending topics, and competitor
              strategies to generate personalized video ideas that your audience
              will love.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">AI-Powered Ideas</h3>
                <p className="mt-2 text-gray-600">
                  Generate unlimited video ideas tailored to your niche,
                  audience, and content style using advanced AI models.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Trend Analysis</h3>
                <p className="mt-2 text-gray-600">
                  Stay ahead of the curve with real-time trend analysis and
                  viral topic suggestions based on current data.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">
                  Competitor Insights
                </h3>
                <p className="mt-2 text-gray-600">
                  Analyze what's working for similar channels and discover
                  content gaps you can fill.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">SEO Optimization</h3>
                <p className="mt-2 text-gray-600">
                  Get title suggestions, tags, and descriptions optimized for
                  YouTube's algorithm and search rankings.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Channel Analysis</h3>
                <p className="mt-2 text-gray-600">
                  Connect your YouTube channel to get personalized insights and
                  recommendations based on your performance data.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg youtube-gradient">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Content Calendar</h3>
                <p className="mt-2 text-gray-600">
                  Plan and schedule your content with an intelligent calendar
                  that suggests optimal posting times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to create viral content?
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Join thousands of creators who are already using TubeSpark to grow
              their YouTube channels.
            </p>
            <div className="mt-10">
              <Link
                href="/auth/signup"
                className="rounded-md youtube-gradient px-8 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded youtube-gradient">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold">TubeSpark</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 TubeSpark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
