import {
    Group, Mesh, MeshStandardMaterial,
    MeshBasicMaterial, NormalBlending, AdditiveBlending,
    TubeGeometry, Vector3, CatmullRomCurve3, PlaneGeometry, Light, PointLight
} from 'three'
import { Application, Text } from '../common'
import gsap from 'gsap'

import { PAYLINES, PAYOUTS } from '../constants'

const PATTERN_ORIGINS = [
    new Vector3(65, 125, -10),
    new Vector3(65, 125 - 12, -10),
    new Vector3(65, 125 - 2 * 12, -10),
    new Vector3(-65, 125, -10),
    new Vector3(-65, 125 - 12, -10),
    new Vector3(-65, 125 - 2 * 12, -10),
    new Vector3(-65, 125 - 3 * 12, -10),
    new Vector3(-65, 125 - 4 * 12, -10),
    new Vector3(-65, 125 - 5 * 12, -10)
]

export class PayoutPanel extends Group {
    private readonly paylines: { mesh: Mesh, light: Light }[][] = []
    private readonly winAmount: Text
    constructor(app: Application){
        super()
        const lineMaterial = new MeshBasicMaterial({
            color: 0xFF0000,
            blending: AdditiveBlending,
            depthTest: false, depthWrite: false,
            opacity: 1, transparent: true
        })

        this.paylines = PAYOUTS.map((patterns, i) => patterns.map((payout, j) => {
            const path = PAYLINES[i].map((y, x) => new Vector3((x - 1) * 30, (2 - y) * 14 - 8, 0))
            const first = path[0], last = path[path.length - 1]
            path.unshift(new Vector3(first.x - 30, first.y, first.z))
            path.push(new Vector3(last.x + 30, last.y, last.z))

            const origin = PATTERN_ORIGINS[j ? 2 + j : i]
            if(origin.x > 0){
                path.push(new Vector3(last.x + 30, last.y, origin.z))
                path.push(new Vector3(origin.x, last.y, origin.z))
                path.push(new Vector3(origin.x, origin.y, origin.z + 10))
                path.push(origin)
            }else{
                path.unshift(new Vector3(first.x - 30, first.y, origin.z))
                path.unshift(new Vector3(origin.x, first.y, origin.z))
                path.unshift(new Vector3(origin.x, origin.y, origin.z + 10))
                path.unshift(origin)
            }

            const curve = new CatmullRomCurve3(path)
            const geometry = new TubeGeometry(curve, 512, 1, 8, false)
            const lineMesh = new Mesh(geometry, lineMaterial.clone())
            this.add(lineMesh)
            lineMesh.visible = false

            const light = new PointLight(0xFF2200, 1, 75, 2)
            light.position.copy(new Vector3(origin.x * 0.8, origin.y - 20, origin.z + 50))
            light.visible = false
            this.add(light)
            return { mesh: lineMesh, light }
        }))

        const paytableGeometry = new PlaneGeometry(100, 58, 1, 1)
        const paytableMaterial = new MeshStandardMaterial({
            map: app.getTexture('assets/paytable.png'),
            depthTest: false, depthWrite: false,
            blending: NormalBlending,
            transparent: true
        })
        const paytableMesh = new Mesh(paytableGeometry, paytableMaterial)
        paytableMesh.position.set(0, 70, 10)
        this.add(paytableMesh)

        this.winAmount = new Text()
        this.winAmount.visible = false
        this.add(this.winAmount)
    }
    showPayline(line: number, pattern: number, duration: number): Promise<any> {
        const { mesh, light } = this.paylines[line][pattern]

        return new Promise(resolve => gsap.timeline()
            .fromTo(mesh.material, {
                immediateRender: false,
                opacity: 0
            }, {
                duration: 0.5 * duration,
                opacity: 1,
                ease: 'power2.out'
            }, 0)
            .fromTo(light, {
                immediateRender: false,
                intensity: 0
            }, {
                duration: 0.5 * duration,
                intensity: 2,
                ease: 'power2.out'
            }, 0)
            .add(() => mesh.visible = light.visible = true, 0)
            .add(resolve)
        )
    }
    hidePaylines(): void {
        const duration = 0.2
        const timeline = gsap.timeline()
        this.paylines.forEach(lines => lines.forEach(({ mesh, light }) => {
            timeline.to(mesh.material, { duration, opacity: 0, ease: 'power2.in' }, 0)
            timeline.to(light, { duration, intensity: 0, ease: 'power2.in' }, 0)
            timeline.add(() => mesh.visible = light.visible = false, duration)
        }))
    }
    showWin(amount: number){
        const text = String(amount)
        this.winAmount.text = text
        gsap.timeline()
        .add(() => this.winAmount.visible = true, 0)
        .fromTo(this.winAmount.scale, {
            immediateRender: false, x: 0, y: 0
        }, {
            duration: 0.5, ease: 'elastic.out(1, 0.5)', x: 0.5, y: 0.5
        })
    }
    hideWin(): void {
        gsap.timeline()
        .to(this.winAmount.scale, { x: 0, y: 0, ease: 'power2.in' })
        .add(() => this.winAmount.visible = false)
    }
}