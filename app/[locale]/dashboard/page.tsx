"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Video,
  Eye,
  Calendar,
  Target
} from "lucide-react";

export default function DashboardPage() {
  const { tDashboard, tCommon } = useTranslation();

  const stats = [
    {
      title: tDashboard('home.stats.ideasGenerated'),
      value: "24",
      icon: Lightbulb,
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: tDashboard('home.stats.videosPlanned'),
      value: "8",
      icon: Video,
      change: "+3",
      changeType: "increase" as const,
    },
    {
      title: tDashboard('home.stats.trendsTracked'),
      value: "156",
      icon: TrendingUp,
      change: "+23%",
      changeType: "increase" as const,
    },
    {
      title: tDashboard('home.stats.competitors'),
      value: "12",
      icon: Users,
      change: "+2",
      changeType: "increase" as const,
    },
  ];

  const quickActions = [
    {
      title: tDashboard('home.quickActions.generateIdea'),
      description: "Create new video ideas with AI",
      icon: Lightbulb,
      href: "/ideas",
      color: "bg-blue-500",
    },
    {
      title: tDashboard('home.quickActions.analyzeChannel'),
      description: "Get insights about your channel",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-green-500",
    },
    {
      title: tDashboard('home.quickActions.checkTrends'),
      description: "Discover trending topics",
      icon: TrendingUp,
      href: "/trends",
      color: "bg-purple-500",
    },
    {
      title: tDashboard('home.quickActions.scheduleVideo'),
      description: "Plan your content calendar",
      icon: Calendar,
      href: "/calendar",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {tDashboard('home.welcomeBack')}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {tDashboard('home.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {tDashboard('home.quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className={`h-12 w-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ideas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {tDashboard('home.recentIdeas.title')}
          </h2>
          <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
            {tDashboard('home.recentIdeas.viewAll')} →
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {tDashboard('home.recentIdeas.noIdeas')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {tDashboard('home.recentIdeas.generateFirst')}
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {tDashboard('home.quickActions.generateIdea')}
          </button>
        </div>
      </div>
    </div>
  );
}