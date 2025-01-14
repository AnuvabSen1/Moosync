/* 
 *  ModelHelper.ts is a part of Moosync.
 *  
 *  Copyright 2021 by Sahil Gupte <sahilsachingupte@gmail.com>. All rights reserved.
 *  Licensed under the GNU General Public License. 
 *  
 *  See LICENSE in the project root for license information.
 */

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ModelHelper extends Vue {
  public isAlbumExists(song: Song | null | undefined) {
    return song && song.album
  }

  public isArtistExists(song: Song | null | undefined) {
    return song && song.artists
  }

  public getAlbumName(song: Song | null | undefined): String {
    return this.isAlbumExists(song) ? song!.album!.album_name! : ''
  }

  public getArtists(song: Song | null | undefined) {
    return this.isArtistExists(song) ? song!.artists!.join(', ') : '-'
  }
}
