import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';
import { YoutubePlayer } from "../player";

export function renderViewingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;

    let urlParts = state.youtubeUrl.split('=');
    let videoId = urlParts[1];

    let player = new YoutubePlayer(videoId, dispatch);

    if (state.videoState != null) {
        player.handleStateChange(state.videoState);
    }

    return viewingRoot;
}
