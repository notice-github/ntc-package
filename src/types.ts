export interface NTCParams {
	pageId: string
	lang?: string
	theme?: 'light' | 'dark'
	navigationType?: 'query' | 'slash' | 'memory'
	layout?: 'empty' | 'page' | 'full'
	metadata?: boolean
}

export interface NTCQueryOptions {
	signal?: AbortSignal
	format?: 'html' | 'markdown' | 'fragmented'
}

export type NTCQueryResult = { ok: true; data: any } | { ok: false; error: string }
