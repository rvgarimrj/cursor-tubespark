"use client";

import {
  BarChart3,
  Calendar,
  Lightbulb,
  TrendingUp,
  Users,
  Video,
  Eye,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

// Mock data - later this will come from API
const stats = [
  {
    name: "Ideas Generated",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: Lightbulb,
    href: "/ideas",
  },
  {
    name: "Avg. Trend Score",
    value: "87",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    href: "/analytics",
  },
  {
    name: "Videos Planned",
    value: "8",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
    href: "/calendar",
  },
  {
    name: "Est. Total Views",
    value: "156K",
    change: "+23%",
    changeType: "positive" as const,
    icon: Eye,
    href: "/analytics",
  },
];

const recentIdeas = [
  {
    id: 1,
    title: "10 AI Tools That Will Change Video Editing Forever",
    category: "Technology",
    trendScore: 92,
    estimatedViews: 45000,
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Why Everyone is Switching to This New Social Media Platform",
    category: "Entertainment",
    trendScore: 87,
    estimatedViews: 38000,
    createdAt: "4 hours ago",
  },
  {
    id: 3,
    title: "The Secret to Getting 1M Subscribers in 6 Months",
    category: "Education",
    trendScore: 94,
    estimatedViews: 62000,
    createdAt: "1 day ago",
  },
];

const trendingTopics = [
  { keyword: "AI video editing", searchVolume: 125000, trend: "rising" },
  { keyword: "YouTube Shorts tips", searchVolume: 89000, trend: "stable" },
  { keyword: "Content creator tools", searchVolume: 67000, trend: "rising" },
  { keyword: "Video marketing 2025", searchVolume: 43000, trend: "rising" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.displayName?.split(" ")[0] || "Creator"}! 🎬
        </h1>
        <p className="text-red-100">
          Ready to create your next viral video? Let's generate some amazing ideas!
        </p>
        <div className="mt-4">
          <Link
            href="/ideas"
            className="inline-flex items-center px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Generate New Ideas
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ideas */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Ideas
              </h2>
              <Link
                href="/ideas"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentIdeas.map((idea) => (
              <div key={idea.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {idea.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {idea.category}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {idea.trendScore}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {idea.estimatedViews.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {idea.createdAt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Trending Topics
              </h2>
              <Link
                href="/analytics"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {topic.keyword}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {topic.searchVolume.toLocaleString()} searches/month
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      topic.trend === "rising"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <TrendingUp
                      className={`h-3 w-3 mr-1 ${
                        topic.trend === "rising" ? "text-green-600" : "text-gray-600"
                      }`}
                    />
                    {topic.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/ideas"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Generate Ideas</h3>
              <p className="text-sm text-gray-500">Create new video concepts</p>
            </div>
          </Link>
          
          <Link
            href="/calendar"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Plan Content</h3>
              <p className="text-sm text-gray-500">Schedule your videos</p>
            </div>
          </Link>
          
          <Link
            href="/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Track your performance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}