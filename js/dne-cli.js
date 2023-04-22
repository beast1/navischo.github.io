import { getRandomInt, moveCardById } from "./utils/getCardById.js";

class DNECli {
    constructor() {}

    log(command) {
        return console.log(command);
    }

    setGame(gameObj) {
        this.game = gameObj;
        this.game.bank = 10000000;
    }

    setPlayer(playerObj) {
        this.game.player = playerObj;
    }

    setCatalog(category) {
        this.game.catalog[category] = this.game[category];
        delete this.game[category];
    }

    setTable() {
        this.game.table = new Set();
    }

    getCostFromPlayer(cost) {
        this.game.player.balance.bankroll = this.game.player.balance.bankroll - cost;
    }

    getSkillPointsFromPlayer(count) {
        this.game.player.balance.skillPoints = this.game.player.balance.skillPoints - count;
        console.log("getSkillPointsFromPlayer", count, this.game.player.balance.skillPoints);
    }

    putCardAtPlayersHand(count = 1) {
        for (let i = 0; i < count; i++) {
            const soundSet = this.game.catalog.sound;
            const randomId = Array.from(soundSet).map((soundCard) => soundCard.id)[getRandomInt(soundSet.size)];
            moveCardById(randomId, soundSet, this.game.player.hand);
        }
    }
}

const win77 = new DNECli();
window.win77 = win77;

export { win77 };
