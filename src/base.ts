import { NTCQueryOptions, NTCQueryResult } from './types'

export namespace NTCBase {
	async function query(url: URL, opts?: NTCQueryOptions): Promise<NTCQueryResult> {
		try {
			const data = await fetch(url, { signal: opts?.signal }).then((res) => {
				if (!res.ok) throw new Error('Request Error')

				if (opts?.format === 'fragmented') return res.json()
				return res.text()
			})

			return { ok: true, data }
		} catch (err: any) {
			if (err.name === 'AbortError') return { ok: false, error: 'aborted' }
			return { ok: false, error: err.name }
		}
	}

	export async function queryDocument(
		target: string,
		params: Record<string, any>,
		opts?: NTCQueryOptions
	): Promise<NTCQueryResult> {
		// Defaults values
		opts ??= {}
		opts.format ??= 'fragmented'

		// URL composition
		const url = new URL(`https://bdn.notice.studio/document/${target}?format=${opts.format}`)
		for (let [key, value] of Object.entries(params)) {
			if (url.searchParams.has(key)) continue
			url.searchParams.set(key, value)
		}

		// Fetch request
		return await query(url, opts)
	}
}
