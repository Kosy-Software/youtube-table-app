import { ComponentMessage } from './lib/appMessages';
import { AppState } from './lib/appState';
/// <reference types="@types/youtube" />

export class YoutubePlayer {
    private interval: number;
    private playerPromise: Promise<YT.Player>;

    public constructor (public videoId: string, private isHost: boolean, private dispatch: ((msg: ComponentMessage) => any), private appState: AppState) {}
 
    private gettingCurrentStateAndTime = false;
    public async setVideoId(videoId: string) {
        this.videoId = videoId;

        this.playerPromise = new Promise((resolve, reject) => {
            let player = new YT.Player('viewing', {
                width: window.innerWidth,
                height: window.innerHeight,
                videoId: videoId,
                events: {
                    onReady: () => { resolve(player) }
                },
                playerVars: {
                    enablejsapi: 1,
                    fs: 1,
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0,
                    start: this.appState.time,
                },
            });
        });

        this.playerPromise.then((player) => {
            player.loadVideoById(this.videoId, null, "large");
            //This timeout is necessary
            //New clients joining will otherwise get a race condition between our app and youtube, somehow...
            setTimeout(() => {
                player.mute();
                if (this.isHost) {
                    this.interval = window.setInterval(() => {
                        if (!this.gettingCurrentStateAndTime) {
                            this.gettingCurrentStateAndTime = true;
                            this.getCurrentStateAndTime(player); 
                            this.gettingCurrentStateAndTime = false;
                        }
                    }, 500)
                } else {
                    this.handleStateChange(this.appState.videoState, this.appState.time + 1);
                }
            }, 1000);
        });

        return this.playerPromise;
    }

    public async getIframe() {
        return (await this.playerPromise).getIframe();
    }

    public async getCurrentState() {
        return (await this.playerPromise).getPlayerState();
    }

    public async getCurrentTime() {
        return (await this.playerPromise).getCurrentTime();
    }

    public async handleStateChange(newState?: YT.PlayerState, time?: number) {
        if (this.playerPromise) {
            let player = await this.playerPromise;
            player.seekTo(time ?? 0, true);
            switch (newState ?? YT.PlayerState.UNSTARTED) {
                case YT.PlayerState.PLAYING:
                case YT.PlayerState.UNSTARTED:
                case YT.PlayerState.CUED:
                    player.playVideo();
                    break;
                case YT.PlayerState.PAUSED:
                    player.pauseVideo();
                    break;
                case YT.PlayerState.ENDED:
                    console.log('Video ended');
                    break;
                default:
                    break;
            }
        }
    }

    private previousSyncTime: Date = new Date();
    private async getCurrentStateAndTime(player: YT.Player) {
        let currentState = player.getPlayerState();
        let currentTime = player.getCurrentTime();
        let oldState = this.appState.videoState;
        let oldTime = this.appState.time;
        
        this.appState.videoState = currentState;
        this.appState.time = currentTime;
        if (oldState != currentState || Math.abs(currentTime - oldTime) > 2 || (new Date().valueOf() - this.previousSyncTime.valueOf()) > 10000) {
            this.previousSyncTime = new Date();
            this.dispatch({ type: "youtube-video-state-changed", payload: { state: currentState, time: currentTime } });
            if (currentState == YT.PlayerState.ENDED && this.interval != null) {
                clearInterval(this.interval)
            }
        }
    }
}