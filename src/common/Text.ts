import { Object3D, Texture, SpriteMaterial, Sprite } from 'three'

export class Text extends Object3D {
    private readonly canvas = document.createElement('canvas')
    private readonly ctx = this.canvas.getContext('2d')
    private readonly texture: Texture
    private _text: string = ''
    public style = {
        fontSize: 72,
        strokeWidth: 4,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fill: '#ffffff',
        stroke: '#000000'
    }
    constructor(){
        super()
        this.texture = new Texture(this.canvas)
        const material = new SpriteMaterial({ map: this.texture, depthTest: false, depthWrite: false })
        const sprite = new Sprite(material)
        this.add(sprite)
    }
    get text(): string { return this._text }
    set text(value: string){
        this._text = value
        const { ctx, canvas, style } = this

        ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`
        const { width } = ctx.measureText(value)
        canvas.width = width + 2 * style.strokeWidth
        canvas.height = style.fontSize + 2 * style.strokeWidth
        ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = style.fill
        ctx.strokeStyle = style.stroke
        ctx.lineWidth = style.strokeWidth
        ctx.fillText(value, 0.5 * canvas.width, 0.5 * canvas.height)
        ctx.strokeText(value, 0.5 * canvas.width, 0.5 * canvas.height)

        this.texture.needsUpdate = true
        this.children[0].scale.set(canvas.width, canvas.height, 1)
    }
}