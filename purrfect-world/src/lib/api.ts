// All network access for Purrfect World lives here: no fake or hardcoded responses.

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type CatSource = 'thecatapi' | 'cataas' | 'meow' | 'mono'

export interface CatImage {
  id: string
  url: string
  width?: number
  height?: number
  breeds?: Breed[]
  source: CatSource
}

export interface Breed {
  id: string
  name: string
  origin: string
  temperament: string
  description: string
  life_span?: string
  weight?: { metric: string }
  wikipedia_url?: string
  reference_image_id?: string
  image?: { url: string }
  adaptability?: number
  affection_level?: number
  child_friendly?: number
  energy_level?: number
  intelligence?: number
  social_needs?: number
  hypoallergenic?: number
}

export interface CatFact {
  fact: string
  length: number
}

/* ---------- helpers ---------- */

async function getJson<T>(url: string, init?: RequestInit, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, { ...init, signal })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new ApiError('Network error: the cats could not be reached.', 0)
  }
  if (!res.ok) throw new ApiError(`Request failed with status ${res.status}`, res.status)
  try {
    return (await res.json()) as T
  } catch {
    throw new ApiError('The server sent something that was not valid JSON.', 502)
  }
}

const bust = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/* ---------- API: The Cat API · images/search ---------- */

const CAT_API = 'https://api.thecatapi.com/v1'
// Use The Cat API's public demo key unless a personal key is configured.
const CAT_KEY = (import.meta.env.VITE_CAT_API_KEY as string | undefined) || 'DEMO-API-KEY'
const catHeaders = (): HeadersInit => (CAT_KEY ? { 'x-api-key': CAT_KEY } : {})

interface RawCatImage {
  id: string
  url: string
  width?: number
  height?: number
  breeds?: Breed[]
}

export async function fetchRandomCats(limit = 1, opts: { hasBreeds?: boolean; signal?: AbortSignal } = {}): Promise<CatImage[]> {
  const qs = new URLSearchParams({ limit: String(limit), size: 'med', mime_types: 'jpg,png' })
  if (opts.hasBreeds) qs.set('has_breeds', '1')
  const data = await getJson<RawCatImage[]>(`${CAT_API}/images/search?${qs}`, { headers: catHeaders() }, opts.signal)
  return data.map((d) => ({ ...d, source: 'thecatapi' as const }))
}

/* ---------- API: The Cat API · breeds ---------- */

let breedsCache: Breed[] | null = null

export const breedImageUrl = (b: Breed): string | undefined =>
  b.image?.url ?? (b.reference_image_id ? `https://cdn2.thecatapi.com/images/${b.reference_image_id}.jpg` : undefined)

export async function fetchBreeds(signal?: AbortSignal): Promise<Breed[]> {
  if (breedsCache) return breedsCache
  const data = await getJson<Breed[]>(`${CAT_API}/breeds`, { headers: catHeaders() }, signal)
  breedsCache = data
  return data
}

/* ---------- API: Cataas ---------- */

const CATAAS = 'https://cataas.com'

/** Plain random cat: https://cataas.com/cat */
export async function fetchCataasCat(signal?: AbortSignal): Promise<CatImage> {
  // Prefer the JSON form so the picture has a stable id we can favourite.
  try {
    const j = await getJson<{ id?: string; _id?: string; url?: string }>(`${CATAAS}/cat?json=true&t=${bust()}`, undefined, signal)
    const id = j.id ?? j._id
    if (id) return { id: `cataas-${id}`, url: `${CATAAS}/cat/${id}`, source: 'cataas' }
    if (j.url) return { id: `cataas-${j.url}`, url: j.url.startsWith('http') ? j.url : `${CATAAS}${j.url}`, source: 'cataas' }
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
  }
  const t = bust()
  return { id: `cataas-${t}`, url: `${CATAAS}/cat?t=${t}`, source: 'cataas' }
}

/** https://cataas.com/cat/cute/says/Meow  (+ optional ?filter=mono) */
export function meowUrl(text = 'Meow', mono = false, nonce = bust()): string {
  const safe = encodeURIComponent(text.trim() || 'Meow')
  const params = new URLSearchParams()
  if (mono) params.set('filter', 'mono')
  params.set('t', nonce)
  return `${CATAAS}/cat/cute/says/${safe}?${params}`
}

export function meowCat(text = 'Meow', mono = false): CatImage {
  const nonce = bust()
  return { id: `meow-${mono ? 'mono' : 'color'}-${text}-${nonce}`, url: meowUrl(text, mono, nonce), source: mono ? 'mono' : 'meow' }
}

/* ---------- API: Cat Facts (catfact.ninja) ---------- */

const FACTS = 'https://catfact.ninja'

export const fetchCatFact = (signal?: AbortSignal) => getJson<CatFact>(`${FACTS}/fact`, undefined, signal)

interface FactsPage {
  total: number
  data: CatFact[]
}

/** Deterministic "fact of the day": same fact all day for everyone, cached locally. */
export async function fetchDailyFact(signal?: AbortSignal): Promise<CatFact> {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const cached = JSON.parse(localStorage.getItem('pw-daily-fact') || 'null') as { date: string; fact: CatFact } | null
    if (cached?.date === today) return cached.fact
  } catch { /* ignore */ }

  const head = await getJson<FactsPage>(`${FACTS}/facts?limit=1`, undefined, signal)
  const total = Math.max(1, head.total)
  const dayNumber = Math.floor(new Date(today).getTime() / 86_400_000)
  const page = (dayNumber % total) + 1
  const one = await getJson<FactsPage>(`${FACTS}/facts?limit=1&page=${page}`, undefined, signal)
  const fact = one.data[0]
  if (!fact) throw new ApiError('No daily fact available', 404)
  try { localStorage.setItem('pw-daily-fact', JSON.stringify({ date: today, fact })) } catch { /* ignore */ }
  return fact
}

/* ---------- API: Cat Facts OpenAPI docs ---------- */

export interface DocEndpoint {
  method: string
  path: string
  summary: string
  tags: string[]
}

interface OpenApiDoc {
  info?: { title?: string; version?: string; description?: string }
  paths?: Record<string, Record<string, { summary?: string; description?: string; tags?: string[] }>>
}

export interface ApiDocs {
  title: string
  version: string
  description: string
  endpoints: DocEndpoint[]
}

export async function fetchApiDocs(signal?: AbortSignal): Promise<ApiDocs> {
  const doc = await getJson<OpenApiDoc>(`${FACTS}/docs?api-docs.json`, undefined, signal)
  const endpoints: DocEndpoint[] = []
  for (const [path, methods] of Object.entries(doc.paths ?? {})) {
    for (const [method, def] of Object.entries(methods)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue
      endpoints.push({ method: method.toUpperCase(), path, summary: def.summary || def.description || '', tags: def.tags ?? [] })
    }
  }
  return {
    title: doc.info?.title ?? 'Cat Facts API',
    version: doc.info?.version ?? '',
    description: doc.info?.description ?? '',
    endpoints,
  }
}

/* ---------- API: http.cat ---------- */

export const httpCatUrl = (code: number | string) => `https://http.cat/${code}`

export const HTTP_CODES: { code: number; label: string }[] = [
  { code: 100, label: 'Continue' }, { code: 101, label: 'Switching Protocols' }, { code: 200, label: 'OK' },
  { code: 201, label: 'Created' }, { code: 202, label: 'Accepted' }, { code: 204, label: 'No Content' },
  { code: 301, label: 'Moved Permanently' }, { code: 302, label: 'Found' }, { code: 304, label: 'Not Modified' },
  { code: 400, label: 'Bad Request' }, { code: 401, label: 'Unauthorized' }, { code: 403, label: 'Forbidden' },
  { code: 404, label: 'Not Found' }, { code: 408, label: 'Request Timeout' }, { code: 409, label: 'Conflict' },
  { code: 418, label: "I'm a teapot" }, { code: 429, label: 'Too Many Requests' }, { code: 451, label: 'Unavailable For Legal Reasons' },
  { code: 500, label: 'Internal Server Error' }, { code: 502, label: 'Bad Gateway' }, { code: 503, label: 'Service Unavailable' },
  { code: 504, label: 'Gateway Timeout' },
]

/* ---------- misc ---------- */

export const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe4ee"/><stop offset="1" stop-color="#ece4ff"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="215" font-size="110" text-anchor="middle">😿</text><text x="200" y="290" font-size="22" text-anchor="middle" fill="#8559e0" font-family="sans-serif">this cat is napping</text></svg>`,
  )

export function describeError(e: unknown): { message: string; status: number } {
  if (e instanceof ApiError) return { message: e.message, status: e.status }
  return { message: (e as Error)?.message || 'Something went wrong', status: 0 }
}
