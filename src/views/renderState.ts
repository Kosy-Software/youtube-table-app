import { ComponentState } from "../lib/appState";
import { ComponentMessage } from '../lib/appMessages';
import { renderViewingState } from './renderViewingState';
import { renderPickingState } from './renderPickingState';
import { renderWaitingState } from './renderWaitingState';

type Dispatch = (msg: ComponentMessage) => void;
type RenderView = (state: ComponentState, dispatch: Dispatch) => HTMLElement;

export function render(state: ComponentState, dispatch: Dispatch): void {
    let renderView: RenderView;
    let rootNode = document.getElementById("root");
    let videoPlayer = rootNode.firstChild as HTMLIFrameElement;

    if (state?.youtubeUrl) {
        renderView = renderViewingState;
        if (state.videoState != null && videoPlayer != null) {
            videoPlayer.hidden = false;
            state.player.handleStateChange(state.videoState, state.time);
        }
    } else {
        let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;
        viewingRoot.hidden = true;

        if (state.currentClient.clientUuid == state.initializer.clientUuid) {
            renderView = renderPickingState;
        } else {
            renderView = renderWaitingState;
        }
    }

    //Only redraw the whole view when there is a new url, not when video state is updated
    if (state.videoState == null || state.player?.videoId == null) {
        //No need to import (and maintain) an entire component library and its customs for this small app...
        //All of the states are cleanly defined
        var emptyNode = rootNode.cloneNode(false);
        //Clears the root node
        rootNode.parentNode.replaceChild(emptyNode, rootNode);
        //Appens the child to the root node
        emptyNode.appendChild(renderView(state, dispatch));
    }
}