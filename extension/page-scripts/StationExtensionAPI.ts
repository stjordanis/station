import {
  StdSignMsg,
  BlockTxBroadcastResult,
  AccAddress,
} from '@terra-money/terra.js'
import LocalMessageDuplexStream from 'post-message-stream'

export interface SignAndBroadcastTxRequest {
  type: 'signAndBroadcastTx'
  unsignedTx: StdSignMsg
  resolve?: (x: BlockTxBroadcastResult) => void
}

export interface GetAccountAddressRequest {
  type: 'getAccountAddress'
  resolve?: (x: AccAddress) => void
}

export interface GetNetworkRequest {
  type: 'getNetwork'
  resolve?: (x: any) => void
}

export type StationRequest =
  | SignAndBroadcastTxRequest
  | GetAccountAddressRequest
  | GetNetworkRequest

export function randomId() {
  return Date.now()
}

/**
 * This class provides the StationExtensionAPI, accessible through the window.stationExtension object.
 */
export default class StationExtensionAPI {
  static instance: StationExtensionAPI
  inpageStream: any
  requestsById: {
    [requestId: string]:
      | SignAndBroadcastTxRequest
      | GetAccountAddressRequest
      | GetNetworkRequest
  }

  constructor() {
    if (StationExtensionAPI.instance) {
      return
    }

    StationExtensionAPI.instance = this
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

  public async _request(args: StationRequest): Promise<any> {
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
    unsignedTx: StdSignMsg
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

  public async getNetwork(): Promise<any> {
    return this._request({
      type: 'getNetwork',
    })
  }
}
