import extension from 'extensionizer'
import { AccAddress } from '@terra-money/terra.js'
import { NetworkInfo } from './StationExtensionAPI'

/**
 * Manages the Station Extension's application state inside the extension's local storage.
 */
export default class StationExtensionState {
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
