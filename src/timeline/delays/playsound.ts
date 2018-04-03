import Emitter from '../emitter'
import PromiseToken from '../promise-token'
import {DelayFactory} from '../timeline-factory'

/**
 * Creates a cancelable, pausable/resumable delay.
 * Accepts a sound (Howl object.)
 */
const PlaySound: DelayFactory<Howl> = function(
	canceled: Promise<void>, paused: Emitter, resumed: Emitter,
	sound: Howl
) {
	const [promise, resolve] = PromiseToken<void>()
	let soundId: number | undefined

	canceled.then(() => {
		if (soundId != null) {
			soundId = undefined
			sound.stop()
		}
	})

	paused.onemit(() => {
		if (soundId != null) {
			sound.pause()
		}
	})

	resumed.onemit(() => {
		if (soundId != null) {
			sound.play()
		}
	})

	sound.once('end', id => {
		if (id === soundId) {
			soundId = undefined
			resolve()
		}
	})
	soundId = sound.play()

	return promise
}

export default PlaySound
