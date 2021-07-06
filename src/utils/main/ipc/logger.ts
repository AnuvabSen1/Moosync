import { IpcEvents, LoggerEvents } from './constants'

import { logger } from './../logger/index';

export class LoggerChannel implements IpcChannelInterface {
  name = IpcEvents.LOGGER
  private customLogger = logger.child({ label: 'Renderer' })
  handle(event: Electron.IpcMainEvent, request: IpcRequest): void {
    switch (request.type) {
      case LoggerEvents.INFO:
        this.logInfo(event, request)
        break
      case LoggerEvents.ERROR:
        this.logError(event, request)
        break
    }
  }

  private logInfo(event: Electron.IpcMainEvent, request: IpcRequest) {
    this.customLogger.info(request.params.message)
    event.reply(request.responseChannel)
  }

  private logError(event: Electron.IpcMainEvent, request: IpcRequest) {
    this.customLogger.error(request.params.message)
    event.reply(request.responseChannel)
  }
}