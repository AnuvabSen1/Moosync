import { AlbumEvents, IpcEvents } from './constants'
import { IpcChannelInterface, IpcRequest } from '.'

import { SongDB } from '@/utils/db'

export class AlbumsChannel implements IpcChannelInterface {
  name = IpcEvents.ALBUM
  handle(event: Electron.IpcMainEvent, request: IpcRequest): void {
    switch (request.type) {
      case AlbumEvents.GET_ALL_ALBUMS:
        this.getAllAlbums(event, request)
        break
      case AlbumEvents.GET_ALBUM:
        this.getSingleAlbum(event, request)
        break
    }
  }

  private getAllAlbums(event: Electron.IpcMainEvent, request: IpcRequest) {
    SongDB.getAllAlbums()
      .then((data) => {
        event.reply(request.responseChannel, data)
      })
      .catch((e) => console.log(e))
  }

  private getSingleAlbum(event: Electron.IpcMainEvent, request: IpcRequest) {
    if (request.params.id) {
      SongDB.getAlbumSongs(request.params.id)
        .then((data) => {
          event.reply(request.responseChannel, data)
        })
        .catch((e) => console.log(e))
    }
  }
}