import {TimelineFactory} from './factory'
import Delay from './delays/delay'
import PlaySound from './delays/playsound'

export {TimelinePromise} from './factory'

/**
 * Compose a timeline that can run timers and plays sounds.
 * Generic types:
 *   1. Expected return type (when timline finishes)
 *   2. First delay param type
 *   3. Second delay param type
 */
export const Timeline = TimelineFactory<void, number, Howl>(Delay, PlaySound)
