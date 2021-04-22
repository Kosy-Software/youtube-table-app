import { ComponentMessage } from './lib/appMessages';
/// <reference types="@types/youtube" />

export class YoutubePlayer {
    private player: YT.Player;
    private videoId: string;
    private dispatch: ((msg: ComponentMessage) => any);

    public constructor(origin: string, videoId: string, isHost: boolean, dispatchFun: ((msg: ComponentMessage) => any)) {
        this.dispatch = dispatchFun;
        console.log("Init youtube player");
        console.log(origin);
        this.player = new YT.Player('viewing', {
            height: `${window.innerHeight}px`,
            width: `${window.innerWidth}px`,
            videoId: videoId,
            events: {
                onReady: () => this.onPlayerReady(),
                onStateChange: (event) => this.onPlayerStateChange(event)
            },
            playerVars: {
                enablejsapi: 1,
                controls: isHost ? 1 : 0,
                origin: origin,
                fs: 1,
                rel: 0,
                modestbranding: 1,
            },
        });
    }

    public setVideoId(videoId: string) {
        this.videoId = videoId;
    }

    private loadVideo() {
        if (this.videoId != null && this.videoId != "") {
            this.player.loadVideoById(this.videoId, 0, 'large');
            this.player.setSize(window.innerWidth, window.innerHeight);
        }
    }

    public handleStateChange(newState: YT.PlayerState) {
        switch (newState) {
            case YT.PlayerState.PLAYING:
                console.log('play video');
                this.onPlayVideo();
                break;
            case YT.PlayerState.PAUSED:
                console.log('paused');
                this.onPauseVideo();
                break;
            case YT.PlayerState.ENDED:
                console.log('ended');
                break;
            default:
                break;
        };
    }

    private onPlayerReady() {
        console.log("Video player is ready!")
        if (this.videoId != null) {
            this.loadVideo();
        }
    }

    private onPlayVideo() {
        console.log(this.player);
        this.player.playVideo();
    }

    private onPauseVideo() {
        console.log(this.player);
        this.player.pauseVideo();
    }

    private onPlayAtVideo(seconds: number) {
        this.player.seekTo(seconds, true);
    }

    private onPlayerStateChange(event: YT.OnStateChangeEvent) {
        console.log(`Current state = ${event.data}`);

        switch (event.data) {
            case YT.PlayerState.PLAYING:
                console.log('playing');
                this.dispatch({ type: "youtube-video-state-changed", payload: YT.PlayerState.PLAYING });
                break;
            case YT.PlayerState.PAUSED:
                console.log('paused');
                this.dispatch({ type: "youtube-video-state-changed", payload: YT.PlayerState.PAUSED });
                break;
            case YT.PlayerState.ENDED:
                console.log('ended');
                this.dispatch({ type: "youtube-video-state-changed", payload: YT.PlayerState.ENDED });
                break;
            default:
                break;
        }
    }
}