import {
    Group, Mesh, MeshStandardMaterial, BoxGeometry,
    CylinderGeometry, Vector2, Raycaster
} from 'three'
import { Application } from '../common'
import gsap from 'gsap'

export class ControlPanel extends Group {
    private readonly raycaster: Raycaster = new Raycaster()
    private readonly playButton: Mesh
    constructor(private readonly app: Application){
        super()

        const panelGeometry = new BoxGeometry(120, 40, 40)
        const panelMaterial = new MeshStandardMaterial({
            color: 0x2B2B2B,
            roughness: 0.4,
            metalness: 0.6,
            envMap: app.getTexture('background'),
            envMapIntensity: 0.8
        })
        const panelMesh = new Mesh(panelGeometry, panelMaterial)
        panelMesh.position.set(0, -60, 40)
        this.add(panelMesh)

        const playButtonGeometry = new CylinderGeometry(10, 10, 10, 64)
        const playButtonMaterial = new MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.8,
            metalness: 0.4
        })
        this.playButton = new Mesh(playButtonGeometry, playButtonMaterial)
        this.playButton.position.set(40, -38, 35)
        this.add(this.playButton)

        gsap.timeline()
        .fromTo(app.camera.rotation, { y: -0.5 * Math.PI }, { y: 0, ease: 'power1.out', duration: 2 })
    }
    public awaitInteraction(): Promise<void> {
        return new Promise(resolve => {
            const canvas = this.app.renderer.domElement
            const handlePointerDown = (event: MouseEvent | TouchEvent) => {
                event.preventDefault()
                const bounds = canvas.getBoundingClientRect()
                const position = new Vector2()
        
                if(event instanceof MouseEvent){
                    const { clientX, clientY } = event
                    position.set(clientX, clientY)
                }else if(event instanceof TouchEvent){
                    const { clientX, clientY } = event.changedTouches[0]
                    position.set(clientX, clientY)
                }
        
                position.x = ((position.x - bounds.left) / bounds.width) *  2 - 1
                position.y = ((position.y - bounds.top) / bounds.height) * -2 + 1
        
                this.raycaster.setFromCamera(position, this.app.camera)
                const raycastResult = this.raycaster.intersectObject(this.playButton, false)
                if(!raycastResult.length) return
                gsap.timeline()
                .fromTo(this.playButton.position, { y: -42, immediateRender: false }, {
                    y: -38,
                    duration: 0.3,
                    ease: 'power2.out'
                })
                canvas.removeEventListener('touchstart', handlePointerDown)
                canvas.removeEventListener('mousedown', handlePointerDown)
                resolve()
            }
            canvas.addEventListener('touchstart', handlePointerDown)
            canvas.addEventListener('mousedown', handlePointerDown)
        })
    }
}