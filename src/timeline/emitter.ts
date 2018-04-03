export type EmitterCallback = () => void

// This Emitter object is needed because pausing and
// resuming can happen multiple times (rather than just
// once, like cancel, which can be a Promise.)
interface Emitter {
	onemit(cb: EmitterCallback): void
	emit(): void
}

function Emitter(): Emitter {
	const callbacks: EmitterCallback[] = []
	return {
		onemit(cb: EmitterCallback) {
			callbacks.push(cb)
		},
		emit() {
			for (let i = 0; i < callbacks.length; ++i) {
				callbacks[i]()
			}
		}
	}
}

export default Emitter
