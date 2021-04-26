/// Messages that are relayed to all of the clients
export type AppMessage =
    | ReceiveYoutubeUrl | ReceiveYoutubeVideoState | CloseIntegration

export interface ReceiveYoutubeUrl {
    type: "receive-youtube-url";
    payload: string;
}

export interface ReceiveYoutubeVideoState {
    type: "receive-youtube-video-state";
    payload: { state: YT.PlayerState, time: number };
}

/// Internal component messages
export type ComponentMessage =
    | YoutubeUrlHasChanged | YoutubeVideoStateChanged | CloseIntegration

export interface YoutubeUrlHasChanged {
    type: "youtube-url-changed";
    payload: string;
}

export interface CloseIntegration {
    type: "close-integration";
}

export interface YoutubeVideoStateChanged {
    type: "youtube-video-state-changed";
    payload: { state: YT.PlayerState, time: number };
}
