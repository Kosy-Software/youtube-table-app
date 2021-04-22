import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';

export function renderViewingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;
    viewingRoot.hidden = false;

    let urlParts = state.youtubeUrl.split('=');
    let videoId = urlParts[1];

    state.player.setVideoId(videoId);

    return state.player.getPlayer();
}