import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';

export function renderViewingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;

    let urlParts = state.youtubeUrl.split('=');
    let videoId = urlParts[1];

    if (state.player != null) {
        state.player.setVideoId(videoId);

        let iframe = state.player.getPlayer();
        iframe.classList.add('overlay');
        return iframe;
    }

    let emptyNode = viewingRoot.cloneNode(false) as HTMLElement;
    return emptyNode;
}