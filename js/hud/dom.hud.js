import { win77 } from "../dne-cli.js";
import { pokeButtonMarkup } from "../utils/pokeButtonMarkup.js";
import { createNode } from "../utils/createNode.js";
import { PAGE_NAMES } from "./router.hud.js";
import { getCardElement } from "../cards/template.cards.js";
import { drawCard, drawLootCards, updHand } from "../cards/dom.cards.js";

const hudMarkup = `
<h1 class="score">
    <span id="player-score" class="js-score-val">5</span> vs <span id="versus-score" class="js-score-val">12</span>
</h1>
<!--<video class="background-house" src="../../mp4/video-place.mp4" autoplay></video>-->
<div id="inventory-card-display"></div>

<div id="table" class="table" data-owner="Navischo"></div>

<!-- <div id="top-hand" class="hand"></div> -->

<div id="bottom-hand" class="card-container hand"></div>

<!-- ${pokeButtonMarkup} -->
`;

const initHud = () => {
    win77.page.node.innerHTML = ``;
    createNode(win77.page.node, "div", hudMarkup, PAGE_NAMES.hud);
    updHand();
}

export { hudMarkup, initHud };
