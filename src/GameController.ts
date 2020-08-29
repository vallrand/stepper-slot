import { Application } from './Application'
import { MainView } from './MainView'

import assets from './assets.json'

export class GameController extends Application {
    private view: MainView
    constructor(){
        super()
        this.load()
    }
    public async load(){
        await this.loadTextures(assets)
        this.view = new MainView(this)
    }
}