import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  percentage: string;
  icon: LucideIcon;
  format?: 'number' | 'currency';
  variant?: 'default' | 'warning';
}

export function MetricCard({ title, value, percentage, icon: Icon, format = 'number', variant = 'default' }: MetricCardProps) {
  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat('uk-UA').format(val);
  };

  const colors = variant === 'warning' ? {
    border: 'hover:border-orange-400/50',
    shadow: 'hover:shadow-orange-500/25',
    overlayFrom: 'group-hover:from-orange-500/15',
    overlayVia: 'group-hover:via-amber-500/10',
    overlayTo: 'group-hover:to-amber-600/15',
    blurFrom: 'from-orange-500/10',
    blurTo: 'to-amber-600/10',
    blurHoverFrom: 'group-hover:from-orange-500/20',
    blurHoverTo: 'group-hover:to-amber-600/20',
    iconBgFrom: 'from-orange-500/30',
    iconBgVia: 'via-orange-600/25',
    iconBgTo: 'to-amber-600/30',
    iconBgHoverFrom: 'group-hover:from-orange-400/40',
    iconBgHoverVia: 'group-hover:via-orange-500/35',
    iconBgHoverTo: 'group-hover:to-amber-500/40',
    iconShadow: 'shadow-orange-500/20',
    iconShadowHover: 'group-hover:shadow-orange-400/30',
    iconText: 'text-orange-300',
    iconTextHover: 'group-hover:text-orange-200',
    badgeText: 'text-orange-300',
    badgeBgFrom: 'from-orange-500/20',
    badgeBgVia: 'via-orange-600/15',
    badgeBgTo: 'to-amber-500/20',
    badgeBorder: 'border-orange-400/30',
    badgeShadow: 'shadow-orange-500/10',
    textGradient: 'from-white via-orange-50 to-amber-100',
  } : {
    border: 'hover:border-cyan-400/50',
    shadow: 'hover:shadow-cyan-500/25',
    overlayFrom: 'group-hover:from-cyan-500/15',
    overlayVia: 'group-hover:via-blue-500/10',
    overlayTo: 'group-hover:to-blue-600/15',
    blurFrom: 'from-cyan-500/10',
    blurTo: 'to-blue-600/10',
    blurHoverFrom: 'group-hover:from-cyan-500/20',
    blurHoverTo: 'group-hover:to-blue-600/20',
    iconBgFrom: 'from-cyan-500/30',
    iconBgVia: 'via-cyan-600/25',
    iconBgTo: 'to-blue-700/30',
    iconBgHoverFrom: 'group-hover:from-cyan-400/40',
    iconBgHoverVia: 'group-hover:via-cyan-500/35',
    iconBgHoverTo: 'group-hover:to-blue-600/40',
    iconShadow: 'shadow-cyan-500/20',
    iconShadowHover: 'group-hover:shadow-cyan-400/30',
    iconText: 'text-cyan-300',
    iconTextHover: 'group-hover:text-cyan-200',
    badgeText: 'text-cyan-300',
    badgeBgFrom: 'from-cyan-500/20',
    badgeBgVia: 'via-cyan-600/15',
    badgeBgTo: 'to-blue-500/20',
    badgeBorder: 'border-cyan-400/30',
    badgeShadow: 'shadow-cyan-500/10',
    textGradient: 'from-white via-cyan-50 to-cyan-100',
  };

  return (
    <div className={`group relative bg-gradient-to-br from-slate-800/60 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-5 border border-slate-600/40 ${colors.border} transition-all duration-500 hover:shadow-2xl ${colors.shadow} hover:-translate-y-1 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent ${colors.overlayFrom} ${colors.overlayVia} ${colors.overlayTo} rounded-lg sm:rounded-xl transition-all duration-500`}></div>
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${colors.blurFrom} ${colors.blurTo} rounded-full blur-3xl ${colors.blurHoverFrom} ${colors.blurHoverTo} transition-all duration-500`}></div>
      <div className="relative">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className={`p-1.5 sm:p-2.5 bg-gradient-to-br ${colors.iconBgFrom} ${colors.iconBgVia} ${colors.iconBgTo} ${colors.iconBgHoverFrom} ${colors.iconBgHoverVia} ${colors.iconBgHoverTo} rounded-md sm:rounded-lg transition-all duration-500 shadow-xl ${colors.iconShadow} ${colors.iconShadowHover}`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.iconText} ${colors.iconTextHover} transition-colors drop-shadow-lg`} />
          </div>
          <span className={`text-xs sm:text-sm font-bold ${colors.badgeText} bg-gradient-to-r ${colors.badgeBgFrom} ${colors.badgeBgVia} ${colors.badgeBgTo} px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${colors.badgeBorder} shadow-lg ${colors.badgeShadow}`}>
            {percentage}
          </span>
        </div>
        <h3 className="text-slate-400 group-hover:text-slate-300 text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 truncate transition-colors">{title}</h3>
        <p className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent truncate drop-shadow-sm`}>{formatValue(value)}</p>
      </div>
    </div>
  );
}
