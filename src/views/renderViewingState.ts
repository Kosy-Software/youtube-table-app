import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';

export function renderViewingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;

    let urlParts = state.youtubeUrl.split('=');
    let videoId = urlParts[1];

    if (state.player != null) {
        let container = document.createElement("div");
        state.player.setVideoId(videoId).then(async () => {
            let iframe = await state.player.getIframe();
            container.appendChild(iframe);
        });
        return container;
    }
    let emptyNode = viewingRoot.cloneNode(false) as HTMLElement;
    return emptyNode;
}