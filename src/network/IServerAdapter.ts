export interface IWallet {
    balance: number
    currency: string
}

export interface ILineWin {
    line: number
    positions: number[]
    payout: number
    pattern: number
}

export interface IGameOutcome {
    wallet: IWallet
    stops: number[]
    wins: ILineWin[]
    totalWin: number
}

export interface IGameSettings {
    wallet: IWallet
    bet: number
}

export interface IServerAdapter {
    play(bet: number, options: any): Promise<IGameOutcome>
    initialize(): Promise<IGameSettings>
}