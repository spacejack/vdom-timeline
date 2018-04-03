import TimelineFactory from './timeline-factory'
import Delay from './delays/delay'
import PlaySound from './delays/playsound'

// Convenience export
export {TimelinePromise} from './timeline-factory'

/**
 * Compose a Timeline that can run timers and plays sounds.
 * Generic types:
 *   1. Expected return type (when timline finishes)
 *   2. First delay param type
 *   3. Second delay param type
 */
export default TimelineFactory<void, number, Howl>(Delay, PlaySound)
