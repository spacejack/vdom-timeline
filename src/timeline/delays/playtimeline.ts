import Emitter from '../emitter'
import PromiseToken from '../promise-token'
import {TimelinePromise, DelayFactory} from '../timeline-factory'

/**
 * Creates a cancelable, pausable/resumable delay.
 * Accepts a Timeline.
 */
const PlayTimeline: DelayFactory<TimelinePromise<any>> = function(
	canceled: Promise<void>, paused: Emitter, resumed: Emitter,
	timeline: TimelinePromise<any>
) {
	const [promise, resolve] = PromiseToken<void>()

	canceled.then(() => {
		timeline.cancel()
	})

	paused.onemit(() => {
		timeline.pause()
	})

	resumed.onemit(() => {
		timeline.resume()
	})

	timeline.then(resolve)

	return promise
}

export default PlayTimeline
