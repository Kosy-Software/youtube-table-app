import { ClientInfo } from '@kosy/kosy-app-api/types';
import { YoutubePlayer } from '../player';

export interface AppState {
    /// This state is only set once in this app
    youtubeUrl?: string;
    videoState?: YT.PlayerState;
}

export interface ComponentState extends AppState {
    /// Immutable, represents the parent kosy client
    currentClient: ClientInfo;
    /// Immutable, represents the kosy client that started the app
    initializer: ClientInfo;
    player: YoutubePlayer;
}