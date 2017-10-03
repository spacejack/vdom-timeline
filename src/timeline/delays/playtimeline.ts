import {createToken} from '../token'
import {Emitter, TimelinePromise, DelayFactory} from '../factory'

/**
 * Creates a cancelable, pausable/resumable delay.
 * Accepts a Timeline.
 */
const PlayTimeline: DelayFactory<TimelinePromise<any>> = function PlayTimeline (
	canceled: Promise<void>, paused: Emitter, resumed: Emitter,
	timeline: TimelinePromise<any>
) {
	const [promise, resolve] = createToken<void>()

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
