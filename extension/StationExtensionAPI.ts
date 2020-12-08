import {
  StdSignMsg,
  BlockTxBroadcastResult,
  AccAddress,
} from '@terra-money/terra.js'
import LocalMessageDuplexStream from 'post-message-stream'

export interface SignAndBroadcastTxRequest {
  type: 'signAndBroadcastTx'
  unsignedTx: StdSignMsg.Data
  resolve?: (x: BlockTxBroadcastResult) => void
}

export interface GetAccountAddressRequest {
  type: 'getAccountAddress'
  resolve?: (x: AccAddress) => void
}

export interface GetNetworkInfoRequest {
  type: 'getNetworkInfo'
  resolve?: (x: any) => void
}

export interface NetworkInfo {
  chainID: string
  lcd: string
  fcd: string
  ws: string
}

export type StationExtensionMsg =
  | SignAndBroadcastTxRequest
  | GetAccountAddressRequest
  | GetNetworkInfoRequest

export function randomId() {
  return Date.now()
}

/**
 * This class provides the StationExtensionAPI, accessible through the window.stationExtension
 * object. This is intended to be used as a singleton through `.getInstance()`, not creating
 * not created directly with the `new` keyword.
 */
export default class StationExtensionAPI {
  static instance: StationExtensionAPI
  inpageStream: any
  requestsById: {
    [requestId: string]: StationExtensionMsg
  }

  private constructor() {
    this.inpageStream = new LocalMessageDuplexStream({
      name: 'station:inpage',
      target: 'station:content',
    })

    this.inpageStream.on('data', (data: any) => {
      this.requestsById[data.id].resolve(data.response)
      delete this.requestsById[data.id]
    })

    this.requestsById = {}
  }

  /**
   * Retrieves the singleton instance of the API.
   */
  public static getInstance(): StationExtensionAPI {
    if (!StationExtensionAPI.instance) {
      StationExtensionAPI.instance = new StationExtensionAPI()
    }

    return StationExtensionAPI.instance
  }

  public async _request(args: StationExtensionMsg): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = randomId()
      const request = {
        ...args,
      }
      this.requestsById[id] = {
        ...request,
        resolve,
      }
      this.inpageStream.write({ id, request })
    })
  }

  public async signAndBroadcastTx(
    unsignedTx: StdSignMsg.Data
  ): Promise<BlockTxBroadcastResult> {
    return this._request({
      type: 'signAndBroadcastTx',
      unsignedTx,
    })
  }

  public async getAccountAddress(): Promise<string> {
    return this._request({
      type: 'getAccountAddress',
    })
  }

  public async getNetworkInfo(): Promise<any> {
    return this._request({
      type: 'getNetworkInfo',
    })
  }
}
