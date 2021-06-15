import { Component, Vue } from 'vue-property-decorator'
import { PlayerState } from '../../mainWindow/store/playerState'

import { Song } from '../../models/songs'
import { PeerMode } from '@/mainWindow/store/syncState'
import { vxm } from '@/mainWindow/store'

@Component
export default class PlayerControls extends Vue {
  get playerState() {
    return vxm.player.playerState
  }

  get isSyncing() {
    return vxm.sync.mode !== PeerMode.UNDEFINED
  }

  public nextSong() {
    if (this.isSyncing) vxm.sync.setQueueIndex(vxm.sync.queueIndex + 1)
    else vxm.player.nextSong().catch((err) => console.log(err))
  }

  public prevSong() {
    if (this.isSyncing) vxm.sync.setQueueIndex(vxm.sync.queueIndex - 1)
    else vxm.player.prevSong().catch((err) => console.log(err))
  }

  public queueSong(...songs: Song[]) {
    for (const s of songs) {
      if (this.isSyncing) vxm.sync.addToLocalQueue(s).catch((err) => console.log(err))
      else vxm.player.pushInQueue(s).catch((err) => console.log(err))
    }
  }

  public async playTop(...songs: Song[]) {
    for (const s of songs) {
      if (this.isSyncing) await vxm.sync.addToLocalQueue(s)
      else await vxm.player.pushInQueueTop(s)
    }

    this.nextSong()

    if (!this.isSyncing) this.play()
  }

  public play() {
    vxm.player.state = PlayerState.PLAYING
  }

  public pause() {
    vxm.player.state = PlayerState.PAUSED
  }

  public shuffle() {
    vxm.player.shuffle()
  }

  public togglePlayerState() {
    if (this.playerState == PlayerState.PAUSED || this.playerState == PlayerState.STOPPED) {
      vxm.player.state = PlayerState.PLAYING
    } else {
      vxm.player.state = PlayerState.PAUSED
    }
  }

  public stop() {
    vxm.player.state = PlayerState.STOPPED
  }
}
