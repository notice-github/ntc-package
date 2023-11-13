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
	serverURL?: string
}

export type NTCQueryResult<T = any> = { ok: true; data: T } | { ok: false; error: string }

export interface NTCWebElement {
	tagName: string
	attributes?: Record<string, string>
	innerText?: string
	innerHTML?: string
}

export interface NTCDocument {
	id: string
	head: NTCWebElement[]
	meta?: NTCWebElement[]
	style: string
	script: string
	body: string
}
