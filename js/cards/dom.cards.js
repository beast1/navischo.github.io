import { win77 } from "../dne-cli.js";
import { getCardElement } from "./template.cards.js";
import { COMMANDS } from "./const.cards.js";
import { drawImgLazy } from "../utils/drawImgLazy.js";
import { createNode } from "../utils/createNode.js";
import { initInventory } from "../hud/inventory.hud.js";
import { moveCardById } from "../utils/getCardById.js";
import { updBalanceNode } from "../hud/balance.hud.js";
import { isSetHasId } from "../utils/isSetHasId.js";
import { PAGE_NAMES } from "../hud/router.hud.js";
import { openWithTimer } from "../hud/tab.hud.js";
import { setExecutive } from "../hud/table.hud.js";
import { CARD_TYPES } from "./const.cards.js";
import { dialog } from "../hud/dialog.hud.js";
import { openPopup } from "../popup/dom.popup.jquery.js";
import { initOneMoreBtn } from "../utils/initOneMoreBtn.js";


const initHandlers = (cardData, controls) => {
    const catalog = win77.game.catalog[cardData.type];
    const plusButtonHandler = () => {
        const currentPage = win77.router.currentPage;
        const isItCatalogPage = currentPage === PAGE_NAMES.npc || currentPage === PAGE_NAMES.class;
        const isItCharacterCard = cardData.type === CARD_TYPES.npc || cardData.type === CARD_TYPES.class;
        console.log(`You are ${COMMANDS.plus} ${cardData.id}`);

        if (isItCharacterCard && currentPage === PAGE_NAMES.hud) {
            setExecutive(cardData.name);
        }

        if (isItCatalogPage && isSetHasId(catalog, cardData.id)) {
            win77.getSkillPointsFromPlayer(1);
            win77.updBalanceHUD();
            moveCardById(cardData.id, catalog, win77.game.player[cardData.type]);
            initInventory();
        }
    };

    const buyButtonHandler = () => {
        const catalog = win77.game.catalog[cardData.type];
        // console.log("win get cost", cardData.cost, cardData);
        // console.log("isSetHasId(catalog, cardData.id)", isSetHasId(catalog, cardData.id));
        if (isSetHasId(catalog, cardData.id)) {
            win77.getCostFromPlayer(cardData.costObj.buy);
            updBalanceNode();
            moveCardById(cardData.id, catalog, win77.game.player[cardData.type]);
            initInventory();
        } else {
            console.log(`Item ${cardData.name} was already sold`);
        }
    };

    const rentButtonHandler = () => {
        const catalog = win77.game.catalog[cardData.type];
        if (isSetHasId(catalog, cardData.id) && cardData.costObj.rentAvailable) {
            win77.getCostFromPlayer(cardData.costObj.rent);
            updBalanceNode();
            moveCardById(cardData.id, catalog, win77.game.player[cardData.type]);
            initInventory();
        } else {
            console.log(`Item ${cardData.name} is already in rent`);
        }
    };

    const talkButtonHandler = () => {
        if (cardData.id === "felix") {
            const audioObj = new Audio("../../mp3/mur.mp3");
            audioObj.play();
        }
    }

    controls.btns.forEach((btn) => {
        if (btn.textContent === COMMANDS.plus) {
            btn.addEventListener("click", plusButtonHandler);
        } else if (btn.textContent === COMMANDS.buy) {
            btn.addEventListener("click", buyButtonHandler);
        } else if (btn.textContent === COMMANDS.rent) {
            btn.addEventListener("click", rentButtonHandler);
        } else if (btn.textContent === COMMANDS.talk) {
            btn.addEventListener("click", talkButtonHandler);
        }
    });
}

const addCardControls = (newCard, cardData) => {
    const controls = {};
    controls.parent = newCard.querySelector(".js-card-controls");
    if (cardData.type === "loot") {
        createNode(controls.parent, "button", COMMANDS.buy, COMMANDS.buy);
        cardData.costObj.rentAvailable ? createNode(controls.parent, "button", COMMANDS.rent, COMMANDS.rent) : "";
    }
    if (cardData.type === "npc") {
        createNode(controls.parent, "button", COMMANDS.talk, COMMANDS.talk);
    }
    controls.btns = controls.parent.querySelectorAll("button");

    initHandlers(cardData, controls);
}

const drawCard = (cardContainer, getElementCallback, cardData) => {
    const newCard = getElementCallback(cardData);

    addCardControls(newCard, cardData);

    // if (win77.router.currentPage === PAGE_NAMES.hud) {
        newCard.querySelector(".card__preview-img").src = cardData.img;
    // } else {
    //     drawImgLazy(newCard.querySelector(".card__preview-img"), cardData.img);
    // }

    // console.log(`drawCard()`, newCard);
    cardContainer.appendChild(newCard);
    // console.log(`drawCard() cardContainer`, cardContainer);
};

win77.pokeButton.dia.drawCard = drawCard;

const drawLootCards = (cardData, parentSelector = "#dne-page") => {
    const cardContainer = document.querySelector(parentSelector);
    // console.log(`drawLootCards()`, cardData, parentSelector, cardContainer);

    const drawIt = (DNELootCard) => {
        drawCard(cardContainer, getCardElement, DNELootCard);
    }

    // console.log("cardDataforEach", cardData);
    Array.from(cardData).forEach(drawIt);
}

const updHand = () => {
    const hand = document.querySelector("#bottom-hand");
    hand.innerHTML = ``;
    drawLootCards(win77.game.player.hand, "#bottom-hand");

    const cardsInYourHand = hand.querySelectorAll("div[id*='dne-card']");
    initOneMoreBtn();
    cardsInYourHand.forEach(card => {
        const plusBtn = card.querySelector("button");
        plusBtn.addEventListener("click", (e) => {
            const id = card.id.substring(9);
            const bonus = +(card.querySelector(".card__bonus").textContent);
            console.log(win77);
            openWithTimer();
            moveCardById(id, win77.game.player.hand, win77.game.table);
            updTable();

            win77.pokeButton.dia.updScore(bonus);

            hand.querySelector(`#dne-card-${id}`).remove();

            initOneMoreBtn();

            if (win77.game.player.score <= win77.game.versusScore && win77.game.player.hand.size === 0) {
                dialog.init(dialog.DIALOG_ID.oneMore);
                openPopup("#dialog-popup");
            } else {
                dialog.init(dialog.DIALOG_ID.start);
            }
        });
    });
}

win77.putCardAtPlayersHand(5);
win77.pokeButton.dia.goToPage("hud");


const updTable = () => {
    const node = document.querySelector("#table");
    node.innerHTML = ``;
    drawLootCards(win77.game.table, "#table");
}
updTable();

export { drawLootCards, drawCard, updHand, updTable };
