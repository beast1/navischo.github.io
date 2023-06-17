import { getRandomInt } from "./getCardById.js";

const loadLogo = document.querySelector("#load-logo");
if (loadLogo) {
    const handler = () => {
        document
            .querySelector(".windows__logo")
            .style.filter = `hue-rotate(${getRandomInt(360)}deg)`;
    }
    handler();
    const interval = setInterval(handler, 15000);

    const finishHandler = () => {
        document.querySelector(".sudo-page").remove();
        clearInterval(interval);
        clearTimeout(loadingFinishTimeout);
    };
    const loadingFinishTimeout = setTimeout(finishHandler, getRandomInt(30000));
    const burnSudoPage = () => {
        const sudoPage = document.querySelector(".sudo-page");
        if (sudoPage) {
            sudoPage.remove();
        } else {
            document.removeEventListener("click", burnSudoPage);
        }
    };
    document.addEventListener("keydown", burnSudoPage);
}