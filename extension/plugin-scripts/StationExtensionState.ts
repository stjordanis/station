import extension from 'extensionizer'
import { AccAddress, StdSignMsg } from '@terra-money/terra.js'

export interface SignAndBroadcastTxMsg {
  type: 'signAndBroadcastTx'
  unsignedTx: StdSignMsg.Data
}

export interface GetAccountAddressMsg {
  type: 'getAccountAddress'
}

export interface GetNetworkInfoMsg {
  type: 'getNetworkInfo'
}

export type StationExtensionMsg =
  | SignAndBroadcastTxMsg
  | GetAccountAddressMsg
  | GetNetworkInfoMsg

export interface NetworkInfo {
  chainID: string
  lcd: string
  fcd: string
  ws: string
}

/**
 * Manages the Station Extension's application state inside the extension's local storage.
 */
export class StationExtensionState {
  private store: chrome.storage.LocalStorageArea

  constructor() {
    this.store = extension.storage.local
  }

  public async setAccountAddress(address: AccAddress): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store.set(
        {
          wallet: {
            address,
          },
        },
        resolve
      )
    })
  }

  public async setNetworkInfo(networkInfo: NetworkInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      this.store.set(
        {
          network: networkInfo,
        },
        resolve
      )
    })
  }

  public async getAccountAddress(): Promise<AccAddress> {
    return new Promise((resolve, reject) => {
      this.store.get(['wallet'], ({ wallet }) => resolve(wallet.address))
    })
  }

  public async getNetworkInfo(): Promise<NetworkInfo> {
    return new Promise((resolve, reject) => {
      this.store.get(['network'], ({ network }) => resolve(network))
    })
  }
}
