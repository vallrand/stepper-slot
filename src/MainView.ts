import { AmbientLight, DirectionalLight, BoxGeometry, MeshStandardMaterial, Mesh } from 'three'
import { Application } from './Application'

export class MainView {
    constructor(private readonly app: Application){
        
		const panelGeometry = new BoxGeometry(40, 40, 40)
        const panelMaterial = new MeshStandardMaterial({
            color: 0x777777,
            roughness: 0.5,
            metalness: 0.5
        })
        const panelMesh = new Mesh(panelGeometry, panelMaterial)
        panelMesh.position.set(0, -60, -80)
        app.scene.add(panelMesh)

        const ambientLight = new AmbientLight(0xA46565, 0.4)
        app.scene.add(ambientLight)
        const light = new DirectionalLight(0xFFFFFF, 1)
        light.position.set(0, 5, 0)
        light.target.position.set(-5, 4, -10)
        app.scene.add(light)
    }
}