import { useCallback, useEffect, useRef, useState } from 'react'
import { describeError } from '../lib/api'

interface State<T> {
  data: T | null
  loading: boolean
  error: { message: string; status: number } | null
}

/** Runs an async function, tracks loading/error, cancels stale requests, exposes reload(). */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, deps: unknown[] = [], auto = true) {
  const [state, setState] = useState<State<T>>({ data: null, loading: auto, error: null })
  const ctrl = useRef<AbortController | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async () => {
    ctrl.current?.abort()
    const c = new AbortController()
    ctrl.current = c
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fnRef.current(c.signal)
      if (!c.signal.aborted) setState({ data, loading: false, error: null })
      return data
    } catch (e) {
      if ((e as Error).name === 'AbortError') return null
      if (!c.signal.aborted) setState((s) => ({ ...s, loading: false, error: describeError(e) }))
      return null
    }
  }, [])

  useEffect(() => {
    if (auto) void run()
    return () => ctrl.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, ...deps])

  return { ...state, reload: run }
}
