import { NTCBase } from './base'
import { NTCQueryOptions, NTCQueryResult } from './types'

export namespace NTCBrowser {
	function dynamicParam(name: string, params: Record<string, any>, search: URLSearchParams) {
		if (params[name] !== undefined || !search.has(name)) return
		params[name] = search.get(name)!
	}

	export async function queryDocument(
		target: string,
		params: Record<string, any>,
		opts?: NTCQueryOptions
	): Promise<NTCQueryResult> {
		const search = new URLSearchParams(document.location.search)

		dynamicParam('lang', params, search)
		dynamicParam('page', params, search)
		dynamicParam('theme', params, search)
		dynamicParam('layout', params, search)

		// Wordpress exception
		if (params['integration'] === 'wordpress-plugin') {
			dynamicParam('article', params, search)
			if (params['article'] != undefined) {
				params['page'] = params['article']
				delete params['article']
			}
		}

		const query = await NTCBase.queryDocument(target, params, opts)
		if (!query.ok) return query

		const data = query.data

		// HEAD
		for (let node of data.head) {
			// Exception for the <title>
			if (node.tagName === 'title') {
				document.title = node.innerText
				continue
			}

			// Create the HTMLElement with browser document
			const element = document.createElement(node.tagName) as HTMLElement

			// Assign all attributes
			for (let [key, value] of Object.entries<string>(node.attributes)) {
				element.setAttribute(key, value)
			}

			// Assign innerHTML/innerText if necessary
			if (node.innerHTML) element.innerHTML = node.innerHTML
			else if (node.innerText) element.innerText = node.innerText

			document.head.appendChild(element)
		}

		// META
		if (params.metadata === true) {
			for (let node of data.meta) {
				// Create the HTMLElement with browser document
				const element = document.createElement(node.tagName) as HTMLElement

				// Assign all attributes
				for (let [key, value] of Object.entries<string>(node.attributes)) {
					element.setAttribute(key, value)
				}

				document.head.appendChild(element)
			}
		}

		// STYLE
		const style = document.createElement('style')
		style.id = `NTC_style-${data.id}`
		style.innerHTML = data.style
		document.head.appendChild(style)

		// SCRIPT
		const script = document.createElement('script')
		script.id = `NTC_script-${data.id}`
		script.type = 'text/javascript'
		script.innerHTML = data.script
		document.head.appendChild(script)

		// BODY (nothing to do)

		return { ok: true, data: data.body }
	}
}
