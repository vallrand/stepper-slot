import { Application } from './common'
import { MainView } from './views'
import { IServerAdapter } from './network'
import { UI } from './ui'

import assets from './assets.json'

export class GameController extends Application {
    private view: MainView
    private ui: UI
    constructor(private readonly net: IServerAdapter){
        super()
        this.load()
    }
    public async load(){
        const settings = await this.net.initialize()
        this.ui = UI.initialize(settings)

        await this.loadTextures(assets)
        this.view = new MainView(this)
        
        this.nextRound()
    }
    private async nextRound(){
        await this.view.controls.awaitInteraction()
        const bet = this.ui.bet
        this.ui.win = 0
        this.view.payouts.hidePaylines()
        this.view.payouts.hideWin()
        this.view.slot.startSpin()
        
        const {
            wallet, wins, stops, totalWin
        } = await this.net.play(bet, null)

        this.ui.balance = wallet.balance - totalWin
        await this.view.slot.stopSpin(stops)

        for(let { pattern, line } of wins)
            await this.view.payouts.showPayline(line, pattern, 1)
        if(totalWin) this.view.payouts.showWin(totalWin)

        this.ui.balance = wallet.balance
        this.ui.win = totalWin

        this.nextRound()
    }
}