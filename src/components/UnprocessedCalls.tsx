import { AlertCircle } from 'lucide-react';

interface UnprocessedCallsProps {
  value: number;
  percentage: string;
}

export function UnprocessedCalls({ value, percentage }: UnprocessedCallsProps) {
  return (
    <div className="group relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-5 border border-slate-600/40 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-amber-600/0 group-hover:from-orange-500/15 group-hover:via-amber-500/10 group-hover:to-amber-600/15 rounded-lg sm:rounded-xl transition-all duration-500"></div>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-full blur-3xl group-hover:from-orange-500/20 group-hover:to-amber-600/20 transition-all duration-500"></div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-orange-500/30 via-orange-600/25 to-amber-600/30 group-hover:from-orange-400/40 group-hover:via-orange-500/35 group-hover:to-amber-500/40 rounded-md sm:rounded-lg shadow-xl shadow-orange-500/20 group-hover:shadow-2xl group-hover:shadow-orange-400/30 transition-all duration-500">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 group-hover:text-orange-200 transition-colors drop-shadow-lg" />
            </div>
            <div>
              <h3 className="text-slate-400 group-hover:text-slate-300 text-xs sm:text-sm font-semibold transition-colors">Необработанные звонки</h3>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-orange-50 to-amber-100 bg-clip-text text-transparent drop-shadow-sm">{value}</p>
              </div>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold text-orange-300 bg-gradient-to-r from-orange-500/20 via-orange-600/15 to-amber-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-orange-400/30 shadow-lg shadow-orange-500/10">
            {percentage}
          </span>
        </div>
      </div>
    </div>
  );
}
