/* 
 *  lastfm.ts is a part of Moosync.
 *  
 *  Copyright 2021 by Sahil Gupte <sahilsachingupte@gmail.com>. All rights reserved.
 *  Licensed under the GNU General Public License. 
 *  
 *  See LICENSE in the project root for license information.
 */

import { _windowHandler } from '../../../background';
import { app } from 'electron';
import { promises as fsP } from 'fs';
import https from 'https'
import path from 'path';

const CachePath = path.join(app.getPath('cache'), 'lastfm_cache')

class WebScraper {
  private cache: { [key: string]: { expiry: number, data: any } } = {}

  constructor() {
    this.readCache()
  }

  private async dumpCache() {
    return fsP.writeFile(CachePath, JSON.stringify(this.cache), { encoding: 'utf-8' })
  }

  private async readCache() {
    const data = await fsP.readFile(CachePath, { encoding: 'utf-8' })
    this.cache = JSON.parse(data)
  }

  private async addToCache(url: string, data: any) {
    if (JSON.parse(data)) {
      const expiry = Date.now() + (2 * 60 * 60 * 1000)
      this.cache[url] = { expiry, data }
      await this.dumpCache()
    }
  }

  private getCache(url: string): any {
    const data = this.cache[url]
    if (data && data.expiry > Date.now()) {
      return data.data
    }
  }

  public async scrapeURL(url: string): Promise<any> {
    const cached = this.getCache(url)
    if (cached) {
      return cached
    }
    return new Promise<any>((resolve, reject) => {
      if (url.startsWith('https')) {
        const request = https.request(new URL(url), (res) => {
          let data = ''
          res.on('data', (chunk) => {
            data += chunk;
          })
          res.on('end', () => {
            resolve(data)
            this.addToCache(url, data)
          })
        })

        request.on('error', function (e) {
          reject(e.message);
        })

        request.end()
      } else {
        reject('URL must start with https: ' + url)
      }
    })
  }
}

export const webScraper = new WebScraper()
