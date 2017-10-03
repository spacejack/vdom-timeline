import {createToken} from '../token'
import {Emitter, DelayFactory} from '../factory'

/**
 * Creates a cancelable, pausable/resumable delay.
 * Accepts a duration in milliseconds.
 */
const Delay: DelayFactory<number> = function Delay(
	canceled: Promise<void>, paused: Emitter, resumed: Emitter,
	duration: number
) {
	const [promise, resolve] = createToken<void>()
	let timer: number | undefined
	let tRemain: number | undefined
	let tStart = 0
	let tPaused = 0

	canceled.then(() => {
		if (timer != null) {
			clearTimeout(timer)
			timer = undefined
		}
		if (tRemain != null) {
			tRemain = undefined
		}
	})

	paused.onemit(() => {
		if (tRemain == null && timer != null) {
			tPaused = Date.now()
			tRemain = duration - (tPaused - tStart)
			clearTimeout(timer)
			timer = undefined
		}
	})

	resumed.onemit(() => {
		if (tRemain != null) {
			const t = Date.now()
			// Must shift start time forward
			tStart += t - tPaused
			timer = setTimeout(
				() => {
					timer = undefined
					resolve()
				},
				tRemain
			)
			tRemain = undefined
		}
	})

	tStart = Date.now()
	timer = setTimeout(
		() => {
			timer = undefined
			resolve()
		},
		duration
	)

	return promise
}

export default Delay
