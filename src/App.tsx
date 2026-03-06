import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  AlertCircle,
  XCircle,
  RefreshCw,
  Activity,
  ChevronDown
} from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { EmployeeStatus } from './components/EmployeeStatus';
import { ProcessTimeChart } from './components/ProcessTimeChart';
import { MetricData } from './types';

type SessionType = 'ecommerce' | 'diar' | 'rozpakuj';

interface SessionConfig {
  id: SessionType;
  name: string;
  description: string;
}

const sessions: SessionConfig[] = [
  { id: 'ecommerce', name: 'E-commerce', description: 'E-commerce метрики в реальном времени' },
  { id: 'diar', name: 'ДИАР', description: 'ДИАР метрики в реальном времени' },
  { id: 'rozpakuj', name: 'Трансляция канала Розпакуй', description: 'Трансляция канала Розпакуй метрики в реальном времени' },
];

function App() {
  const [data, setData] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [session, setSession] = useState<SessionType>('ecommerce');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentSession = sessions.find(s => s.id === session) || sessions[0];

  const fetchData = async (debug = false) => {
    try {
      setError(null);
      // Используем локальный API вместо Supabase
      const apiUrl = `/api/parse-crm-data.php?session=${session}${debug ? '&debug=true' : ''}`;
      console.log('Fetching data for session:', session);
      console.log('API URL:', apiUrl);
      const response = await fetch(apiUrl, {
        cache: 'no-store', // Отключаем кэширование
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response for session', session, ':', result);
      console.log('Orders value:', result.orders?.value, 'Total:', result.orders?.total);

      if (debug) {
        console.log('=== DEBUG MODE ===');
        console.log('Cookies:', result.cookies);
        console.log('Filtered HTML (first 1000 chars):', result.filteredHtml?.substring(0, 1000));
        console.log('Total HTML (first 1000 chars):', result.totalHtml?.substring(0, 1000));
        alert('Debug info logged to console. Press F12 to view.');
        return;
      }

      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-cyan-400 mb-4"></div>
          <p className="text-slate-400 text-lg">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl p-8 border border-red-500/50 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-white mb-2 text-center">Ошибка загрузки</h2>
          <p className="text-slate-400 text-center mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-700/40 via-blue-800/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-700/40 via-purple-800/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-slate-950/80"></div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 rounded-lg sm:rounded-xl shadow-2xl shadow-cyan-500/30">
              <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-0.5">
                {currentSession.name}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                {currentSession.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {lastUpdate && (
              <p className="text-slate-400 text-xs sm:text-sm flex-1 sm:flex-initial backdrop-blur-sm bg-slate-800/30 px-2 py-1 rounded-lg border border-slate-700/30">
                {lastUpdate.toLocaleTimeString('ru-RU')}
              </p>
            )}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-cyan-300 backdrop-blur-sm font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg transition-all border border-slate-700/50 hover:border-cyan-500/30 text-sm"
              >
                <span className="hidden sm:inline">{currentSession.name}</span>
                <span className="sm:hidden">Сессия</span>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg border border-slate-700/50 shadow-xl z-50 backdrop-blur-sm">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSession(s.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        session === s.id ? 'bg-cyan-600/20 text-cyan-300' : 'text-slate-300'
                      }`}
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{s.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => fetchData(false)}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-cyan-300 backdrop-blur-sm font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg transition-all border border-slate-700/50 hover:border-cyan-500/30 text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Обновить</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
          <MetricCard
            title="Заказы"
            value={data.orders.value}
            percentage={data.orders.percentage}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Сумма"
            value={data.orderSum.value}
            percentage={data.orderSum.percentage}
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Прибыль"
            value={data.marginProfit.value}
            percentage={data.marginProfit.percentage}
            icon={TrendingUp}
            format="currency"
          />
          <MetricCard
            title="Все звонки"
            value={data.allCalls.value}
            percentage={data.allCalls.percentage}
            icon={Phone}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3">
          <MetricCard
            title="Профильные"
            value={data.profileCalls.value}
            percentage={data.profileCalls.percentage}
            icon={PhoneIncoming}
          />
          <MetricCard
            title="Необработанные"
            value={data.unprocessedCalls.value}
            percentage={data.unprocessedCalls.percentage}
            icon={AlertCircle}
            variant="warning"
          />
          <MetricCard
            title="Пропущенные"
            value={data.missedCalls.value}
            percentage={data.missedCalls.percentage}
            icon={PhoneMissed}
          />
          <MetricCard
            title="Пропущ. нецелевые"
            value={data.missedNonTargetCalls.value}
            percentage={data.missedNonTargetCalls.percentage}
            icon={XCircle}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-2 sm:mb-3">
          <ProcessTimeChart intervals={data.processTimeIntervals} />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          <EmployeeStatus
            total={data.employees.total}
            work={data.employees.work}
            pause={data.employees.pause}
            stop={data.employees.stop}
          />
        </div>

        <div className="text-center text-slate-500 text-xs sm:text-sm mt-3 sm:mt-4 backdrop-blur-sm">
          <p className="inline-block px-3 py-1 rounded-full bg-slate-800/20 border border-slate-700/20">
            Обновление каждую минуту
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
