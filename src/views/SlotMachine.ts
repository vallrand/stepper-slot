import {
    Group, Material, Mesh, MeshStandardMaterial, BoxGeometry,
    NormalBlending, CylinderGeometry
} from 'three'
import { Application } from '../common'
import { SlotReel } from './SlotReel'

import { SYMBOL, REELS } from '../constants'

export class SlotMachine extends Group {
    private readonly reels: SlotReel[]
    private readonly materials: Record<SYMBOL, Material>
    constructor(app: Application){
        super()
        this.materials = {
            [SYMBOL.EMPTY]: new MeshStandardMaterial({ visible: false }),
            [SYMBOL.BAR]: new MeshStandardMaterial({ map: app.getTexture('assets/BAR.png'), blending: NormalBlending, transparent: true }),
            [SYMBOL.BARX2]: new MeshStandardMaterial({ map: app.getTexture('assets/2xBAR.png'), blending: NormalBlending, transparent: true }),
            [SYMBOL.SEVEN]: new MeshStandardMaterial({ map: app.getTexture('assets/7.png'), blending: NormalBlending, transparent: true }),
            [SYMBOL.CHERRY]: new MeshStandardMaterial({ map: app.getTexture('assets/Cherry.png'), blending: NormalBlending, transparent: true }),
            [SYMBOL.BARX3]: new MeshStandardMaterial({ map: app.getTexture('assets/3xBAR.png'), blending: NormalBlending, transparent: true })
        }
        const segments = 10
        const width = 20
        const padding = 5
        const radius = 0.5 * width * segments / Math.PI
        const sharedGeometry = new CylinderGeometry(radius, radius, width, 32, 32, true, 0, 2 * Math.PI / segments)
        sharedGeometry.faceVertexUvs.forEach(faces => faces.forEach(vertices => vertices.forEach(uv => uv.set(1 - uv.y, uv.x))))
        sharedGeometry.uvsNeedUpdate = true

        const frameGeometry = new BoxGeometry(width + 0.8 * padding, 2 * radius - 2.4 * padding, 10)
        const frameMaterial = new MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.2,
            metalness: 0.8,
            envMap: app.getTexture('background'),
            envMapIntensity: 0.8
        })
        const drumGeometry = new CylinderGeometry(radius-0.1, radius-0.1, width, 32, 32, false, 0, 2 * Math.PI)
        const drumMaterial = new MeshStandardMaterial({ color: 0xececec, roughness: 1, metalness: 0 })

        this.reels = REELS.map((REEL, i) => {
            const reel = new SlotReel(this.materials, sharedGeometry, REEL, Math.PI / segments, 7)
            this.add(reel)
            reel.position.set((i - 0.5 * REELS.length + 0.5) * (width + padding), 0, -6)

            const drumMesh = new Mesh(drumGeometry, drumMaterial)
            drumMesh.rotation.z = 0.5 * Math.PI
            drumMesh.position.copy(reel.position)
            this.add(drumMesh)

            const frameMesh = new Mesh(frameGeometry, frameMaterial)
            frameMesh.position.copy(reel.position)
            frameMesh.position.z = 12
            this.add(frameMesh)

            return reel
        })

        const panelGeometry = new BoxGeometry(120, 200, 40)
        const panelMaterial = new MeshStandardMaterial({
            color: 0x2B2B2B,
            roughness: 0.6,
            metalness: 0.4,
            envMap: app.getTexture('background'),
            envMapIntensity: 0.8
        })
        const panelMesh = new Mesh(panelGeometry, panelMaterial)
        panelMesh.position.set(0, 5, -4)
        this.add(panelMesh)
    }
    startSpin(){
        for(let i = 0; i < this.reels.length; i++)
            this.reels[i].startSpin()
    }
    stopSpin(stops: number[]): Promise<any> {
        return Promise.all(this.reels.map((reel, i) => reel.stopSpin(stops[i], 2 + i * 0.5)))
    }
}