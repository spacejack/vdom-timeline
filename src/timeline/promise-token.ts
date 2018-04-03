type PromiseToken<T> = [Promise<T>, (t?: T) => void]

/** Returns a promise and its resolve callback */
function PromiseToken<T = void>(): PromiseToken<T> {
	let resolve: (t?: T) => void = undefined as any
	const promise = new Promise<T>(r => {resolve = r})
	return [promise, resolve]
}

export default PromiseToken
