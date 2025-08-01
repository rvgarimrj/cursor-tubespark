'use client';

import { useState, useEffect } from 'react';
import { PlanType, UsageLimitsCheck } from '@/types';
import { useAuth } from '@/lib/auth';
import { 
  Lightbulb, 
  FileText, 
  Crown, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react';

interface UsageIndicatorProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

interface UsageData {
  planType: PlanType;
  currentUsage: {
    ideasGenerated: number;
    scriptsBasic: number;
    scriptsPremium: number;
    apiCalls: number;
  };
  limits: {
    ideasPerMonth: number;
    scriptsBasicPerMonth: number;
    scriptsPremiumPerMonth: number;
    apiCallsPerMonth: number;
  } | null;
  monthYear: string;
}

export default function UsageIndicator({ 
  className = '', 
  showDetails = false,
  compact = false 
}: UsageIndicatorProps) {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUsageData();
    }
  }, [user]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/usage/summary');
      const data = await response.json();

      if (data.success) {
        setUsageData(data.usage);
      } else {
        setError(data.error || 'Failed to fetch usage data');
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
      setError('Failed to load usage information');
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageStatus = (used: number, limit: number): 'safe' | 'warning' | 'critical' | 'unlimited' => {
    if (limit === -1) return 'unlimited';
    const percentage = getUsagePercentage(used, limit);
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'safe';
  };

  const formatLimit = (limit: number): string => {
    return limit === -1 ? 'Ilimitado' : limit.toString();
  };

  const getPlanDisplayName = (planType: PlanType): string => {
    const names: Record<PlanType, string> = {
      free: 'Grátis',
      starter: 'Starter',
      pro: 'Pro',
      business: 'Business'
    };
    return names[planType] || planType;
  };

  const getPlanColor = (planType: PlanType): string => {
    const colors: Record<PlanType, string> = {
      free: 'gray',
      starter: 'blue',
      pro: 'purple',
      business: 'yellow'
    };
    return colors[planType] || 'gray';
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !usageData) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        <AlertTriangle className="w-4 h-4 inline mr-1" />
        {error || 'Erro ao carregar dados de uso'}
      </div>
    );
  }

  const { planType, currentUsage, limits } = usageData;
  const planColor = getPlanColor(planType);

  if (compact) {
    const ideasStatus = getUsageStatus(currentUsage.ideasGenerated, limits?.ideasPerMonth || 0);
    const scriptsStatus = getUsageStatus(
      currentUsage.scriptsBasic + currentUsage.scriptsPremium, 
      (limits?.scriptsBasicPerMonth || 0) + (limits?.scriptsPremiumPerMonth || 0)
    );

    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {/* Plan Badge */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${planColor}-100 text-${planColor}-800`}>
          {planType === 'free' ? <Lightbulb className="w-3 h-3 mr-1" /> : <Crown className="w-3 h-3 mr-1" />}
          {getPlanDisplayName(planType)}
        </span>

        {/* Quick Usage */}
        <span className="text-gray-600">
          {currentUsage.ideasGenerated}/{formatLimit(limits?.ideasPerMonth || 0)} ideias
        </span>
        
        {ideasStatus === 'critical' && (
          <AlertTriangle className="w-4 h-4 text-red-500" />
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Uso Atual</h3>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${planColor}-100 text-${planColor}-800`}>
            {planType === 'free' ? <Lightbulb className="w-3 h-3 mr-1" /> : <Crown className="w-3 h-3 mr-1" />}
            Plano {getPlanDisplayName(planType)}
          </span>
        </div>
        {planType === 'free' && (
          <button
            onClick={() => window.location.href = '/dashboard/billing?upgrade=true'}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Fazer Upgrade
          </button>
        )}
      </div>

      {/* Usage Metrics */}
      <div className="space-y-4">
        {/* Ideas */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Ideias</span>
            </div>
            <span className="text-gray-600">
              {currentUsage.ideasGenerated}/{formatLimit(limits?.ideasPerMonth || 0)}
            </span>
          </div>
          {limits?.ideasPerMonth !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  getUsageStatus(currentUsage.ideasGenerated, limits?.ideasPerMonth || 0) === 'critical'
                    ? 'bg-red-500'
                    : getUsageStatus(currentUsage.ideasGenerated, limits?.ideasPerMonth || 0) === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{
                  width: `${getUsagePercentage(currentUsage.ideasGenerated, limits?.ideasPerMonth || 0)}%`
                }}
              ></div>
            </div>
          )}
          {limits?.ideasPerMonth === -1 && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Ilimitado
            </div>
          )}
        </div>

        {/* Basic Scripts */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="font-medium">Roteiros Básicos</span>
            </div>
            <span className="text-gray-600">
              {currentUsage.scriptsBasic}/{formatLimit(limits?.scriptsBasicPerMonth || 0)}
            </span>
          </div>
          {limits?.scriptsBasicPerMonth !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  getUsageStatus(currentUsage.scriptsBasic, limits?.scriptsBasicPerMonth || 0) === 'critical'
                    ? 'bg-red-500'
                    : getUsageStatus(currentUsage.scriptsBasic, limits?.scriptsBasicPerMonth || 0) === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${getUsagePercentage(currentUsage.scriptsBasic, limits?.scriptsBasicPerMonth || 0)}%`
                }}
              ></div>
            </div>
          )}
          {limits?.scriptsBasicPerMonth === -1 && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Ilimitado
            </div>
          )}
        </div>

        {/* Premium Scripts */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Roteiros Premium</span>
            </div>
            <span className="text-gray-600">
              {currentUsage.scriptsPremium}/{formatLimit(limits?.scriptsPremiumPerMonth || 0)}
            </span>
          </div>
          {limits?.scriptsPremiumPerMonth !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  getUsageStatus(currentUsage.scriptsPremium, limits?.scriptsPremiumPerMonth || 0) === 'critical'
                    ? 'bg-red-500'
                    : getUsageStatus(currentUsage.scriptsPremium, limits?.scriptsPremiumPerMonth || 0) === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-purple-500'
                }`}
                style={{
                  width: `${getUsagePercentage(currentUsage.scriptsPremium, limits?.scriptsPremiumPerMonth || 0)}%`
                }}
              ></div>
            </div>
          )}
          {limits?.scriptsPremiumPerMonth === -1 && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Ilimitado
            </div>
          )}
          {limits?.scriptsPremiumPerMonth === 0 && (
            <div className="text-xs text-gray-500">
              Não disponível no seu plano
            </div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {(getUsageStatus(currentUsage.ideasGenerated, limits?.ideasPerMonth || 0) === 'critical' ||
        getUsageStatus(currentUsage.scriptsBasic, limits?.scriptsBasicPerMonth || 0) === 'critical' ||
        getUsageStatus(currentUsage.scriptsPremium, limits?.scriptsPremiumPerMonth || 0) === 'critical') && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Limite quase atingido</p>
              <p className="text-red-600">
                Você está próximo do limite mensal. Considere fazer upgrade para continuar usando.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard/billing?upgrade=true&reason=usage_limit'}
                className="mt-2 text-red-700 hover:text-red-800 font-medium underline"
              >
                Ver planos disponíveis
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Período: {usageData.monthYear}</span>
            <button
              onClick={fetchUsageData}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              <TrendingUp className="w-3 h-3" />
              Atualizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}