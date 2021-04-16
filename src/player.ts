import { ComponentMessage } from './lib/appMessages';
/// <reference types="@types/youtube" />

export class YoutubePlayer {
    private player: any;

    public constructor(videoId: string, dispatch: ((msg: ComponentMessage) => any)) {
        this.player = new YT.Player('viewing', {
            height: `${window.innerHeight}px`,
            width: '100%',
            videoId: videoId,
            events: {
                'onReady': () => { this.onPlayerReady(); },
                'onStateChange': (event) => { this.onPlayerStateChange(event, dispatch); }
            },
        });
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
        };
    }

    private onPlayerReady() {
        console.log("Video player is ready!")
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

    private onPlayerStateChange(event: YT.OnStateChangeEvent, dispatch: ((msg: ComponentMessage) => any)) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                console.log('playing');
                dispatch({ type: "youtube-video-state-changed", payload: YT.PlayerState.PLAYING });
                break;
            case YT.PlayerState.PAUSED:
                console.log('paused');
                dispatch({ type: "youtube-video-state-changed", payload: YT.PlayerState.PAUSED });
                break;
            case YT.PlayerState.ENDED:
                console.log('ended');
                dispatch({ type: "youtube-video-state-changed", payload: YT.PlayerState.ENDED });
                break;
        }
    }
}