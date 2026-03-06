<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Конфигурация сессий
$sessionConfigs = [
    'ecommerce' => [
        'login' => 'German',
        'password' => 'K9#bT2!mQ8vX*zL4',
        'roleId' => '39',
        'sourceFilter' => ['ЛЕНДИНГ', 'Сайты'],
        'processTimeSourceId' => '60',
    ],
    'diar' => [
        'login' => 'Zaharchenko',
        'password' => 'Zaharchenko1234',
        'roleId' => '9',
        'sourceFilter' => ['ДИАР_Укр'],
        'processTimeSourceId' => '4',
    ],
    'rozpakuj' => [
        'login' => 'Zaharchenko',
        'password' => 'Zaharchenko1234',
        'roleId' => '9',
        'sourceFilter' => ['Трансляция канала Розпакуй ТВ'],
        'processTimeSourceId' => '65',
    ],
];

// Получаем параметры
$session = strtolower($_GET['session'] ?? 'ecommerce');
$debug = isset($_GET['debug']) && $_GET['debug'] === 'true';

error_log("=== FUNCTION CALLED ===");
error_log("Session: $session");
error_log("Method: " . $_SERVER['REQUEST_METHOD']);

if (!isset($sessionConfigs[$session])) {
    http_response_code(400);
    echo json_encode(['error' => "Invalid session: $session"]);
    exit;
}

$config = $sessionConfigs[$session];

error_log("Using config: " . json_encode($config));

// Функция логина в CRM
function loginToCRM($config) {
    $loginUrl = 'https://datapoint.center/';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $loginUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    ]);
    
    $response = curl_exec($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    curl_close($ch);
    
    // Извлекаем cookies
    preg_match_all('/Set-Cookie: ([^;]+)/', $headers, $matches);
    $cookies = [];
    if (!empty($matches[1])) {
        foreach ($matches[1] as $cookie) {
            $cookies[] = $cookie;
        }
    }
    
    // Логин
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $loginUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'auth_login' => $config['login'],
        'auth_password' => $config['password'],
    ]));
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Cookie: ' . implode('; ', $cookies),
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer: ' . $loginUrl,
        'Origin: https://datapoint.center',
    ]);
    
    $response = curl_exec($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $headerSize);
    curl_close($ch);
    
    // Обновляем cookies
    preg_match_all('/Set-Cookie: ([^;]+)/', $headers, $matches);
    if (!empty($matches[1])) {
        foreach ($matches[1] as $cookie) {
            $cookieName = explode('=', $cookie)[0];
            $found = false;
            foreach ($cookies as $i => $existingCookie) {
                if (strpos($existingCookie, $cookieName . '=') === 0) {
                    $cookies[$i] = $cookie;
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $cookies[] = $cookie;
            }
        }
    }
    
    return implode('; ', $cookies);
}

// Функция парсинга данных из HTML
function parseTableData($html) {
    $data = [
        'orders' => 0,
        'orderSum' => 0,
        'marginProfit' => 0,
        'allCalls' => 0,
        'profileCalls' => 0,
        'unprocessedCalls' => 0,
        'missedCalls' => 0,
        'missedNonTargetCalls' => 0,
        'employees' => ['total' => 0, 'work' => 0, 'pause' => 0, 'stop' => 0]
    ];
    
    // Парсим заказы
    if (preg_match('/Кол-во заказов:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['orders'] = (int) preg_replace('/\s/', '', $matches[1]);
    }
    
    // Парсим сумму заказов
    if (preg_match('/Сумма заказов:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['orderSum'] = (float) str_replace([',', ' '], ['.', ''], $matches[1]);
    }
    
    // Парсим прибыль
    if (preg_match('/М\. прибыль:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['marginProfit'] = (float) str_replace([',', ' '], ['.', ''], $matches[1]);
    }
    
    // Парсим звонки
    if (preg_match('/Кол-во ВСЕХ звонков:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['allCalls'] = (int) preg_replace('/\s/', '', $matches[1]);
    }
    
    if (preg_match('/Кол-во профильных звонков:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['profileCalls'] = (int) preg_replace('/\s/', '', $matches[1]);
    }
    
    if (preg_match('/Кол-во НЕОБРАБОТАННЫХ звонков:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['unprocessedCalls'] = (int) preg_replace('/\s/', '', $matches[1]);
    }
    
    if (preg_match('/Кол-во пропущенных:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['missedCalls'] = (int) preg_replace('/\s/', '', $matches[1]);
    }
    
    if (preg_match('/Кол-во пропущенных нецелевых:<\/td>\s*<td[^>]*>([^<]+)<\/td>/', $html, $matches)) {
        $data['missedNonTargetCalls'] = (int) preg_replace('/\s/', '', $matches[1]);
    }
    
    // Парсим сотрудников
    preg_match_all('/data-type="pultstatus">Work<\/td>/', $html, $workMatches);
    preg_match_all('/data-type="pultstatus">Pause<\/td>/', $html, $pauseMatches);
    preg_match_all('/data-type="pultstatus">Stop<\/td>/', $html, $stopMatches);
    
    $data['employees']['work'] = count($workMatches[0]);
    $data['employees']['pause'] = count($pauseMatches[0]);
    $data['employees']['stop'] = count($stopMatches[0]);
    $data['employees']['total'] = $data['employees']['work'] + $data['employees']['pause'] + $data['employees']['stop'];
    
    return $data;
}

// Функция парсинга времени обработки
function parseProcessTimeData($html) {
    $groups = [
        '0–5 мин' => 0,
        '5–10 мин' => 0,
        '10–15 мин' => 0,
        '15–30 мин' => 0,
        '30–60 мин' => 0,
        '60–120 мин' => 0,
        '120+ мин' => 0
    ];
    
    if (preg_match('/<table[^>]*class="[^"]*shop-table[^"]*"[^>]*>([\s\S]*?)<\/table>/i', $html, $tableMatch)) {
        $tableHtml = $tableMatch[1];
        
        if (preg_match_all('/<tr([^>]*)>([\s\S]*?)<\/tr>/i', $tableHtml, $trMatches, PREG_SET_ORDER)) {
            foreach ($trMatches as $trMatch) {
                $trAttrs = $trMatch[1];
                $trContent = $trMatch[2];
                
                $hasOnclick = preg_match('/onclick\s*=/i', $trAttrs);
                $hasDataGroup = preg_match('/data-group\s*=/i', $trAttrs);
                
                if ($hasOnclick && !$hasDataGroup) {
                    $text = preg_replace('/<[^>]+>/', ' ', $trContent);
                    $text = preg_replace('/\s+/', ' ', trim($text));
                    
                    if (preg_match('/^(\d+)\s+\((\d+)\s+процессов\)$/', $text, $match)) {
                        $minutes = (int) $match[1];
                        $count = (int) $match[2];
                        
                        if ($minutes <= 5) $groups['0–5 мин'] += $count;
                        elseif ($minutes <= 10) $groups['5–10 мин'] += $count;
                        elseif ($minutes <= 15) $groups['10–15 мин'] += $count;
                        elseif ($minutes <= 30) $groups['15–30 мин'] += $count;
                        elseif ($minutes <= 60) $groups['30–60 мин'] += $count;
                        elseif ($minutes <= 120) $groups['60–120 мин'] += $count;
                        else $groups['120+ мин'] += $count;
                    }
                }
            }
        }
    }
    
    $total = array_sum($groups);
    $result = [];
    foreach ($groups as $label => $count) {
        $result[] = [
            'label' => $label,
            'count' => $count,
            'percentage' => $total > 0 ? round(($count / $total) * 100, 1) : 0
        ];
    }
    
    return $result;
}

// Функция расчета процента
function calculatePercentage($value, $total) {
    if ($total == 0) return '0%';
    return round(($value / $total) * 100, 1) . '%';
}

try {
    // Логин
    $cookies = loginToCRM($config);
    
    if (empty($cookies)) {
        throw new Exception('Failed to authenticate');
    }
    
    error_log("Login successful for session: $session, User: " . $config['login']);
    
    $today = date('Y-m-d');
    
    // Формируем URL для отфильтрованных данных
    $sourceParams = [];
    foreach ($config['sourceFilter'] as $source) {
        $sourceParams[] = 'filter_event_uservoip_que_source%5B%5D=' . urlencode($source);
    }
    $sourceParamsStr = implode('&', $sourceParams);
    
    $filteredPageUrl = "https://datapoint.center/admin/report/desiner/101/view/?filter_order_cdatetype=now&filter_order_cdateperiod=mday&filter_user_roleid%5B%5D={$config['roleId']}&filter_user_manageronline=online&{$sourceParamsStr}&filter_event_uservoip_que_sourcechild=1&templateid=&ok=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C";
    $totalPageUrl = "https://datapoint.center/admin/report/desiner/101/view/?filter_order_cdatefrom={$today}&filter_order_cdateto={$today}&filter_user_manageronline=online&filter_event_uservoip_que_sourcechild=1&templateid=&ok=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C";
    $processTimeUrl = "https://datapoint.center/admin/report/desiner/132/view/?filter_order_cdatefrom={$today}&filter_order_cdateto={$today}&filter_order_sourceid%5B%5D={$config['processTimeSourceId']}&templateid=&ok=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C";
    
    error_log("Filtered URL: $filteredPageUrl");
    error_log("Process Time URL: $processTimeUrl");
    
    // Получаем данные
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $filteredPageUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Cookie: ' . $cookies,
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer: https://datapoint.center/dashboard/',
    ]);
    $filteredData = curl_exec($ch);
    curl_close($ch);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $totalPageUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Cookie: ' . $cookies,
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer: https://datapoint.center/dashboard/',
    ]);
    $totalData = curl_exec($ch);
    curl_close($ch);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $processTimeUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Cookie: ' . $cookies,
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer: https://datapoint.center/dashboard/',
    ]);
    $processTimeData = curl_exec($ch);
    curl_close($ch);
    
    if ($debug) {
        echo json_encode([
            'filteredHtml' => substr($filteredData, 0, 1000),
            'totalHtml' => substr($totalData, 0, 1000),
            'processTimeHtml' => substr($processTimeData, 0, 1000),
            'cookies' => $cookies,
            'session' => $session,
            'config' => $config,
        ]);
        exit;
    }
    
    $parsedFiltered = parseTableData($filteredData);
    $parsedTotal = parseTableData($totalData);
    $processTimeIntervals = parseProcessTimeData($processTimeData);
    
    error_log("Parsed filtered orders: " . $parsedFiltered['orders']);
    error_log("Parsed total orders: " . $parsedTotal['orders']);
    
    $result = [
        'orders' => [
            'value' => $parsedFiltered['orders'],
            'total' => $parsedTotal['orders'],
            'percentage' => calculatePercentage($parsedFiltered['orders'], $parsedTotal['orders'])
        ],
        'orderSum' => [
            'value' => $parsedFiltered['orderSum'],
            'total' => $parsedTotal['orderSum'],
            'percentage' => calculatePercentage($parsedFiltered['orderSum'], $parsedTotal['orderSum'])
        ],
        'marginProfit' => [
            'value' => $parsedFiltered['marginProfit'],
            'total' => $parsedTotal['marginProfit'],
            'percentage' => calculatePercentage($parsedFiltered['marginProfit'], $parsedTotal['marginProfit'])
        ],
        'allCalls' => [
            'value' => $parsedFiltered['allCalls'],
            'total' => $parsedTotal['allCalls'],
            'percentage' => calculatePercentage($parsedFiltered['allCalls'], $parsedTotal['allCalls'])
        ],
        'profileCalls' => [
            'value' => $parsedFiltered['profileCalls'],
            'total' => $parsedTotal['profileCalls'],
            'percentage' => calculatePercentage($parsedFiltered['profileCalls'], $parsedTotal['profileCalls'])
        ],
        'unprocessedCalls' => [
            'value' => $parsedFiltered['unprocessedCalls'],
            'total' => $parsedTotal['unprocessedCalls'],
            'percentage' => calculatePercentage($parsedFiltered['unprocessedCalls'], $parsedTotal['unprocessedCalls'])
        ],
        'missedCalls' => [
            'value' => $parsedFiltered['missedCalls'],
            'total' => $parsedTotal['missedCalls'],
            'percentage' => calculatePercentage($parsedFiltered['missedCalls'], $parsedTotal['missedCalls'])
        ],
        'missedNonTargetCalls' => [
            'value' => $parsedFiltered['missedNonTargetCalls'],
            'total' => $parsedTotal['missedNonTargetCalls'],
            'percentage' => calculatePercentage($parsedFiltered['missedNonTargetCalls'], $parsedTotal['missedNonTargetCalls'])
        ],
        'employees' => [
            'total' => [
                'value' => $parsedFiltered['employees']['total'],
                'totalValue' => $parsedTotal['employees']['total'],
                'percentage' => calculatePercentage($parsedFiltered['employees']['total'], $parsedTotal['employees']['total'])
            ],
            'work' => [
                'value' => $parsedFiltered['employees']['work'],
                'totalValue' => $parsedTotal['employees']['work'],
                'percentage' => calculatePercentage($parsedFiltered['employees']['work'], $parsedTotal['employees']['work'])
            ],
            'pause' => [
                'value' => $parsedFiltered['employees']['pause'],
                'totalValue' => $parsedTotal['employees']['pause'],
                'percentage' => calculatePercentage($parsedFiltered['employees']['pause'], $parsedTotal['employees']['pause'])
            ],
            'stop' => [
                'value' => $parsedFiltered['employees']['stop'],
                'totalValue' => $parsedTotal['employees']['stop'],
                'percentage' => calculatePercentage($parsedFiltered['employees']['stop'], $parsedTotal['employees']['stop'])
            ]
        ],
        'processTimeIntervals' => $processTimeIntervals
    ];
    
    echo json_encode($result);
    
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch data',
        'details' => $e->getMessage()
    ]);
}
?>
