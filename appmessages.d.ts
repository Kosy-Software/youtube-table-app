declare namespace Kosy.Integration {
    type YoutubeIntegrationMessage =
        | YoutubeUrlHasChanged

    interface YoutubeUrlHasChanged {
        type: "youtube-changed";
        payload: string;
    }
}