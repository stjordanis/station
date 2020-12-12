// @ts-nocheck
import { StationExtensionMsg } from './StationExtensionAPI'
const PortStream = require('extension-port-stream')
import extension from 'extensionizer'
import { store } from './store'
import { addRequest, resolveRequest } from '../slices/queueSlice'

/**
 * Manages extension's communication with the inpage API. Main job is to listen for
 * requests generated from the inpage API, query / mutate the state, then deliver a
 * response, which will cause the request's Promise to resolve on the browser side.
 */
export default class StationExtensionController {
  private stream: any

  constructor(private remotePort: chrome.runtime.Port) {
    this.stream = new PortStream(remotePort)
  }

  protected reply(id: any, response: any): void {
    this.stream.write({
      id,
      response,
    })
  }

  protected replyPromise(id: any, item: Promise<any>): Promise<void> {
    return item.then((x) => this.reply(id, x))
  }

  /**
   * Start listening for data from the StationExtensionAPI, and process requests.
   */
  public listenAPIRequests() {
    this.stream.on('data', (data: any) => {
      if (typeof data === 'object' && 'id' in data && 'request' in data) {
        this.handleAPIRequest(data)
      }
    })
  }

  /**
   * Start listening for data storage changes from signing tx and dispatch txResults
   */
  public listenTxQueueUpdates() {
    const onChanged: chrome.storage.StorageChangedEvent =
      extension.storage.onChanged

    onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') {
        return
      }

      const { oldValue, newValue } = changes['txQueue'] || {}
      if (oldValue && newValue) {
        this.handleTxQueueUpdate(newValue)
      }
    })
  }

  public handleTxQueueUpdate(txQueue: any) {
    for (const id in txQueue) {
      if (txQueue[id].pending === false) {
        this.reply(id, txQueue[id].result)
      }
    }
  }

  public async handleAPIRequest(data: {
    id: any
    request: StationExtensionMsg
  }) {
    const { id, request } = data
    const { origin } = this.remotePort.sender || {}

    /**
     * NOTE: Add StationExtensionAPI request handlers here.
     */
    switch (request.type) {
      case 'getAccountAddress':
        return this.reply(id, store.getState().wallet.address)
      case 'getNetworkInfo':
        return this.reply(id, store.getState().network)
      case 'signAndBroadcastTx':
        store.dispatch(
          addRequest({
            id,
            pending: true,
            result: null,
            unsignedTx: request.unsignedTx,
          })
        )
    }
  }
}

let tabId = undefined
extension.tabs.onRemoved.addListener(() => (tabId = undefined))

const POPUP_WIDTH = 420
const POPUP_HEIGHT = 640

const openPopup = () => {
  const popup = {
    type: 'popup',
    focused: true,
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
  }
  !tabId &&
    extension.tabs.create(
      { url: extension.extension.getURL('index.html'), active: false },
      (tab) => {
        tabId = tab.id
        extension.windows.getCurrent((window) => {
          const top = Math.max(window.top, 0) || 0
          const left =
            Math.max(window.left + (window.width - POPUP_WIDTH), 0) || 0

          const config = { ...popup, tabId: tab.id, top, left }
          extension.windows.create(config)
        })
      }
    )
}

const closePopup = () => {
  tabId && extension.tabs.remove(tabId)
}
