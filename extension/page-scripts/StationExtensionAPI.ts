import LocalMessageDuplexStream from 'post-message-stream'

/**
 * This class provides the StationExtensionAPI, accessible through the window.stationExtension object.
 */
export default class StationExtensionAPI {
  static instance: StationExtensionAPI
  inpageStream: LocalMessageDuplexStream

  constructor() {
    if (StationExtensionAPI.instance) {
      return
    }

    StationExtensionAPI.instance = this
    this.inpageStream = new LocalMessageDuplexStream({
      name: 'station:inpage',
      target: 'station:content',
    })
  }

  public async request(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.inpageStream._write({ item: resolve })
    })
  }
}
