"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Crown, 
  Zap, 
  Eye, 
  Calendar, 
  TrendingUp,
  Search,
  Filter,
  Download,
  ExternalLink,
  Plus,
  Clock,
  Target
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import type { VideoScript } from "@/types";

interface ScriptWithIdea extends VideoScript {
  idea?: {
    id: string;
    title: string;
    description: string;
    niche: string;
    trendScore: number;
    estimatedViews: string;
  };
}

export default function ScriptsListPage() {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<ScriptWithIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'basic' | 'premium'>('all');

  useEffect(() => {
    const loadScripts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/scripts?limit=50');
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load scripts');
        }

        setScripts(result.scripts || []);
      } catch (err) {
        console.error('Error loading scripts:', err);
        setError('Falha ao carregar roteiros. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadScripts();
  }, [user?.id]);

  // Filter scripts based on search and type
  const filteredScripts = scripts.filter(script => {
    const matchesSearch = !searchTerm || 
      script.idea?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.idea?.niche.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || script.scriptType === filterType;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roteiros</h1>
            <p className="text-gray-600">Seus roteiros gerados com IA</p>
          </div>
        </div>

        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Carregando roteiros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Roteiros</h1>
          <p className="text-sm sm:text-base text-gray-600">
            {scripts.length > 0 
              ? `${scripts.length} roteiro${scripts.length !== 1 ? 's' : ''} gerado${scripts.length !== 1 ? 's' : ''}`
              : 'Seus roteiros gerados com IA'
            }
          </p>
        </div>
        
        <Link
          href="/ideas"
          className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Gerar Nova Ideia
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <p className="text-red-800 font-medium">Erro</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {scripts.length > 0 && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar roteiros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'basic' | 'premium')}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todos os tipos</option>
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          {/* Scripts Grid */}
          {filteredScripts.length > 0 ? (
            <div className="grid gap-4 sm:gap-6">
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-8 w-8 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum roteiro encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && scripts.length === 0 && (
        <div className="text-center py-12 px-4">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum roteiro gerado ainda</h3>
          <p className="text-gray-600 mb-6">
            Comece gerando ideias e depois crie roteiros incríveis com IA
          </p>
          <Link
            href="/ideas"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Gerar Primeira Ideia
          </Link>
        </div>
      )}
    </div>
  );
}

function ScriptCard({ script }: { script: ScriptWithIdea }) {
  const isPremium = script.scriptType === 'premium';
  const idea = script.idea;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Script Type Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isPremium 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isPremium ? (
                <Crown className="w-3 h-3 mr-1" />
              ) : (
                <Zap className="w-3 h-3 mr-1" />
              )}
              {isPremium ? 'Premium' : 'Básico'}
            </span>
            
            <span className="text-xs text-gray-500">
              {formatDate(script.createdAt!)}
            </span>
          </div>

          {/* Idea Info */}
          {idea && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {idea.title}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {idea.description}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  <span>{idea.niche}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  <span className="font-medium text-green-600">{idea.trendScore}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{idea.estimatedViews} views</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {script.wasUsed && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Utilizado
            </span>
          )}
          {script.publishedVideoUrl && (
            <a
              href={script.publishedVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Ver vídeo
            </a>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/scripts/${script.id}`}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Link>
          
          <Link
            href={`/dashboard/scripts/${script.id}`}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Abrir Roteiro
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
}