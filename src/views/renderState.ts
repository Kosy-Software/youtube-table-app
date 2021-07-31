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
    let redrawView = state.videoState == null || state.player.videoId == null;

    switch (state.viewState) {
        case "picking": renderView = renderPickingState; break;
        case "viewing": renderView = renderViewingState; break;
        case "waiting": renderView = renderWaitingState; break;
        default: break;
    }

    //Only redraw the whole view when there is a new url, not when video state is updated
    if (redrawView && renderView != null) {
        console.log("App is redrawn");
        //No need to import (and maintain) an entire component library and its customs for this small app...
        //All of the states are cleanly defined
        var emptyNode = rootNode.cloneNode(false);
        //Clears the root node
        rootNode.parentNode.replaceChild(emptyNode, rootNode);
        //Appens the child to the root node
        emptyNode.appendChild(renderView(state, dispatch));
    }
}