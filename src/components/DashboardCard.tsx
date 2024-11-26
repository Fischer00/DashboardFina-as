import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface DashboardCardProps {
  title: string;
  amount: number;
  trend: number;
  type: 'income' | 'expense' | 'balance';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, amount, trend, type }) => {
  const getColor = () => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800';
      case 'expense':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className={`rounded-lg p-6 ${getColor()}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-2">
        R$ {amount.toLocaleString('pt-BR')}
      </div>
      <div className="flex items-center text-sm">
        {trend > 0 ? (
          <ArrowUpIcon className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDownIcon className="w-4 h-4 mr-1" />
        )}
        <span>{Math.abs(trend)}% em relação ao mês anterior</span>
      </div>
    </div>
  );
};