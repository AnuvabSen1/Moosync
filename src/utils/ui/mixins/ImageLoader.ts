/* 
 *  ImageLoader.ts is a part of Moosync.
 *  
 *  Copyright 2021 by Sahil Gupte <sahilsachingupte@gmail.com>. All rights reserved.
 *  Licensed under the GNU General Public License. 
 *  
 *  See LICENSE in the project root for license information.
 */

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ImgLoader extends Vue {

  protected getValidImageLow(song: Song | null | undefined) {
    return song?.song_coverPath_low ?? song?.album?.album_coverPath_low ?? song?.song_coverPath_high ?? song?.album?.album_coverPath_high
  }

  protected getValidImageHigh(song: Song | null | undefined) {
    return song?.song_coverPath_high ?? song?.album?.album_coverPath_high ?? song?.song_coverPath_low ?? song?.album?.album_coverPath_low
  }

  protected getImgSrc(imgSrc: string | null | undefined) {
    if (imgSrc) {
      if (imgSrc.startsWith('http') || imgSrc.startsWith('media')) return imgSrc
      else return 'media://' + imgSrc
    }
    return ''
  }
}
