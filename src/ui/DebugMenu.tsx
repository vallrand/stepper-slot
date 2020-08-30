import * as React from 'react'
import { UI } from './index'

import { REELS } from '../constants'
import { IWallet } from '../network'

type IDebugState = {
    positions: number[]
    enabled: boolean
}

type IDebugProps = {
    parent: UI
    settings: { debugReference: { wallet: IWallet, generateRandomNumbers: () => number[] } }
}

export class DebugMenu extends React.Component<IDebugProps, IDebugState> {
    static readonly MAX_BALANCE = 50000
    state = {
        positions: Array(REELS.length).fill(0),
        enabled: false
    }
    componentDidMount(){
        const debugMenu = this
        const { generateRandomNumbers } = this.props.settings.debugReference
        this.props.settings.debugReference.generateRandomNumbers = function(){
            if(debugMenu.state.enabled) return debugMenu.state.positions
            return generateRandomNumbers.apply(this, arguments)
        }
    }
    render(){
        const { parent, settings } = this.props

        return (
            <div style={{
                position: 'fixed', width: '100%', background: 'rgba(0,0,0,0.6)',
                top: 0, display: 'flex', flexDirection: 'row', color: '#ffffff',
                alignContent: 'center', justifyContent: 'space-around', pointerEvents: 'all'
            }}>
                <div style={{
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div>Balance</div>
                    <input
                    type="number" min={0} max={DebugMenu.MAX_BALANCE} step={1}
                    value={parent.state.balance}
                    onChange={event => {
                        const value = Math.max(0, Math.min(DebugMenu.MAX_BALANCE, +event.target.value))
                        settings.debugReference.wallet.balance = value
                        parent.setState({ balance: value })
                    }}
                    />
                </div>
                <div style={{
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {this.state.positions.map((position, i) => (
                        <input key={i} type="number" min="0" max={REELS[i].length-1} step="1"
                        value={position}
                        onChange={event => {
                            const value = +event.target.value
                            this.setState(state => ({
                                positions: state.positions.map((prevValue, j) => i === j ? value : prevValue)
                            }))
                        }}
                        />
                    ))}
                    </div>
                    <div>
                        Enable
                        <input type="checkbox" checked={this.state.enabled}
                        onChange={event => this.setState({ enabled: event.target.checked })}/>
                    </div>
                </div>
            </div>
        )
    }
}