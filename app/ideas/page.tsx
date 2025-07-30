"use client";

import { useState } from "react";
import { Lightbulb, TrendingUp, Eye, Clock, Plus, Sparkles } from "lucide-react";

const mockIdeas = [
  {
    id: 1,
    title: "10 AI Tools That Will Change Video Editing Forever",
    description: "Explore the latest AI-powered video editing tools that are revolutionizing content creation for YouTubers.",
    category: "Technology",
    trendScore: 92,
    estimatedViews: 45000,
    tags: ["AI", "Video Editing", "Tools", "Tech"],
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Why Everyone is Switching to This New Social Media Platform",
    description: "Dive into the emerging social media platform that's capturing everyone's attention and what it means for creators.",
    category: "Entertainment",
    trendScore: 87,
    estimatedViews: 38000,
    tags: ["Social Media", "Trends", "Platform"],
    createdAt: "4 hours ago",
  },
  {
    id: 3,
    title: "The Secret to Getting 1M Subscribers in 6 Months",
    description: "Learn the proven strategies and tactics that successful YouTubers use to rapidly grow their subscriber base.",
    category: "Education",
    trendScore: 94,
    estimatedViews: 62000,
    tags: ["Growth", "YouTube", "Strategy"],
    createdAt: "1 day ago",
  },
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState(mockIdeas);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewIdea = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newIdea = {
      id: Date.now(),
      title: "How to Use ChatGPT for Content Creation in 2025",
      description: "Discover advanced techniques for leveraging AI to streamline your content creation workflow.",
      category: "Technology",
      trendScore: 89,
      estimatedViews: 35000,
      tags: ["AI", "ChatGPT", "Content Creation"],
      createdAt: "Just now",
    };
    
    setIdeas([newIdea, ...ideas]);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Ideas</h1>
          <p className="text-gray-600">AI-powered video ideas tailored for your channel</p>
        </div>
        <button
          onClick={generateNewIdea}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Idea
            </>
          )}
        </button>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {idea.category}
                  </span>
                  <span className="text-xs text-gray-500">{idea.createdAt}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h2>
                <p className="text-gray-600 mb-4">{idea.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span className="font-medium text-green-600">{idea.trendScore}</span>
                  <span className="ml-1">Trend Score</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="font-medium">{idea.estimatedViews.toLocaleString()}</span>
                  <span className="ml-1">Est. Views</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Save Idea
                </button>
                <button className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Expand Idea
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ideas.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
          <p className="text-gray-600 mb-4">Generate your first AI-powered video idea to get started</p>
          <button
            onClick={generateNewIdea}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Your First Idea
          </button>
        </div>
      )}
    </div>
  );
}