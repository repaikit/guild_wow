/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncates a string to a specified length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a URL-friendly slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Checks if the code is running in the browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Gets a value from localStorage with type safety
 */
export function getFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  
  const item = localStorage.getItem(key);
  if (!item) return fallback;
  
  return safeJsonParse<T>(item, fallback);
}

/**
 * Sets a value in localStorage with type safety
 */
export function setInStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  
  localStorage.setItem(key, JSON.stringify(value));
}