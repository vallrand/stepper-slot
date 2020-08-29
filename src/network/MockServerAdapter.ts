import { IServerAdapter, ILineWin, IWallet, IGameOutcome, IGameSettings } from './IServerAdapter'
import { randomInt, mod } from '../common'

import { SYMBOL, REELS, PAYOUTS, PAYLINES } from '../constants'

const weightTable = [
    [56,4,20,48,1,2,16,4,22,56],
    [4,24,56,2,8,16,1,24,56,4],
    [22,56,4,20,1,1,1,56,4,24]
].map(weights => weights.map((weight, index) => Array(weight).fill(index)).flat())

const patternMatcher = [
    row => row[0] === SYMBOL.CHERRY && row[1] === SYMBOL.CHERRY && row[2] === SYMBOL.CHERRY,
    row => row[0] === SYMBOL.SEVEN && row[1] === SYMBOL.SEVEN && row[2] === SYMBOL.SEVEN,
    row => row.every(symbol => symbol === SYMBOL.CHERRY || symbol === SYMBOL.SEVEN),
    row => row[0] === SYMBOL.BARX3 && row[1] === SYMBOL.BARX3 && row[2] === SYMBOL.BARX3,
    row => row[0] === SYMBOL.BARX2 && row[1] === SYMBOL.BARX2 && row[2] === SYMBOL.BARX2,
    row => row[0] === SYMBOL.BAR && row[1] === SYMBOL.BAR && row[2] === SYMBOL.BAR,
    row => row.every(symbol => symbol === SYMBOL.BARX3 || symbol === SYMBOL.BARX2 || symbol === SYMBOL.BAR)
]

export class MockServerAdapter implements IServerAdapter {
    private readonly wallet: IWallet = {
        balance: 100,
        currency: 'C'
    }
    private generateRandomNumbers(): number[] {
        return weightTable.map(reel => reel[randomInt(0, reel.length - 1)])
    }
    async play(totalBet: number, options: any): Promise<IGameOutcome> {
        if(this.wallet.balance < totalBet) throw new Error('Insufficient Funds!')
        const stops = this.generateRandomNumbers()
        const display = REELS.map((reel, column) => [0,1,2].map(offset => reel[mod(stops[column] + offset, reel.length)]))
        const wins: ILineWin[] = []
        for(let i = 0; i < PAYLINES.length; i++){
            const row = PAYLINES[i].map((y, x) => display[x][y])
            const winningPattern = patternMatcher.findIndex(match => match(row))
            if(winningPattern == -1) continue
            const payout = totalBet * PAYOUTS[i][winningPattern]
            wins.push({
                payout,
                line: i,
                pattern: winningPattern,
                positions: PAYLINES[i]
            })
        }
        const totalWin = wins.reduce((total, win) => total + win.payout, 0)

        this.wallet.balance += totalWin - totalBet

        console.log('stops: %O display: %O wins: %O', stops, display, wins)
        return <IGameOutcome> {
            wallet: this.wallet,
            stops, wins, totalWin
        }
    }
    async initialize(): Promise<IGameSettings> {
        return <IGameSettings> {
            wallet: this.wallet,
            bet: 1,
            debugReference: this
        }
    }
}