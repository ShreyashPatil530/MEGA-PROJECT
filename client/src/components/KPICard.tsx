import React from 'react';
import { KPIData } from '../types/index';

interface KPICardProps {
  kpi: KPIData;
  isLoading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, isLoading = false }) => {
  return (
    <div className="card group hover:scale-105 transform transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${kpi.color} bg-opacity-10`}>
          {kpi.icon}
        </div>
      </div>

      <p className="text-gray-600 text-sm font-medium mb-2">{kpi.label}</p>

      {isLoading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
      ) : (
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {kpi.value}
          {kpi.unit && <span className="text-lg text-gray-600 ml-1">{kpi.unit}</span>}
        </h3>
      )}

      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${kpi.color}`} />
        <span className="text-gray-500">Real-time metrics</span>
      </div>
    </div>
  );
};

export default KPICard;