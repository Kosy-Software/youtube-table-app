import { ComponentState } from '../lib/appState';
import { ComponentMessage } from '../lib/appMessages';

//Renders the waiting state
export function renderWaitingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let waitingRoot = document.querySelector("#waiting") as HTMLTemplateElement;
    let waitingElement = waitingRoot.content.firstElementChild.cloneNode(true) as HTMLElement;
    let label = waitingElement.querySelector("label") as HTMLElement;
    if (state.youtubeUrl) {
        label.innerHTML = `Video is being synchronized with ${state.initializer.clientName}`;
    } else {
        label.innerHTML = `${state.initializer.clientName} is picking a video to share`;
    }
    return waitingElement;
}