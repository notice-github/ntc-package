import { NTCQueryOptions, NTCQueryResult } from './types'

class NTCQueryError extends Error {
	public status: number
	public type: string

	constructor(status: number, type: string) {
		super(`NTCQueryError: [${status}] ${type}`)
		this.status = status
		this.type = type
	}
}

export namespace NTCBase {
	async function query(url: URL, opts?: NTCQueryOptions): Promise<NTCQueryResult> {
		try {
			const data = await fetch(url, { signal: opts?.signal }).then((res) => {
				if (!res.ok) throw new NTCQueryError(res.status, res.statusText.toLowerCase().replace(/ /g, '_'))

				if (url.searchParams.get('format') === 'fragmented') return res.json()
				return res.text()
			})

			return { ok: true, data }
		} catch (err) {
			if (err instanceof NTCQueryError) {
				return { ok: false, error: err.type }
			} else if (typeof err === 'object' && err != null && 'name' in err && err.name === 'AbortError') {
				return { ok: false, error: 'aborted' }
			}

			return { ok: false, error: 'unknown' }
		}
	}

	export async function queryDocument(target: string, params: Record<string, any>, opts?: NTCQueryOptions) {
		// Defaults values
		params['format'] ??= 'fragmented'

		// URL composition
		const url = new URL(`https://bdn.notice.studio/document/${target}`)
		for (let [key, value] of Object.entries(params)) {
			if (url.searchParams.has(key)) continue
			url.searchParams.set(key, value)
		}

		// Fetch request
		return await query(url, opts)
	}

	export async function queryBody(target: string, params: Record<string, any>, opts?: NTCQueryOptions) {
		// Defaults values
		params['format'] ??= 'fragmented'

		// URL composition
		const url = new URL(`https://bdn.notice.studio/body/${target}`)
		for (let [key, value] of Object.entries(params)) {
			if (url.searchParams.has(key)) continue
			url.searchParams.set(key, value)
		}

		// Fetch request
		return await query(url, opts)
	}
}
