import './styles/style.scss';

import { AppMessage, ComponentMessage } from './lib/appMessages';
import { AppState } from './lib/appState';
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

        private kosyApi = new KosyApi<AppState, AppMessage>({
            onClientHasJoined: (client) => this.onClientHasJoined(client),
            onClientHasLeft: (client) => this.onClientHasLeft(client),
            onReceiveMessage: (message) => this.processMessage(message),
            onRequestState: () => this.getState()
        })
        public async start() {
            let initialInfo = await this.kosyApi.startApp();
            this.initializer = initialInfo.clients[initialInfo.initializerClientUuid];
            this.currentClient = initialInfo.clients[initialInfo.currentClientUuid];
            this.state = initialInfo.currentAppState ?? this.state;
            this.player = new YoutubePlayer((cm) => this.processComponentMessage(cm))
            this.renderComponent();

            //Might not be the best way of handling the google picker -> but it works well enough...
            window.addEventListener("message", (event: MessageEvent<ComponentMessage>) => {
                this.processComponentMessage(event.data)
            });
        }

        public getState() {
            return this.state;
        }

        public onClientHasJoined(client: ClientInfo) {
            //No need to process this message for this app
        }

        public onClientHasLeft(client: ClientInfo) {
            //If no google drive url has been picked, and the initializer is gone -> end the integration
            if (client.clientUuid === this.initializer.clientUuid && !this.state.youtubeUrl) {
                this.kosyApi.stopApp();
            }
        }

        public processMessage(message: AppMessage) {
            switch (message.type) {
                case "receive-youtube-url":
                    if (isValidYoutubeUrl(message.payload)) {
                        this.state.youtubeUrl = message.payload;;
                        this.renderComponent();
                    }
                    break;
                case "receive-youtube-video-state":
                    this.state.videoState = message.payload;
                    this.renderComponent();
                    break;
            }
        }


        private processComponentMessage(message: ComponentMessage) {
            switch (message.type) {
                case "youtube-url-changed":
                    //Notify all other clients that the youtube url has changed
                    this.kosyApi.relayMessage({ type: "receive-youtube-url", payload: message.payload });
                    break;
                case "youtube-video-state-changed":
                    //Notify all other clients that the youtube video state has changed
                    this.kosyApi.relayMessage({ type: "receive-youtube-video-state", payload: message.payload });
                    break;
                default:
                    break;
            }
        }

        //Poor man's react, so we don't need to fetch the entire react library for this tiny app...
        private renderComponent() {
            render({
                youtubeUrl: this.state.youtubeUrl,
                videoState: this.state.videoState,
                currentClient: this.currentClient,
                initializer: this.initializer,
                player: this.player,
            }, (message) => this.processComponentMessage(message));
        }

        private log(...message: any) {
            console.log(`${this.currentClient?.clientName ?? "New user"} logged: `, ...message);
        }
    }

    new App().start();
}