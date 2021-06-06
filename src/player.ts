import { ComponentMessage } from './lib/appMessages';
/// <reference types="@types/youtube" />

export class YoutubePlayer {
    private player: YT.Player;
    public videoId: string;
    private dispatch: ((msg: ComponentMessage) => any);
    private interval: number;
    private isHost: boolean;
    private time?: number;

    public constructor(videoId: string, isHost: boolean, dispatchFun: ((msg: ComponentMessage) => any), time?: number) {
        this.dispatch = dispatchFun;
        this.isHost = isHost;
        this.time = time;

        this.player = new YT.Player('viewing', {
            height: `0px`,
            width: `0px`,
            videoId: videoId,
            events: {
                onReady: () => this.onPlayerReady(),
            },
            playerVars: {
                enablejsapi: 1,
                origin: 'https://youtube.com',
                fs: 1,
                rel: 0,
                modestbranding: 1,
                showinfo: 0,
                autohide: this.isHost ? 0 : 1,
                start: time,
            },
        });
    }

    public setVideoId(videoId: string) {
        this.videoId = videoId;
    }


    public getPlayer(): HTMLIFrameElement {
        let iframe = this.player.getIframe();
        return iframe;
    }

    public getCurrentState(): YT.PlayerState {
        if (this.player != null && this.player.getPlayerState) {
            return this.player.getPlayerState();
        }
        return null;
    }

    private loadVideo() {
        if (this.videoId != null && this.videoId != "") {
            this.player.loadVideoById(this.videoId, 0, 'large');
            this.player.setSize(window.innerWidth, window.innerHeight);
        }
    }

    public handleStateChange(newState: YT.PlayerState, time?: number) {
        if (this.player != null && this.player.getPlayerState) {
            let currentState = this.player.getPlayerState();
            if (currentState != newState) {
                if (time != null) {
                    this.player.seekTo(time, true);
                }
                switch (newState) {
                    case YT.PlayerState.PLAYING:
                    case YT.PlayerState.UNSTARTED:
                    case YT.PlayerState.CUED:
                        this.player.playVideo();
                        break;
                    case YT.PlayerState.PAUSED:
                        this.player.pauseVideo();
                        break;
                    case YT.PlayerState.ENDED:
                        console.log('Video ended');
                        break;
                    default:
                        break;
                };
            }
        }
    }

    private onPlayerReady() {
        this.player.mute()
        this.player.seekTo(this.time, true);
        if (this.videoId != null) {
            this.loadVideo();
            if (this.isHost) {
                this.interval = window.setInterval(() => { this.getCurrentStateAndTime(); }, 500)
            }
        }
    }

    private getCurrentStateAndTime() {
        let state = this.player.getPlayerState();
        let currentTime = this.player.getCurrentTime();
        this.dispatch({ type: "youtube-video-state-changed", payload: { state: state, time: currentTime } });
        if (state == YT.PlayerState.ENDED && this.interval != null) {
            clearInterval(this.interval)
        }
    }
}