<?php
/**
 * Кэш интервалов «скорость обработки» (отчёт 132): обновление не чаще чем раз в 10 минут.
 * Файлы в api/ — не коммитятся (.gitignore).
 */
if (!defined('CRM_PROCESS_TIME_CACHE_TTL')) {
    define('CRM_PROCESS_TIME_CACHE_TTL', 600);
}

function crm_process_time_cache_path(string $dashboardKey): string {
    $safe = preg_replace('/[^a-z0-9_-]/i', '', $dashboardKey);
    if ($safe === '') {
        $safe = 'default';
    }
    return __DIR__ . '/.cache-process-time-' . $safe . '.json';
}

/**
 * @return array|null массив интервалов или null если кэша нет / истёк
 */
function crm_process_time_cache_get(string $dashboardKey): ?array {
    $path = crm_process_time_cache_path($dashboardKey);
    if (!is_readable($path)) {
        return null;
    }
    $raw = @file_get_contents($path);
    if ($raw === false || $raw === '') {
        return null;
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['ts'], $data['intervals']) || !is_array($data['intervals'])) {
        return null;
    }
    if ((time() - (int) $data['ts']) > CRM_PROCESS_TIME_CACHE_TTL) {
        return null;
    }
    return $data['intervals'];
}

function crm_process_time_cache_set(string $dashboardKey, array $intervals): void {
    $path = crm_process_time_cache_path($dashboardKey);
    $payload = json_encode(
        ['ts' => time(), 'intervals' => $intervals],
        JSON_UNESCAPED_UNICODE
    );
    if ($payload === false) {
        return;
    }
    @file_put_contents($path, $payload, LOCK_EX);
}
