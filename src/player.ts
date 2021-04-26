import { ComponentMessage } from './lib/appMessages';
/// <reference types="@types/youtube" />

export class YoutubePlayer {
    private player: YT.Player;
    private videoId: string;
    private dispatch: ((msg: ComponentMessage) => any);
    private interval: number;
    private isHost: boolean;

    public constructor(origin: string, videoId: string, isHost: boolean, dispatchFun: ((msg: ComponentMessage) => any)) {
        this.dispatch = dispatchFun;
        this.isHost = isHost;
        this.player = new YT.Player('viewing', {
            height: `${window.innerHeight}px`,
            width: `${window.innerWidth}px`,
            videoId: videoId,
            events: {
                onReady: () => this.onPlayerReady(isHost),
            },
            playerVars: {
                enablejsapi: 1,
                controls: isHost ? 1 : 0,
                disablekb: isHost ? 0 : 1,
                origin: origin,
                fs: 1,
                rel: 0,
                modestbranding: 1,
                showinfo: 0,
                autohide: isHost ? 0 : 1,
            },
        });
    }

    public setVideoId(videoId: string) {
        this.videoId = videoId;
    }

    public getPlayer(): HTMLIFrameElement {
        let iframe = this.player.getIframe();
        if (!this.isHost) {
            iframe.classList.add('remove-click');
        }
        return iframe;
    }

    private loadVideo() {
        if (this.videoId != null && this.videoId != "") {
            this.player.loadVideoById(this.videoId, 0, 'large');
            this.player.setSize(window.innerWidth, window.innerHeight);
        }
    }

    public handleStateChange(newState: YT.PlayerState, time?: number) {
        let currentState = this.player.getPlayerState();
        console.log(`current state: ${currentState} - new state: ${newState}`);
        if (currentState != newState) {
            if (time != null) {
                this.player.seekTo(time, true);
            }
            switch (newState) {
                case YT.PlayerState.BUFFERING:
                case YT.PlayerState.PLAYING:
                    console.log(`Play video at ${time}`);
                    this.player.playVideo();
                    break;
                case YT.PlayerState.PAUSED:
                    console.log(`Pause video at ${time}`);
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

    private onPlayerReady(isHost: boolean) {
        console.log("Video player is ready!")
        if (this.videoId != null) {
            this.loadVideo();
            this.player.playVideo();
            if (isHost) {
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