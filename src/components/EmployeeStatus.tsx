import { Users, Play, Pause, Square } from 'lucide-react';

interface EmployeeStatusProps {
  total: { value: number; percentage: string };
  work: { value: number; percentage: string };
  pause: { value: number; percentage: string };
  stop: { value: number; percentage: string };
}

export function EmployeeStatus({ total, work, pause, stop }: EmployeeStatusProps) {
  const statuses = [
    { label: 'Work', value: work.value, percentage: work.percentage, icon: Play, color: 'from-green-500/30 via-emerald-500/25 to-green-600/30', textColor: 'text-green-300', bgColor: 'bg-green-500/20', shadowColor: 'shadow-green-500/20' },
    { label: 'Pause', value: pause.value, percentage: pause.percentage, icon: Pause, color: 'from-yellow-500/30 via-amber-500/25 to-yellow-600/30', textColor: 'text-yellow-300', bgColor: 'bg-yellow-500/20', shadowColor: 'shadow-yellow-500/20' },
    { label: 'Stop', value: stop.value, percentage: stop.percentage, icon: Square, color: 'from-red-500/30 via-rose-500/25 to-red-600/30', textColor: 'text-red-300', bgColor: 'bg-red-500/20', shadowColor: 'shadow-red-500/20' },
  ];

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-5 border border-slate-600/40 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-pink-600/0 group-hover:from-purple-500/15 group-hover:via-pink-500/10 group-hover:to-pink-600/15 rounded-lg sm:rounded-xl transition-all duration-500"></div>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl group-hover:from-purple-500/20 group-hover:to-pink-600/20 transition-all duration-500"></div>
      <div className="relative">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-purple-500/30 via-purple-600/25 to-pink-600/30 group-hover:from-purple-400/40 group-hover:via-purple-500/35 group-hover:to-pink-500/40 rounded-md sm:rounded-lg shadow-xl shadow-purple-500/20 group-hover:shadow-2xl group-hover:shadow-purple-400/30 transition-all duration-500">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 group-hover:text-purple-200 transition-colors drop-shadow-lg" />
          </div>
          <div>
            <h3 className="text-slate-400 group-hover:text-slate-300 text-xs sm:text-sm font-semibold transition-colors">Сотрудники</h3>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-50 to-pink-100 bg-clip-text text-transparent drop-shadow-sm">{total.value}</p>
              <span className="text-xs sm:text-sm font-bold text-purple-300">({total.percentage})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {statuses.map((status) => (
            <div key={status.label} className="relative group/status bg-slate-900/70 backdrop-blur-sm rounded-md sm:rounded-lg p-2 sm:p-3 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:shadow-xl hover:scale-105 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${status.color} opacity-20 group-hover/status:opacity-30 transition-all duration-500`}></div>
              <div className="relative">
                <div className={`inline-flex p-1 sm:p-1.5 bg-gradient-to-br ${status.color} rounded mb-2 shadow-xl ${status.shadowColor} group-hover/status:shadow-2xl`}>
                  <status.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${status.textColor} drop-shadow-md`} />
                </div>
                <p className="text-slate-400 group-hover/status:text-slate-300 text-[10px] sm:text-xs mb-0.5 sm:mb-1 font-semibold transition-colors">{status.label}</p>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
                  <p className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">{status.value}</p>
                  <span className={`text-[10px] sm:text-xs font-bold ${status.textColor} ${status.bgColor} px-1.5 sm:px-2 py-0.5 rounded-full inline-block w-fit border border-current border-opacity-30 shadow-lg`}>
                    {status.percentage}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
