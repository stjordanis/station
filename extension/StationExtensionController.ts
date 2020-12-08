import StationExtensionState from './StationExtensionState'
import { StationExtensionMsg } from './StationExtensionAPI'
import PortStream from 'extension-port-stream'
import extension from 'extensionizer'

/**
 * Manages extension's communication with the inpage API. Main job is to listen for
 * requests generated from the inpage API, query / mutate the state, then deliver a
 * response, which will cause the request's Promise to resolve on the browser side.
 */
export default class StationExtensionController {
  private state: StationExtensionState
  private stream: PortStream

  constructor(private remotePort: chrome.runtime.Port) {
    this.state = new StationExtensionState()
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
        this.handle(data)
      }
    })
  }

  /**
   * Start listening for data storage changes from signing tx and dispatch txResults
   */
  public listenTxQueueUpdates() {
    extension.storage.onChanged.addListener(console.log)
  }

  public handle(data: { id: any; request: StationExtensionMsg }): any {
    const { id, request } = data
    const { origin } = this.remotePort.sender || {}

    /**
     * NOTE: Add StationExtensionAPI request handlers here.
     */
    switch (request.type) {
      case 'getAccountAddress':
        this.replyPromise(id, this.state.getAccountAddress())
        this.state.setAccountAddress('a')
        return
      case 'getNetworkInfo':
        return this.replyPromise(id, this.state.getNetworkInfo())
      case 'signAndBroadcastTx':
        console.log('Not Implemented.')
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
