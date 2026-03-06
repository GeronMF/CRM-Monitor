export interface MetricValue {
  value: number;
  total: number;
  percentage: string;
}

export interface EmployeeMetrics {
  total: { value: number; totalValue: number; percentage: string };
  work: { value: number; totalValue: number; percentage: string };
  pause: { value: number; totalValue: number; percentage: string };
  stop: { value: number; totalValue: number; percentage: string };
}

export interface TimeInterval {
  label: string;
  count: number;
  percentage: number;
}

export interface MetricData {
  orders: MetricValue;
  orderSum: MetricValue;
  marginProfit: MetricValue;
  allCalls: MetricValue;
  profileCalls: MetricValue;
  unprocessedCalls: MetricValue;
  missedCalls: MetricValue;
  missedNonTargetCalls: MetricValue;
  employees: EmployeeMetrics;
  processTimeIntervals: TimeInterval[];
}
