import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';

export function renderViewingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;

    let urlParts = state.youtubeUrl.split('=');
    let videoId = urlParts[1];

    state.player.setVideoId(videoId);

    if (state.videoState != null) {
        state.player.handleStateChange(state.videoState);
    }

    return viewingRoot;
}