import * as React from 'react'
import { render } from 'react-dom'

import { DebugMenu } from './DebugMenu'
import { IWallet, IGameSettings } from '../network/IServerAdapter'

const BottomBar = ({ balance, bet, win, currency }: IWallet & { bet: number, win: number }) => (
    <div style={{
        position: 'fixed', width: '100%', background: 'rgba(0,0,0,0.6)',
        bottom: 0, display: 'flex', flexDirection: 'row', color: '#ffffff',
        alignContent: 'center', justifyContent: 'space-between', pointerEvents: 'none'
    }}>
        <div style={{ display: 'flex' }}>
            <div style={{ margin: '0.2em' }}>BALANCE</div>
            <div style={{ margin: '0.2em' }}>{`${balance.toFixed(0)} ${currency}`}</div>
        </div>
        <div style={{ display: 'flex', visibility: win > 0 ? 'initial' : 'hidden' }}>
            <div style={{ margin: '0.2em' }}>WIN</div>
            <div style={{ margin: '0.2em' }}>{`${win.toFixed(0)} ${currency}`}</div>
        </div>
        <div style={{ display: 'flex' }}>
            <div style={{ margin: '0.2em' }}>BET</div>
            <div style={{ margin: '0.2em' }}>{`${bet.toFixed(0)} ${currency}`}</div>   
        </div>
    </div>
)

export class UI extends React.PureComponent<{ settings: any }> {
    static initialize({ wallet, bet, ...settings }: IGameSettings): UI {
        const root = document.createElement('div')
        document.body.appendChild(root)
        const ui: UI = render(<UI settings={settings}/>, root) as any
        ui.setState({ bet, balance: wallet.balance, currency: wallet.currency })
        return ui
    }
    state = {
        win: 0,
        bet: 0,
        balance: 0,
        currency: 'C'
    }
    render(){
        return (<>
            <BottomBar {...this.state}/>
            <DebugMenu settings={this.props.settings} parent={this}/>
        </>)
    }
    set balance(value: number){ this.setState({ balance: value }) }
    get balance(): number { return this.state.balance }
    set win(value: number){ this.setState({ win: value }) }
    get win(): number { return this.state.win }
    get bet(): number { return this.state.bet }
}