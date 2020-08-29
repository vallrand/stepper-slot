import { GameController } from './GameController'
import { MockServerAdapter } from './network'

window['game'] = new GameController(new MockServerAdapter)