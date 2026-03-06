import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TimeInterval {
  label: string;
  count: number;
  percentage: number;
}

interface MetricData {
  orders: { value: number; total: number; percentage: string };
  orderSum: { value: number; total: number; percentage: string };
  marginProfit: { value: number; total: number; percentage: string };
  allCalls: { value: number; total: number; percentage: string };
  profileCalls: { value: number; total: number; percentage: string };
  unprocessedCalls: { value: number; total: number; percentage: string };
  missedCalls: { value: number; total: number; percentage: string };
  missedNonTargetCalls: { value: number; total: number; percentage: string };
  employees: {
    total: { value: number; totalValue: number; percentage: string };
    work: { value: number; totalValue: number; percentage: string };
    pause: { value: number; totalValue: number; percentage: string };
    stop: { value: number; totalValue: number; percentage: string };
  };
  processTimeIntervals: TimeInterval[];
}

async function loginToCRM(): Promise<string> {
  try {
    const loginUrl = 'https://datapoint.center/';

    console.log('Step 1: Getting login page...');
    const initialResponse = await fetch(loginUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
      },
      redirect: 'manual',
    });

    console.log('Initial page response status:', initialResponse.status);

    const cookies: string[] = [];
    const initialSetCookie = initialResponse.headers.getSetCookie();

    if (initialSetCookie && initialSetCookie.length > 0) {
      for (const cookie of initialSetCookie) {
        const cookiePart = cookie.split(';')[0];
        if (cookiePart) {
          cookies.push(cookiePart);
        }
      }
    }

    console.log('Initial cookies count:', cookies.length);

    const formData = new FormData();
    formData.append('auth_login', 'German');
    formData.append('auth_password', 'K9#bT2!mQ8vX*zL4');

    console.log('Step 2: Submitting login form...');
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': cookies.join('; '),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': loginUrl,
        'Origin': 'https://datapoint.center',
        'Connection': 'keep-alive',
      },
      redirect: 'manual',
    });

    console.log('Login response status:', loginResponse.status);

    const loginCookies = loginResponse.headers.getSetCookie();
    if (loginCookies && loginCookies.length > 0) {
      for (const cookie of loginCookies) {
        const cookiePart = cookie.split(';')[0];
        if (cookiePart) {
          const [name] = cookiePart.split('=');
          const existingIndex = cookies.findIndex(c => c.startsWith(name + '='));
          if (existingIndex >= 0) {
            cookies[existingIndex] = cookiePart;
          } else {
            cookies.push(cookiePart);
          }
        }
      }
    }

    const finalCookies = cookies.join('; ');
    console.log('Step 3: Login complete. Final cookies:', finalCookies);

    console.log('Step 4: Verifying authentication...');
    const verifyResponse = await fetch('https://datapoint.center/dashboard/', {
      method: 'GET',
      headers: {
        'Cookie': finalCookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'manual',
    });

    console.log('Verify response status:', verifyResponse.status);
    const verifyText = await verifyResponse.text();
    const isLoggedIn = verifyText.includes('dashboard') || verifyText.includes('выход') || !verifyText.includes('auth_login');
    console.log('Is logged in:', isLoggedIn);

    return finalCookies;
  } catch (error) {
    console.error('Login error:', error);
    return '';
  }
}

function parseTableData(html: string): any {
  const data: any = {
    orders: 0,
    orderSum: 0,
    marginProfit: 0,
    allCalls: 0,
    profileCalls: 0,
    unprocessedCalls: 0,
    missedCalls: 0,
    missedNonTargetCalls: 0,
    employees: { total: 0, work: 0, pause: 0, stop: 0 }
  };

  try {
    console.log('Starting to parse HTML...');

    const ordersMatch = html.match(/Кол-во заказов:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (ordersMatch) {
      const cleanValue = ordersMatch[1].replace(/\s/g, '').trim();
      data.orders = parseInt(cleanValue) || 0;
      console.log('Orders found:', data.orders);
    } else {
      console.log('Orders not found');
    }

    const sumMatch = html.match(/Сумма заказов:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (sumMatch) {
      const cleanValue = sumMatch[1].replace(/\s/g, '').replace(',', '.').trim();
      data.orderSum = parseFloat(cleanValue) || 0;
      console.log('Order sum found:', data.orderSum);
    } else {
      console.log('Order sum not found');
    }

    const profitMatch = html.match(/М\. прибыль:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (profitMatch) {
      const cleanValue = profitMatch[1].replace(/\s/g, '').replace(',', '.').trim();
      data.marginProfit = parseFloat(cleanValue) || 0;
      console.log('Margin profit found:', data.marginProfit);
    } else {
      console.log('Margin profit not found');
    }

    const allCallsMatch = html.match(/Кол-во ВСЕХ звонков:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (allCallsMatch) {
      const cleanValue = allCallsMatch[1].replace(/\s/g, '').trim();
      data.allCalls = parseInt(cleanValue) || 0;
      console.log('All calls found:', data.allCalls);
    } else {
      console.log('All calls not found');
    }

    const profileCallsMatch = html.match(/Кол-во профильных звонков:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (profileCallsMatch) {
      const cleanValue = profileCallsMatch[1].replace(/\s/g, '').trim();
      data.profileCalls = parseInt(cleanValue) || 0;
      console.log('Profile calls found:', data.profileCalls);
    } else {
      console.log('Profile calls not found');
    }

    const unprocessedMatch = html.match(/Кол-во НЕОБРАБОТАННЫХ звонков:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (unprocessedMatch) {
      const cleanValue = unprocessedMatch[1].replace(/\s/g, '').trim();
      data.unprocessedCalls = parseInt(cleanValue) || 0;
      console.log('Unprocessed calls found:', data.unprocessedCalls);
    } else {
      console.log('Unprocessed calls not found');
    }

    const missedMatch = html.match(/Кол-во пропущенных:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (missedMatch) {
      const cleanValue = missedMatch[1].replace(/\s/g, '').trim();
      data.missedCalls = parseInt(cleanValue) || 0;
      console.log('Missed calls found:', data.missedCalls);
    } else {
      console.log('Missed calls not found');
    }

    const missedNonTargetMatch = html.match(/Кол-во пропущенных нецелевых:<\/td>\s*<td[^>]*>([^<]+)<\/td>/);
    if (missedNonTargetMatch) {
      const cleanValue = missedNonTargetMatch[1].replace(/\s/g, '').trim();
      data.missedNonTargetCalls = parseInt(cleanValue) || 0;
      console.log('Missed non-target calls found:', data.missedNonTargetCalls);
    } else {
      console.log('Missed non-target calls not found');
    }

    const workMatches = html.match(/data-type="pultstatus">Work<\/td>/g);
    const pauseMatches = html.match(/data-type="pultstatus">Pause<\/td>/g);
    const stopMatches = html.match(/data-type="pultstatus">Stop<\/td>/g);

    data.employees.work = workMatches ? workMatches.length : 0;
    data.employees.pause = pauseMatches ? pauseMatches.length : 0;
    data.employees.stop = stopMatches ? stopMatches.length : 0;
    data.employees.total = data.employees.work + data.employees.pause + data.employees.stop;

    console.log('Employees found - Work:', data.employees.work, 'Pause:', data.employees.pause, 'Stop:', data.employees.stop);
  } catch (error) {
    console.error('Error parsing table data:', error);
  }

  console.log('Final parsed data:', data);
  return data;
}

function calculatePercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function parseProcessTimeData(html: string): TimeInterval[] {
  const groups = {
    '0–5 мин': 0,
    '5–10 мин': 0,
    '10–15 мин': 0,
    '15–30 мин': 0,
    '30–60 мин': 0,
    '60–120 мин': 0,
    '120+ мин': 0
  };

  try {
    console.log('=== Starting process time parsing ===');

    const tableMatch = html.match(/<table[^>]*class="[^"]*shop-table[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
      console.log('Error: table.shop-table not found');
      return Object.keys(groups).map(label => ({ label, count: 0, percentage: 0 }));
    }

    const tableHtml = tableMatch[1];
    console.log('Found table.shop-table');

    const trMatches = tableHtml.matchAll(/<tr([^>]*)>([\s\S]*?)<\/tr>/gi);

    let processedRows = 0;
    const parsedData: Array<{ minutes: number; count: number }> = [];

    for (const trMatch of trMatches) {
      const trAttrs = trMatch[1];
      const trContent = trMatch[2];

      const hasOnclick = /onclick\s*=/i.test(trAttrs);
      const hasDataGroup = /data-group\s*=/i.test(trAttrs);

      if (hasOnclick && !hasDataGroup) {
        processedRows++;
        const text = trContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        const match = text.match(/^(\d+)\s+\((\d+)\s+процессов\)$/);
        if (match) {
          const minutes = parseInt(match[1]);
          const count = parseInt(match[2]);

          parsedData.push({ minutes, count });
          console.log(`Found row: ${minutes} мин (${count} процессов)`);
        }
      }
    }

    console.log(`Total level-1 rows found: ${processedRows}`);
    console.log(`Parsed data entries: ${parsedData.length}`);

    parsedData.forEach(({ minutes, count }) => {
      if (minutes <= 5) groups['0–5 мин'] += count;
      else if (minutes <= 10) groups['5–10 мин'] += count;
      else if (minutes <= 15) groups['10–15 мин'] += count;
      else if (minutes <= 30) groups['15–30 мин'] += count;
      else if (minutes <= 60) groups['30–60 мин'] += count;
      else if (minutes <= 120) groups['60–120 мин'] += count;
      else groups['120+ мин'] += count;
    });

    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    console.log(`Total processes: ${total}`);
    console.log('Groups:', JSON.stringify(groups));

    return Object.entries(groups).map(([label, count]) => ({
      label,
      count,
      percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
    }));
  } catch (error) {
    console.error('Error parsing process time data:', error);
    return Object.keys(groups).map(label => ({ label, count: 0, percentage: 0 }));
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get('debug') === 'true';

    console.log('=== Starting CRM data fetch ===');
    const cookies = await loginToCRM();

    console.log('=== Login process completed ===');
    console.log('Cookies obtained:', cookies ? 'Yes' : 'No');
    console.log('Cookies length:', cookies.length);

    if (!cookies) {
      throw new Error('Failed to authenticate');
    }

    const today = new Date().toISOString().split('T')[0];
    const filteredPageUrl = `https://datapoint.center/admin/report/desiner/101/view/?filter_order_cdatetype=now&filter_order_cdateperiod=mday&filter_user_roleid%5B%5D=39&filter_user_manageronline=online&filter_event_uservoip_que_source%5B%5D=%D0%9B%D0%95%D0%9D%D0%94%D0%98%D0%9D%D0%93&filter_event_uservoip_que_source%5B%5D=%D0%A1%D0%B0%D0%B9%D1%82%D1%8B&filter_event_uservoip_que_sourcechild=1&templateid=&ok=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C`;
    const totalPageUrl = `https://datapoint.center/admin/report/desiner/101/view/?filter_order_cdatefrom=${today}&filter_order_cdateto=${today}&filter_user_manageronline=online&filter_event_uservoip_que_sourcechild=1&templateid=&ok=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C`;
    const processTimeUrl = `https://datapoint.center/admin/report/desiner/132/view/?filter_order_cdatefrom=${today}&filter_order_cdateto=${today}&filter_order_sourceid%5B%5D=60&templateid=&ok=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C`;

    console.log('=== Fetching filtered data ===');
    const filteredResponse = await fetch(filteredPageUrl, {
      headers: {
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://datapoint.center/dashboard/',
      },
    });

    console.log('=== Fetching total data ===');
    const totalResponse = await fetch(totalPageUrl, {
      headers: {
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://datapoint.center/dashboard/',
      },
    });

    console.log('=== Fetching process time data ===');
    const processTimeResponse = await fetch(processTimeUrl, {
      headers: {
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://datapoint.center/dashboard/',
      },
    });

    const filteredData = await filteredResponse.text();
    const totalData = await totalResponse.text();
    const processTimeData = await processTimeResponse.text();

    console.log('Filtered response status:', filteredResponse.status);
    console.log('Total response status:', totalResponse.status);
    console.log('Process time response status:', processTimeResponse.status);

    if (debug) {
      return new Response(JSON.stringify({
        filteredHtml: filteredData,
        totalHtml: totalData,
        processTimeHtml: processTimeData,
        cookies: cookies
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const parsedFiltered = parseTableData(filteredData);
    const parsedTotal = parseTableData(totalData);
    const processTimeIntervals = parseProcessTimeData(processTimeData);

    console.log('Parsed filtered data:', JSON.stringify(parsedFiltered));
    console.log('Parsed total data:', JSON.stringify(parsedTotal));
    console.log('Parsed process time intervals:', JSON.stringify(processTimeIntervals));

    const result: MetricData = {
      orders: {
        value: parsedFiltered.orders,
        total: parsedTotal.orders,
        percentage: calculatePercentage(parsedFiltered.orders, parsedTotal.orders)
      },
      orderSum: {
        value: parsedFiltered.orderSum,
        total: parsedTotal.orderSum,
        percentage: calculatePercentage(parsedFiltered.orderSum, parsedTotal.orderSum)
      },
      marginProfit: {
        value: parsedFiltered.marginProfit,
        total: parsedTotal.marginProfit,
        percentage: calculatePercentage(parsedFiltered.marginProfit, parsedTotal.marginProfit)
      },
      allCalls: {
        value: parsedFiltered.allCalls,
        total: parsedTotal.allCalls,
        percentage: calculatePercentage(parsedFiltered.allCalls, parsedTotal.allCalls)
      },
      profileCalls: {
        value: parsedFiltered.profileCalls,
        total: parsedTotal.profileCalls,
        percentage: calculatePercentage(parsedFiltered.profileCalls, parsedTotal.profileCalls)
      },
      unprocessedCalls: {
        value: parsedFiltered.unprocessedCalls,
        total: parsedTotal.unprocessedCalls,
        percentage: calculatePercentage(parsedFiltered.unprocessedCalls, parsedTotal.unprocessedCalls)
      },
      missedCalls: {
        value: parsedFiltered.missedCalls,
        total: parsedTotal.missedCalls,
        percentage: calculatePercentage(parsedFiltered.missedCalls, parsedTotal.missedCalls)
      },
      missedNonTargetCalls: {
        value: parsedFiltered.missedNonTargetCalls,
        total: parsedTotal.missedNonTargetCalls,
        percentage: calculatePercentage(parsedFiltered.missedNonTargetCalls, parsedTotal.missedNonTargetCalls)
      },
      employees: {
        total: {
          value: parsedFiltered.employees.total,
          totalValue: parsedTotal.employees.total,
          percentage: calculatePercentage(parsedFiltered.employees.total, parsedTotal.employees.total)
        },
        work: {
          value: parsedFiltered.employees.work,
          totalValue: parsedTotal.employees.work,
          percentage: calculatePercentage(parsedFiltered.employees.work, parsedTotal.employees.work)
        },
        pause: {
          value: parsedFiltered.employees.pause,
          totalValue: parsedTotal.employees.pause,
          percentage: calculatePercentage(parsedFiltered.employees.pause, parsedTotal.employees.pause)
        },
        stop: {
          value: parsedFiltered.employees.stop,
          totalValue: parsedTotal.employees.stop,
          percentage: calculatePercentage(parsedFiltered.employees.stop, parsedTotal.employees.stop)
        }
      },
      processTimeIntervals
    };

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
