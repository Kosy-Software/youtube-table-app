import './styles/style.scss';

import { AppMessage, ComponentMessage } from './lib/appMessages';
import { AppState, ViewState } from './lib/appState';
import { render } from './views/renderState';
import { isValidYoutubeUrl } from './lib/validation';
import { ClientInfo } from '@kosy/kosy-app-api/types';
import { KosyApi } from '@kosy/kosy-app-api';
import { YoutubePlayer } from './player';

module Kosy.Integration.Youtube {
    export class App {
        private state: AppState = { youtubeUrl: null, videoState: null };
        private initializer: ClientInfo;
        private currentClient: ClientInfo;
        private player: YoutubePlayer;
        private viewState: ViewState;

        private kosyApi = new KosyApi<AppState, AppMessage, AppMessage>({
            onClientHasLeft: (clientUuid) => this.onClientHasLeft(clientUuid),
            onReceiveMessageAsClient: (message) => this.processMessage(message),
            onReceiveMessageAsHost: (message) => this.processMessageAsHost(message),
            onRequestState: () => this.getState(),
            onProvideState: (newState: AppState) => this.setState(newState)
        })

        public async start() {
            await this.setupPlayerScript();
            let initialInfo = await this.kosyApi.startApp();
            this.initializer = initialInfo.clients[initialInfo.initializerClientUuid];
            this.currentClient = initialInfo.clients[initialInfo.currentClientUuid];
            this.state = initialInfo.currentAppState ?? this.state;
            this.player = new YoutubePlayer(null, this.initializer.clientUuid == this.currentClient.clientUuid, (cm) => this.processComponentMessage(cm), this.state);
            this.viewState = initialInfo.currentClientUuid == initialInfo.initializerClientUuid ? "picking" : "waiting";
            this.renderComponent();

            window.addEventListener("message", (event: MessageEvent<ComponentMessage>) => {
                this.processComponentMessage(event.data)
            });
        }

        private async setupPlayerScript() {
            return new Promise<void>((resolve, reject) => {
                //Make sure api is loaded before initializing player
                window.onYouTubeIframeAPIReady = () => resolve()
    
                const tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
    
                const firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            });
        }

        public setState(newState: AppState) {
            this.state = newState;
            this.renderComponent();
        }

        public getState() {
            return this.state;
        }

        public onClientHasLeft(clientUuid: string) {
            if (clientUuid === this.initializer.clientUuid) {
                if (!this.state.youtubeUrl) {
                    this.kosyApi.stopApp();
                } else {
                    this.kosyApi.relayMessage({ type: 'assign-new-host' });
                }
            }
        }

        public processMessage(message: AppMessage) {
            switch (message.type) {
                case "close-integration":
                    this.kosyApi.stopApp();
                    break;
                case "receive-youtube-url":
                    if (isValidYoutubeUrl(message.payload)) {
                        this.state.youtubeUrl = `${message.payload}`;
                        if (this.currentClient.clientUuid === this.initializer.clientUuid) {
                            this.viewState = "viewing";
                        }
                        this.renderComponent();
                    }
                    break;
                case "receive-youtube-video-state":
                    if (this.currentClient.clientUuid !== this.initializer.clientUuid && (this.viewState === "viewing" || message.payload.state == YT.PlayerState.PLAYING)) {
                        this.viewState = "viewing";
                        this.player.handleStateChange(message.payload.state, message.payload.time);
                        this.state.videoState = message.payload.state;
                        this.state.time = message.payload.time;
                        this.renderComponent();
                    }
                    if (this.state.videoState == YT.PlayerState.ENDED) {
                        console.log("Video ended, clearing youtube url");
                        this.state.youtubeUrl = null;
                        this.state.videoState = null;
                        this.kosyApi.stopApp();
                    }
                    break;
            }
        }

        public processMessageAsHost(message: AppMessage): AppMessage {
            switch (message.type) {
                case "assign-new-host":
                    this.renderComponent();
                    break;
                case "request-youtube-video-state":
                    return { 
                        type: "receive-youtube-video-state", 
                        payload: { state: this.state.videoState, time: this.state.time } 
                    };
                default:
                    return message;
            }

            return null;
        }

        private processComponentMessage(message: ComponentMessage) {
            switch (message.type) {
                case "close-integration":
                    this.kosyApi.relayMessage({ type: "close-integration" });
                    break;
                case "youtube-url-changed":
                    //Notify all other clients that the youtube url has changed
                    this.kosyApi.relayMessage({ type: "receive-youtube-url", payload: message.payload });
                    break;
                case "youtube-video-state-changed":
                    //Notify all other clients that the youtube video state has changed
                    this.kosyApi.relayMessage({ type: "receive-youtube-video-state", payload: message.payload });
                    break;
                case "request-youtube-video-state":
                    this.kosyApi.relayMessage(message);
                default:
                    break;
            }
        }

        //Poor man's react, so we don't need to fetch the entire react library for this tiny app...
        private renderComponent() {
            render({
                youtubeUrl: this.state.youtubeUrl,
                videoState: this.state.videoState,
                time: this.state.time,
                currentClient: this.currentClient,
                initializer: this.initializer,
                player: this.player,
                viewState: this.viewState
            }, (message) => this.processComponentMessage(message));
        }

        private log(...message: any) {
            console.log(`${this.currentClient?.clientName ?? "New user"} logged: `, ...message);
        }
    }

    new App().start();
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
    }
}