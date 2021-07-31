import { ClientInfo } from '@kosy/kosy-app-api/types';
import { YoutubePlayer } from '../player';

export type ViewState = "picking" | "waiting" | "viewing"

export interface AppState {
    /// This state is only set once in this app
    youtubeUrl?: string;
    videoState?: YT.PlayerState;
    time?: number;
}

export interface ComponentState extends AppState {
    /// Immutable, represents the parent kosy client
    currentClient: ClientInfo;
    /// Immutable, represents the kosy client that started the app
    initializer: ClientInfo;
    /// Represents the current view state
    viewState: ViewState;
    /// The wrapped youtube player, it is always present, but might not be rendered full-screen yet
    player: YoutubePlayer;
}