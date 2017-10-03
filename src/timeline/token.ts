/** Returns a promise and its resolve callback */
export function createToken<T = void>(): [Promise<T>, (t?: T) => void] {
	let resolve: (t?: T) => void = undefined as any
	const promise = new Promise<T>(r => {resolve = r})
	return [promise, resolve]
}
