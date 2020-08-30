import { Group, Mesh, Geometry, Material } from 'three'
import { SYMBOL } from '../constants'
import { mod } from '../common'
import gsap from 'gsap'

export class SlotReel extends Group {
    private readonly segments: Mesh[] = []
    private _head: number = 0
    private _timeline: gsap.core.Timeline
    public speed: number = Math.PI * 3.6
    constructor(
        private readonly sharedMaterials: Record<SYMBOL, Material>,
        sharedGeometry: Geometry,
        private readonly band: number[],
        private readonly segmentAngle: number,
        segments: number
    ){
        super()

        for(let i = 0; i < segments; i++){
            const mesh = new Mesh(sharedGeometry)
            mesh.rotation.z = 0.5 * Math.PI
            this.segments[i] = mesh
            this.add(mesh)
        }
        this.rotation.x += segmentAngle * (0.5 * segments + 0.5)
        this.update()
    }
    public startSpin(){
        const { bandLength, speed } = this
        this.head = mod(this.head, bandLength)
        this._timeline = gsap.timeline()
        .to(this, {
            duration: bandLength / speed,
            repeat: -1,
            head: this.head + bandLength,
            ease: 'none'
        })
    }
    public stopSpin(position: number, duration: number): Promise<void> {
        this._timeline.kill()
        const { bandLength, segmentAngle, speed } = this
        this.head = mod(this.head, bandLength)
        let stoppingPosition = this.head + duration * speed

        position = -(0.5 * this.segments.length + 0.5) - position
        const remainingDistance = mod(position * segmentAngle - stoppingPosition, bandLength)

        const stoppingDistance = segmentAngle * 5
        stoppingPosition += remainingDistance - stoppingDistance
        const bounce = 0.2 * segmentAngle

        return new Promise(resolve => {
            this._timeline = gsap.timeline({ onComplete: resolve })
            .fromTo(this, {
                immediateRender: false,
                head: this.head
            }, {
                duration,
                head: stoppingPosition,
                ease: 'none'
            })
            .to(this, {
                duration: 0.2,
                head: stoppingPosition + (stoppingDistance + bounce),
                ease: 'power2.out'
            })
            .to(this, {
                duration: 0.08,
                head: stoppingPosition + stoppingDistance,
                ease: 'power2.in'
            })
        })
    }
    private get bandLength(): number { return this.band.length * this.segmentAngle }
    private get head(): number { return this._head }
    private set head(value: number){
        this._head = value
        this.update()
    }
    private update(){
        const { head, segmentAngle } = this
        const headI = Math.floor(head / segmentAngle)
        const headF = mod(head, segmentAngle)

        for(let i = 0; i < this.segments.length; i++){
            let segment = this.segments[i]
            segment.rotation.x = headF - segmentAngle * i
            segment.material = this.sharedMaterials[this.band[mod(- i - headI, this.band.length)]]
        }
    }
}