declare namespace Kosy.Integration {
    type VideoMessage =
        VideoPicked | VideoPlay | VideoPause | VideoPlayAt

    interface VideoPicked {
        type: "video-picked",
        payload: string
    }

    interface VideoPlay {
        type: "video-play",
        payload: string
    }

    interface VideoPause {
        type: "video-pause",
        payload: string
    }

    interface VideoPlayAt {
        type: "video-play-at",
        payload: string
    }
}