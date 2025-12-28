import { InteractionResponseType } from "discord-interactions";
import { constants, dataUtils, embedUtils, utils } from "../utils/index.js";
import { readData, writeData } from "../utils/utils.js";

export function test (req, res) {
    return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "Yayy I'm working :D",
            },
          });
}

export function hi (req, res) {
    var random = Math.floor(Math.random() * constants.responsesList.length);
          const userId = req.body.member.user.id;
    
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: constants.responsesList[random] + ` <@${userId}>!`,
            },
    });
}

export function help (req, res) {
    const embed = embedUtils.createHelpEmbed();
    
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: dataUtils.displayHelpMenu(embed),
    });
}

export function settings (req, res) {
    const guildId = req.body.guild_id;
    const userId = req.body.member.user.id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);
    const timezoneLabel = utils.findTimezoneLabel(d);
    
    const embed = embedUtils.createSettingsEmbed(d, timezoneLabel, userId);

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: dataUtils.displaySettingsMenu(d, embed, userId),
    });
}
