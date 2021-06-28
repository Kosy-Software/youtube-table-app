/// Messages that are relayed to all of the clients
export type AppMessage =
    | ReceiveYoutubeUrl | ReceiveYoutubeVideoState | CloseIntegration | AssignNewHost

export interface ReceiveYoutubeUrl {
    type: "receive-youtube-url";
    payload: string;
}

export interface ReceiveYoutubeVideoState {
    type: "receive-youtube-video-state";
    payload: { state: YT.PlayerState, time: number };
}

export interface AssignNewHost {
    type: "assign-new-host";
}

/// Internal component messages
export type ComponentMessage =
    | YoutubeUrlHasChanged | YoutubeVideoStateChanged | CloseIntegration | YoutubeStartPlaying

export interface YoutubeUrlHasChanged {
    type: "youtube-url-changed";
    payload: string;
}

export interface YoutubeStartPlaying {
    type: "youtube-start-playing";
}

export interface CloseIntegration {
    type: "close-integration";
}

export interface YoutubeVideoStateChanged {
    type: "youtube-video-state-changed";
    payload: { state: YT.PlayerState, time: number };
}
