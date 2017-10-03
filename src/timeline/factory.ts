import {createToken} from './token'

export type EmitterCallback = () => void

// This Emitter object is needed because pausing and
// resuming can happen multiple times (rather than just
// once, like cancel, which can be a Promise.)
export interface Emitter {
	onemit(cb: EmitterCallback): void
	emit(): void
}

export function Emitter(): Emitter {
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

/**
 * A pauseable, resumable, cancelable Promise
 */
export type TimelinePromise<T> = Promise<T> & {
	pause(): void
	resume(): void
	cancel(): void
	canceled: Promise<void>
}

export type DelayFactory<T> = (
	canceled: Promise<void>, paused: Emitter, resumed: Emitter,
	obj: T
) => Promise<void>

export type TimelineCallback<T> = (
	...delays: ((obj: any) => Promise<void>)[]
) => Promise<T>

/**
 * Variadic types for TimelineFactory.
 * (Written out in longhand. Add more if needed...)
 */
export interface TF {
	<R,O1>(df1: DelayFactory<O1>): (f: (d1: (o1: O1) => void) => Promise<void>) => TimelinePromise<R>
	<R,O1,O2>(df1: DelayFactory<O1>, df2: DelayFactory<O2>): (f: (d1: (o1: O1) => void, d2: (o2: O2) => void) => Promise<R>) => TimelinePromise<R>
	<R,O1,O2,O3>(df1: DelayFactory<O1>, df2: DelayFactory<O2>, df3: DelayFactory<O3>): (f: (d1: (o1: O1) => void, d2: (o2: O2) => void, d3: (o3: O3) => void) => Promise<R>) => TimelinePromise<R>
}

/**
 * Generic Timeline Factory.
 * Supply one or more custom DelayFactories to create a usable Timeline.
 */
export const TimelineFactory: TF = function<R,O>(...delayFactories: DelayFactory<any>[]) {
	return function Timeline(f: TimelineCallback<R>): TimelinePromise<R> {
		const [canceled, cancel] = createToken<void>()
		const pauseEmitter = Emitter()
		const resumeEmitter = Emitter()
		const delays = delayFactories.map(
			df => (obj: any) => df(canceled, pauseEmitter, resumeEmitter, obj)
		)
		const tp: TimelinePromise<R> = f(...delays) as any
		tp.pause = pauseEmitter.emit
		tp.resume = resumeEmitter.emit
		tp.cancel = cancel
		tp.canceled = canceled
		return tp
	}
}
