import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { TimeInterval } from '../types';

interface ProcessTimeChartProps {
  intervals: TimeInterval[];
}

export function ProcessTimeChart({ intervals }: ProcessTimeChartProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const maxPercentage = Math.max(...intervals.map(i => i.percentage), 1);

  const getColorClasses = (label: string) => {
    if (label === '0–5 мин' || label === '5–10 мин') {
      return {
        bg: 'from-emerald-500/80 via-emerald-600/70 to-green-600/60',
        hoverBg: 'group-hover/bar:from-emerald-400 group-hover/bar:to-green-500',
        shadow: 'shadow-emerald-500/30',
        badge: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30'
      };
    } else if (label === '10–15 мин' || label === '15–30 мин') {
      return {
        bg: 'from-amber-500/80 via-yellow-600/70 to-orange-600/60',
        hoverBg: 'group-hover/bar:from-amber-400 group-hover/bar:to-orange-500',
        shadow: 'shadow-amber-500/30',
        badge: 'text-amber-300 bg-amber-500/20 border-amber-500/30'
      };
    } else {
      return {
        bg: 'from-red-500/80 via-red-600/70 to-rose-600/60',
        hoverBg: 'group-hover/bar:from-red-400 group-hover/bar:to-rose-500',
        shadow: 'shadow-red-500/30',
        badge: 'text-red-300 bg-red-500/20 border-red-500/30'
      };
    }
  };

  const totalCount = intervals.reduce((sum, interval) => sum + interval.count, 0);

  const getCategoryTotal = (category: 'green' | 'yellow' | 'red') => {
    if (category === 'green') {
      const greenIntervals = intervals.filter(i => i.label === '0–5 мин' || i.label === '5–10 мин');
      const count = greenIntervals.reduce((sum, i) => sum + i.count, 0);
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { count, percentage };
    } else if (category === 'yellow') {
      const yellowIntervals = intervals.filter(i => i.label === '10–15 мин' || i.label === '15–30 мин');
      const count = yellowIntervals.reduce((sum, i) => sum + i.count, 0);
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { count, percentage };
    } else {
      const redIntervals = intervals.filter(i => i.label !== '0–5 мин' && i.label !== '5–10 мин' && i.label !== '10–15 мин' && i.label !== '15–30 мин');
      const count = redIntervals.reduce((sum, i) => sum + i.count, 0);
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { count, percentage };
    }
  };

  const greenTotal = getCategoryTotal('green');
  const yellowTotal = getCategoryTotal('yellow');
  const redTotal = getCategoryTotal('red');

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-lg sm:rounded-xl border border-slate-600/40 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/15 group-hover:via-blue-500/10 group-hover:to-blue-600/15 rounded-lg sm:rounded-xl transition-all duration-500"></div>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all duration-500"></div>

      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-2.5 sm:p-4 flex items-center justify-between hover:bg-slate-700/20 transition-colors"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1 sm:p-1.5 bg-gradient-to-br from-cyan-500/30 via-cyan-600/25 to-blue-600/30 group-hover:from-cyan-400/40 group-hover:via-cyan-500/35 group-hover:to-blue-500/40 rounded-md shadow-xl shadow-cyan-500/20 group-hover:shadow-2xl group-hover:shadow-cyan-400/30 transition-all duration-500">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300 group-hover:text-cyan-200 transition-colors drop-shadow-lg" />
            </div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-cyan-50 to-blue-100 bg-clip-text text-transparent drop-shadow-sm">
                {totalCount}
              </p>
              <span className="text-xs sm:text-sm font-bold text-cyan-300">процессов</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/40 px-2 py-1 rounded-lg">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
              <span className="text-xs sm:text-sm text-emerald-300 font-bold tabular-nums">{greenTotal.percentage}%</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/40 px-2 py-1 rounded-lg">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div>
              <span className="text-xs sm:text-sm text-amber-300 font-bold tabular-nums">{yellowTotal.percentage}%</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/40 px-2 py-1 rounded-lg">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
              <span className="text-xs sm:text-sm text-red-300 font-bold tabular-nums">{redTotal.percentage}%</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
            <div className="grid grid-cols-1 gap-0.5 sm:gap-1">
              {intervals.map((interval, index) => {
                const colors = getColorClasses(interval.label);
                return (
                  <div key={index} className="relative group/bar bg-slate-900/70 backdrop-blur-sm rounded p-1 sm:p-1.5 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-cyan-600/5 to-blue-600/10 opacity-20 group-hover/bar:opacity-30 transition-all duration-500"></div>
                    <div className="relative flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-slate-300 min-w-[50px] sm:min-w-[65px]">
                        {interval.label}
                      </span>
                      <div className="flex-1 relative h-2.5 sm:h-3 bg-slate-900/50 rounded overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${colors.bg} transition-all duration-700 ease-out ${colors.hoverBg} shadow-lg ${colors.shadow}`}
                          style={{
                            width: `${(interval.percentage / maxPercentage) * 100}%`,
                            minWidth: interval.percentage > 0 ? '2%' : '0%'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 min-w-[60px] sm:min-w-[75px] justify-end">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 tabular-nums">{interval.count}</span>
                        <span className={`text-[9px] sm:text-[10px] font-bold ${colors.badge} px-1 py-0.5 rounded-full shadow-lg tabular-nums min-w-[32px] text-center`}>
                          {interval.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
