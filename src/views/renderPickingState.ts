import { ComponentState } from "../lib/appState";
import { ComponentMessage } from "../lib/appMessages";
import { isValidYoutubeUrl } from "../lib/validation";

//Renders the picking state
export function renderPickingState(state: ComponentState, dispatch: ((msg: ComponentMessage) => any)): HTMLElement {
    let pickingRoot = document.querySelector("#picking") as HTMLTemplateElement;
    let picker = pickingRoot.content.cloneNode(true) as HTMLElement;

    let youtubeUrlInput = picker.querySelector("input");
    let openVideoBtn = picker.querySelector("#open-video") as HTMLInputElement;

    let viewingRoot = document.querySelector("#viewing") as HTMLTemplateElement;
    viewingRoot.hidden = true;

    let errorLabel = picker.querySelector("#error") as HTMLElement;

    youtubeUrlInput.oninput = (event: Event) => {
        const val = youtubeUrlInput.value;

        youtubeUrlInput.classList.remove("invalid");
        youtubeUrlInput.classList.remove("valid");
        openVideoBtn.classList.remove("valid");

        if (isValidYoutubeUrl(val)) {
            openVideoBtn.removeAttribute("disabled");
            errorLabel.innerHTML = '';
            errorLabel.style.marginBottom = "0";
            errorLabel.style.marginTop = "0";

            youtubeUrlInput.style.color = "black";
            openVideoBtn.classList.add("valid");
            youtubeUrlInput.classList.add("valid");
        } else {
            errorLabel.innerHTML = 'This is an invalid youtube video url';
            errorLabel.style.marginBottom = "16px";
            errorLabel.style.marginTop = "5px";

            openVideoBtn.setAttribute("disabled", "disabled");
            youtubeUrlInput.classList.add("invalid");
            youtubeUrlInput.style.color = "red";
        }
    }
    //This sets up the google input element -> on input changed -> relay a message
    openVideoBtn.onclick = (event: Event) => {
        //First draft -> google drive url needs to be validated, for now, this just accepts everything
        let url = youtubeUrlInput.value;
        dispatch({ type: "youtube-url-changed", payload: url });
    }

    return picker;
}