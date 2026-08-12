import { useState, useEffect } from 'react'

/**
 * Custom reusable hook to debounce any value changes.
 * @param value The value to be debounced (string, object, number, etc.)
 * @param delay Delay time in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
