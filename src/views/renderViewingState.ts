import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';

//Renders the viewing state
let player: YT.Player;

export function renderViewingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;

    let urlParts = state.youtubeUrl.split('=');
    let videoId = urlParts[1];

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    player = new YT.Player('viewing', {
        height: `${window.innerHeight}px`,
        width: '100%',
        videoId: videoId,
        events: {
            'onReady': () => onPlayerReady(),
            'onStateChange': (event) => onPlayerStateChange(event, dispatch)
        },
    });

    if (state.videoState != null) {
        handleStateChange(state.videoState);
    }

    return viewingRoot;
}

function onPlayerReady() {
    console.log("Video player is ready!")
    player.playVideo();
}

function handleStateChange(newState: YT.PlayerState) {
    switch (newState) {
        case YT.PlayerState.PLAYING:
            console.log('play video');
            onPlayVideo()
            break;
        case YT.PlayerState.PAUSED:
            console.log('paused');
            onPauseVideo()
            break;
        case YT.PlayerState.ENDED:
            console.log('ended');
            break;
    };
}

function onPlayVideo() {
    console.log(player);
    player.playVideo();
}

function onPauseVideo() {
    console.log(player);
    player.pauseVideo();
}

function onPlayAtVideo(seconds: number) {
    player.seekTo(seconds, true);
}

function onPlayerStateChange(event: YT.OnStateChangeEvent, dispatch: ((msg: ComponentMessage) => any)) {
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
    };
}