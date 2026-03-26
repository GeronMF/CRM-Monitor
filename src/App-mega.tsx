import { useState, useEffect } from 'react';
import { Phone, RefreshCw, AlertCircle, Activity, ShoppingBag } from 'lucide-react';

interface Order {
  product: string;
  quantity: string;
  clientName: string;
}

interface MegaData {
  calls: number;
  orders: Order[];
}

function App() {
  const [data, setData] = useState<MegaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async (debug = false) => {
    try {
      setError(null);
      const apiUrl = `/crm-monitor/mega/api/parse-crm-data.php${debug ? '?debug=true' : ''}`;
      const response = await fetch(apiUrl, { cache: 'no-store' });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (debug) {
        console.log('=== DEBUG MODE ===');
        console.log('HTML preview:', result.html?.substring(0, 2000));
        console.log('Cookies:', result.cookies);
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
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

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
            onClick={() => { setLoading(true); fetchData(); }}
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

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 rounded-lg sm:rounded-xl shadow-2xl shadow-cyan-500/30">
              <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-0.5">
                Пряма трансляція «МегаРозпакуй»
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                Метрики в реальному часі
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {lastUpdate && (
              <p className="text-slate-400 text-xs sm:text-sm flex-1 sm:flex-initial backdrop-blur-sm bg-slate-800/30 px-2 py-1 rounded-lg border border-slate-700/30">
                {lastUpdate.toLocaleTimeString('uk-UA')}
              </p>
            )}
            <button
              onClick={() => fetchData(false)}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-cyan-300 backdrop-blur-sm font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg transition-all border border-slate-700/50 hover:border-cyan-500/30 text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Оновити</span>
            </button>
          </div>
        </div>

        {/* Calls metric */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="backdrop-blur-sm bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-xs sm:text-sm font-medium">Кількість дзвінків</p>
              <div className="p-1.5 sm:p-2 bg-cyan-500/10 rounded-lg">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{data.calls}</p>
          </div>
          <div className="backdrop-blur-sm bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-xs sm:text-sm font-medium">Замовлень у таблиці</p>
              <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{data.orders.length}</p>
          </div>
        </div>

        {/* Orders table */}
        <div className="backdrop-blur-sm bg-slate-800/40 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/50 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm sm:text-base font-semibold text-white">Замовлення</h2>
          </div>

          {data.orders.length === 0 ? (
            <div className="px-4 py-10 text-center text-slate-400 text-sm">
              Замовлень поки немає
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left px-4 sm:px-6 py-3 text-slate-400 font-medium text-xs sm:text-sm w-8">#</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-slate-400 font-medium text-xs sm:text-sm">Продукт</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-slate-400 font-medium text-xs sm:text-sm">Кількість</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-slate-400 font-medium text-xs sm:text-sm">ФІО клієнта</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-700/30 transition-colors hover:bg-slate-700/20 ${index % 2 === 0 ? '' : 'bg-slate-800/20'}`}
                    >
                      <td className="px-4 sm:px-6 py-3 text-slate-500 text-xs">{index + 1}</td>
                      <td className="px-4 sm:px-6 py-3 text-white font-medium">{order.product || '—'}</td>
                      <td className="px-4 sm:px-6 py-3 text-cyan-300 font-semibold">{order.quantity || '—'}</td>
                      <td className="px-4 sm:px-6 py-3 text-slate-300">{order.clientName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center text-slate-500 text-xs sm:text-sm mt-3 sm:mt-4">
          <p className="inline-block px-3 py-1 rounded-full bg-slate-800/20 border border-slate-700/20">
            Оновлення кожну хвилину
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
