import { AmbientLight, DirectionalLight } from 'three'
import { Application } from '../common'
import { SlotMachine } from './SlotMachine'
import { ControlPanel } from './ControlPanel'
import { PayoutPanel } from './PayoutPanel'

export class MainView {
    public readonly slot: SlotMachine
    public readonly payouts: PayoutPanel
    public readonly controls: ControlPanel
    constructor(private readonly app: Application){
        app.scene.background = app.generateCubeMap('background', app.getTexture('assets/background.png'))
        
        this.slot = new SlotMachine(app)
        this.slot.position.set(0, -10, -80)
        this.slot.rotation.x = -0.08 * Math.PI
        app.scene.add(this.slot)

        this.payouts = new PayoutPanel(app)
        this.payouts.position.set(0, -10, -80)
        this.payouts.rotation.x = -0.08 * Math.PI
        app.scene.add(this.payouts)

        this.controls = new ControlPanel(app)
        this.controls.position.set(0, 0, -80)
        app.scene.add(this.controls)

        const ambientLight = new AmbientLight(0xA46565, 0.4)
        app.scene.add(ambientLight)
        const light = new DirectionalLight(0xFFFFFF, 1)
        light.position.set(0, 5, 0)
        light.target.position.set(-5, 4, -10)
        app.scene.add(light)
    }
}