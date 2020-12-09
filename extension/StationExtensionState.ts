import extension from 'extensionizer'
import { store, persistor } from './store'

// export interface TxQueue {
//   [id: number]: TxQueueItem
// }
// export interface TxQueueItem {
//   unsignedTx: StdSignMsg.Data
//   pending: boolean
//   result: any
// }

/**
 * Manages the Station Extension's application state inside the extension's local storage.
 */
export default class StationExtensionState {
  private store: chrome.storage.LocalStorageArea

  constructor() {
    this.store = extension.storage.local
  }

  // public setAccountAddress(address: AccAddress): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.store.set(
  //       {
  //         wallet: {
  //           address,
  //         },
  //       },
  //       resolve
  //     )
  //   })
  // }

  // public setNetworkInfo(networkInfo: NetworkInfo): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.store.set(
  //       {
  //         network: networkInfo,
  //       },
  //       resolve
  //     )
  //   })
  // }

  // public setTxQueue(txQueue: TxQueue): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.store.set(
  //       {
  //         txQueue: txQueue,
  //       },
  //       resolve
  //     )
  //   })
  // }

  // public getAccountAddress(): Promise<AccAddress> {
  //   return new Promise((resolve, reject) => {
  //     this.store.get(['wallet'], ({ wallet }) => resolve(wallet.address))
  //   })
  // }

  // public getNetworkInfo(): Promise<NetworkInfo> {
  //   return new Promise((resolve, reject) => {
  //     this.store.get(['network'], ({ network }) => resolve(network))
  //   })
  // }

  // public getTxQueue(): Promise<{ [id: number]: TxQueueItem }> {
  //   return new Promise((resolve, reject) => {
  //     this.store.get(['txQueue'], ({ txQueue }) => resolve(txQueue))
  //   })
  // }

  // public async updateTxQueue(key: number, value: TxQueueItem): Promise<void> {
  //   const currentTxQueue = await this.getTxQueue()
  //   return new Promise((resolve, reject) => {
  //     this.store.set(
  //       {
  //         txQueue: {
  //           ...currentTxQueue,
  //           [key]: value,
  //         },
  //       },
  //       resolve
  //     )
  //   })
  // }
}
