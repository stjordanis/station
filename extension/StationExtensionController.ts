import StationExtensionState from './StationExtensionState'
import { StationExtensionMsg } from './StationExtensionAPI'
import PortStream from 'extension-port-stream'

/**
 * Manages extension's communication with the inpage API. Main job is to listen for
 * requests generated from the inpage API, query / mutate the state, then deliver a
 * response, which will cause the request's Promise to resolve on the browser side.
 */
export default class StationExtensionController {
  private stream: PortStream

  constructor(
    private state: StationExtensionState,
    private remotePort: chrome.runtime.Port
  ) {
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
  public listen() {
    this.stream.on('data', (data: any) => {
      if (typeof data === 'object' && 'request' in data) {
        this.handle(data)
      }
    })
  }

  public handle(data: { id: any; request: StationExtensionMsg }): any {
    const { id, request } = data
    const { origin } = this.remotePort.sender || {}

    /**
     * NOTE: Add StationExtensionAPI request handlers here.
     */
    switch (request.type) {
      case 'getAccountAddress':
        return this.replyPromise(id, this.state.getAccountAddress())
      case 'getNetworkInfo':
        return this.replyPromise(id, this.state.getNetworkInfo())
      case 'signAndBroadcastTx':
        console.log('Not Implemented.')
    }
  }
}
