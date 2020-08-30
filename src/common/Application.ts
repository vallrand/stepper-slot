import { Scene, WebGLCubeRenderTarget, Texture, PerspectiveCamera, WebGLRenderer } from 'three'

export class Application {
    public readonly scene: Scene = new Scene()
    public readonly camera: PerspectiveCamera = new PerspectiveCamera(90, 1, 0.1, 1000)
    public readonly renderer: WebGLRenderer = new WebGLRenderer()
    protected readonly textures: Record<string, Texture> = {}
    constructor(){
        document.body.appendChild(this.renderer.domElement)
        this.update(performance.now())
    }
    resize(){
        const canvas = this.renderer.domElement
        const { clientWidth, clientHeight } = canvas
        if(canvas.width == clientWidth && canvas.height === clientHeight) return
        this.camera.aspect =  clientWidth / clientHeight
        this.camera.zoom = Math.min(1, clientWidth / clientHeight)
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(clientWidth, clientHeight, false)
    }
    update = (timestamp: number) => {
        requestAnimationFrame(this.update)
        this.resize()
        this.renderer.render(this.scene, this.camera)
    }
    public loadTextures(assets: Record<string, string>): Promise<any> {
        return Promise.all(Object.keys(assets).map(key => new Promise(resolve => {
            let image = new Image()
            let texture = new Texture(image)
            image.addEventListener('load', () => {
                texture.needsUpdate = true
                resolve()
            })
            image.src = assets[key]
            this.textures[key] = texture
        })))
    }
    public getTexture(key: string): Texture {
        if(!(key in this.textures))
            throw new Error(`Texture "${key}" not found.`)
        return this.textures[key]
    }
    public generateCubeMap(key: string, texture: Texture): WebGLCubeRenderTarget {
        const cubeMapTexture = new WebGLCubeRenderTarget(texture.image.height)
        cubeMapTexture.fromEquirectangularTexture(this.renderer, texture)
        this.textures[key] = cubeMapTexture as any
        return cubeMapTexture
    }
}