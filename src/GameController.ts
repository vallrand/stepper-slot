import { Application } from './common'
import { MainView } from './MainView'
import { IServerAdapter } from './network'

import assets from './assets.json'

export class GameController extends Application {
    private view: MainView
    constructor(private readonly net: IServerAdapter){
        super()
        this.load()
    }
    public async load(){
        const settings = await this.net.initialize()
        await this.loadTextures(assets)
        this.view = new MainView(this)
    }
}