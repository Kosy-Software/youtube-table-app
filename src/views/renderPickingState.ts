import { ComponentState } from "../lib/appState";
import { ComponentMessage } from "../lib/appMessages";
import { isValidYoutubeUrl } from "../lib/validation";

//Renders the picking state
export function renderPickingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let pickingRoot = document.querySelector("#picking") as HTMLTemplateElement;
    let picker = pickingRoot.content.cloneNode(true) as HTMLElement;

    let fileUrlInput = picker.querySelector("input");
    let openVideoBtn = picker.querySelector("#open-video") as HTMLInputElement;
    fileUrlInput.oninput = (event: Event) => {
        const val = fileUrlInput.value;
        if (isValidYoutubeUrl(val)) {
            openVideoBtn.removeAttribute("disabled");
            fileUrlInput.style.color = "black";
        } else {
            openVideoBtn.setAttribute("disabled", "disabled");
            fileUrlInput.style.color = "red";
        }
    }
    //This sets up the google input element -> on input changed -> relay a message
    openVideoBtn.onclick = (event: Event) => {
        //First draft -> google drive url needs to be validated, for now, this just accepts everything
        let url = fileUrlInput.value;
        dispatch({ type: "youtube-url-changed", payload: url });
    }

    return picker;
}