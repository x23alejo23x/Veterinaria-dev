import { useEffect, useState } from 'react'

/**
 * Retrasa el valor hasta que el usuario deje de escribir.
 *
 * @param {*}      value  — valor a debouncear
 * @param {number} delay  — ms de espera (default 300)
 *
 * @example
 *   const debouncedSearch = useDebounce(search, 300)
 *   // usar debouncedSearch para filtrar en vez de search
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
