/**
 * 等待指定毫秒
 */
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 将数组按照指定大小分块
 */
export function chunkArray<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('chunk size must be greater than 0');
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * 根据提供的键生成分组 Map
 */
export function groupBy<T, K extends keyof any>(items: T[], keySelector: (item: T) => K): Map<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keySelector(item);
    const group = acc.get(key) ?? [];
    group.push(item);
    acc.set(key, group);
    return acc;
  }, new Map<K, T[]>());
}

/**
 * 安全 JSON 解析，失败时返回默认值
 */
export function safeJsonParse<T>(value: string, defaultValue: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 过滤对象中的 null/undefined 属性
 */
export function omitNil<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce<Partial<T>>((acc, [k, v]) => {
    if (v !== null && v !== undefined) {
      acc[k as keyof T] = v as T[keyof T];
    }
    return acc;
  }, {});
}

/**
 * 字符串转布尔，支持常见 true/false 表示
 */
export function toBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n', 'off'].includes(normalized)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return defaultValue;
}

/**
 * 字符串转数字，失败则返回默认值
 */
export function toNumber(value: unknown, defaultValue = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : defaultValue;
}

/**
 * 带重试的异步执行器
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 100,
  onRetry?: (attempt: number, error: unknown) => void,
): Promise<T> {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      if (attempt > retries) {
        throw error;
      }
      onRetry?.(attempt, error);
      if (delayMs > 0) {
        await sleep(delayMs);
      }
    }
  }
}
