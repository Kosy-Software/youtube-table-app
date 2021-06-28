import { ComponentState } from '../lib/appState';
import { ComponentMessage } from '../lib/appMessages';

//Renders the waiting state
export function renderWaitingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let waitingRoot = document.querySelector("#waiting") as HTMLTemplateElement;
    let waitingElement = waitingRoot.content.firstElementChild.cloneNode(true) as HTMLElement;
    let label = waitingElement.querySelector("label") as HTMLElement;
    label.innerHTML = `${state.initializer.clientName} is picking a video to share`;

    let openVideoBtn = waitingElement.querySelector("#start-video") as HTMLInputElement;

    if (state?.youtubeUrl) {
        openVideoBtn.style.display = 'block'
        openVideoBtn.classList.add("valid");
    } else {
        openVideoBtn.style.display = 'none'
    }

    openVideoBtn.onclick = () => {
        dispatch({ type: "youtube-start-playing" });
    }

    return waitingElement;
}