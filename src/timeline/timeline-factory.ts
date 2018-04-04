import PromiseToken from './promise-token'
import Emitter from './emitter'

/**
 * A pauseable, resumable, cancelable Promise
 */
export type TimelinePromise<T> = Promise<T> & {
	pause(): void
	resume(): void
	cancel(): void
	canceled: Promise<void>
}

/** Signature for DelayFactory */
export type DelayFactory<T> = (
	canceled: Promise<void>, paused: Emitter, resumed: Emitter,
	obj: T
) => Promise<void>

/** Signature for TimelineExecutor */
export type TimelineExecutor<T> = (
	...delays: ((obj: any) => Promise<void>)[]
) => Promise<T>

/**
 * The Timeline function returns a cancellable, pauseable and resumable Promise.
 * The body of the executor contains async logic for the timeline that can be
 * cancelled, paused and resumed.
 */
export type Timeline<T> = (executor: TimelineExecutor<T>) => TimelinePromise<T>

/**
 * Variadic types for TimelineFactory.
 * (Written out in longhand. Add more if needed...)
 */
interface TimelineFactory {
	<R,O1>(df1: DelayFactory<O1>): (f: (d1: (o1: O1) => void) => Promise<void>) => TimelinePromise<R>
	<R,O1,O2>(df1: DelayFactory<O1>, df2: DelayFactory<O2>): (f: (d1: (o1: O1) => void, d2: (o2: O2) => void) => Promise<R>) => TimelinePromise<R>
	<R,O1,O2,O3>(df1: DelayFactory<O1>, df2: DelayFactory<O2>, df3: DelayFactory<O3>): (f: (d1: (o1: O1) => void, d2: (o2: O2) => void, d3: (o3: O3) => void) => Promise<R>) => TimelinePromise<R>
}

/**
 * Generic Timeline Factory.
 * Supply one or more custom DelayFactories to create a usable Timeline.
 */
const TimelineFactory: TimelineFactory = function<R,O>(...delayFactories: DelayFactory<any>[]): Timeline<R> {
	return function Timeline(executor: TimelineExecutor<R>): TimelinePromise<R> { // tslint:disable-line no-shadowed-variable
		const [canceled, cancel] = PromiseToken<void>()
		const pauseEmitter = Emitter()
		const resumeEmitter = Emitter()
		const delays = delayFactories.map(
			df => (obj: any) => df(canceled, pauseEmitter, resumeEmitter, obj)
		)
		const tp: TimelinePromise<R> = executor(...delays) as any
		tp.pause = pauseEmitter.emit
		tp.resume = resumeEmitter.emit
		tp.cancel = cancel
		tp.canceled = canceled
		return tp
	}
}

export default TimelineFactory
