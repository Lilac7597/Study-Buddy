import { InteractionResponseType } from "discord-interactions";
import { constants, dataUtils, embedUtils, utils } from "../utils/index.js";

export function calculateGPA (req, res) {
    const embed = embedUtils.createGPAEmbed();

    return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: dataUtils.displayGPAMenu(embed),
    });
}