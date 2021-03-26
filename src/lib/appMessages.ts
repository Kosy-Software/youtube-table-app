/// Messages that are relayed to all of the clients
export type AppMessage =
    | ReceiveYoutubeUrl

export interface ReceiveYoutubeUrl {
    type: "receive-youtube-url";
    payload: string;
}

/// Internal component messages
export type ComponentMessage =
    | YoutubeUrlHasChanged

export interface YoutubeUrlHasChanged {
    type: "youtube-url-changed";
    payload: string;
}