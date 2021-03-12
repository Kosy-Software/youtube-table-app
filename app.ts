/// <reference types="./appmessages" />
/// <reference types="./frameworkmessages" />
/// <reference types="./youtubemessages" />

module Kosy.Integration.Youtube {
    class StartupParameters { }

    export class App {
        private kosyClient: Window;
        private currentClient: ClientInfo;
        private initializer: ClientInfo;
        private player: YT.Player;

        constructor() {
            //TODO: make this into more of a "framework" thing
            //we're initializing this integration for the kosy client (= this window's parent)
            this.kosyClient = window.parent;
            if (!this.kosyClient) {
                //In stead of throwing, send a "kill the integration" message?
                throw "This page is not meant to be ran stand-alone...";
            }
        }

        //Starts the integration
        public start(params: StartupParameters): void {
            //This sets up the message listener, the most important part of every integration
            window.addEventListener("message", (event: MessageEvent<KosyToIntegrationMessage<YoutubeIntegrationMessage>>) => {
                this.receiveMessage(event.data);
            });
            //This sends the "ready and listening" message so the kosy client knows the integration has started properly
            this.sendMessage({ type: "ready-and-listening", payload: {} });
        }

        //Messages that flow to the main app get processed here
        //Note: For larger apps a separate message processor class might be required, but for this perticular app, that might be overengineering
        public receiveMessage(message: VideoMessage | KosyToIntegrationMessage<YoutubeIntegrationMessage>) {
            switch (message.type) {
                case "receive-initial-info":
                    //Sets up the initial information, for the youtube integration, it's important to know who started it
                    this.currentClient = message.payload.clients[message.payload.currentClientUuid];
                    this.initializer = message.payload.clients[message.payload.initializerClientUuid];
                    this.log("Received initialization info: ", message.payload);
                    if (this.currentClient.clientUuid == this.initializer.clientUuid) {
                        this.openYoutubePlayer();
                    } else {
                        this.showWaiting();
                    }
                    break;
                case "receive-message":
                    //A message was received from the kosy client -> process it
                    this.log("Received message: ", message.payload);
                    this.processIntegrationMessage(message.payload);
                    break;
                case "client-has-joined":
                    //TODO?
                    this.log("A client has joined: ", message.payload);
                    break;
                case "client-has-left":
                    //TODO?
                    this.log("A client has left: ", message.payload)
                    break;
                default:
                    break;
            }
        }

        private openYoutubePlayer() {
            let picker = document.getElementById("picking");
            picker.hidden = false;

            //This sets up the onclick for the "Click me to view youtube video" button
            document.getElementById("youtube-button").onclick = async (event: Event) => {
                //Needs to check first if this is a valid youtube url
                let url = (<HTMLInputElement>document.getElementById("youtube-video-input")).value;
                let urlParts = url.split('=');
                let videoId = urlParts[1];

                this.sendMessage({
                    type: "relay-message",
                    payload: { type: "video-picked", payload: videoId }
                });
            }
        }

        private initPlayer(videoId: string) {
            this.player = new YT.Player('player', {
                height: `${this.kosyClient[0].innerHeight - 30}px`,
                width: '100%',
                videoId: videoId,
                events: {
                    'onReady': () => this.onPlayerReady(),
                    'onStateChange': (event) => this.onPlayerStateChange(event)
                },
            });
        }

        private onPlayerReady() {
            this.sendMessage({
                type: "relay-message",
                payload: { type: "video-play", payload: "" }
            });
        }

        private onPlayVideo() {
            this.player.playVideo();
        }

        private onPauseVideo() {
            this.player.pauseVideo();
        }

        private onPlayAtVideo(seconds: number) {
            this.player.seekTo(seconds, true);
        }

        private onPlayerStateChange(event: YT.OnStateChangeEvent) {
            switch (event.data) {
                case YT.PlayerState.PLAYING:
                    console.log('playing');
                    this.sendMessage({
                        type: "relay-message",
                        payload: { type: "video-play", payload: "" }
                    });
                    break;
                case YT.PlayerState.PAUSED:
                    console.log('paused');
                    this.sendMessage({
                        type: "relay-message",
                        payload: { type: "video-pause", payload: "" }
                    });
                    break;
                case YT.PlayerState.ENDED:
                    console.log('ended');
                    this.sendMessage({
                        type: "relay-message",
                        payload: { type: "video-pause", payload: "" }
                    });
                    break;
            };
        }

        //Sends a message to the kosy client
        public sendMessage(message: IntegrationToKosyMessage<VideoMessage | YoutubeIntegrationMessage>) {
            //TODO: fix message origin, we probably only want to send messages to a certain url?
            this.kosyClient.postMessage(message, "*");
        }

        //Processes a message that came in via the kosy client
        private processIntegrationMessage(message: VideoMessage | YoutubeIntegrationMessage) {
            switch (message.type) {
                case "youtube-changed":
                    document.getElementById("picking").hidden = true;
                    document.getElementById("waiting").hidden = true;
                    let iframe = document.getElementById("player") as HTMLIFrameElement;
                    iframe.src = message.payload;
                    iframe.style.width = "100%";
                    iframe.style.height = `${this.kosyClient[0].innerHeight - 30}px`;
                    iframe.hidden = false;
                    break;
                case "video-picked":
                    document.getElementById("picking").hidden = true;
                    document.getElementById("waiting").hidden = true;
                    this.initPlayer(message.payload);
                    break;
                case "video-play":
                    this.onPlayVideo();
                    break;
                case "video-pause":
                    this.onPauseVideo();
                    break;
                case "video-play-at":
                    this.onPlayAtVideo(parseInt(message.payload));
                    break;
                default:
                    break;
            }
        }

        //Shows "<username> is picking a file"
        private showWaiting() {
            let waitingElement = document.getElementById("waiting");
            waitingElement.innerHTML = `${this.initializer.clientName} is loading a video`;
            waitingElement.hidden = false;
        }

        private log(...message: any) {
            console.log(`${this.currentClient.clientName} logged: "`, ...message);
        }
    }
}

new Kosy.Integration.Youtube.App().start({});