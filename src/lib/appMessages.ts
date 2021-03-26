/// Messages that are relayed to all of the clients
export type AppMessage =
    | ReceiveYoutubeUrl | ReceiveYoutubeVideoState

export interface ReceiveYoutubeUrl {
    type: "receive-youtube-url";
    payload: string;
}

export interface ReceiveYoutubeVideoState {
    type: "receive-youtube-video-state";
    payload: YT.PlayerState;
}

/// Internal component messages
export type ComponentMessage =
    | YoutubeUrlHasChanged | YoutubeVideoStateChanged

export interface YoutubeUrlHasChanged {
    type: "youtube-url-changed";
    payload: string;
}

export interface YoutubeVideoStateChanged {
    type: "youtube-video-state-changed";
    payload: YT.PlayerState;
}