import { InteractionResponseType } from "discord-interactions";
import { constants, dataUtils, embedUtils, utils } from "../utils/index.js";
import { readData, writeData } from "../utils/utils.js";

export function classes (req, res) {
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    const embed = embedUtils.createClassesEmbed(d);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: dataUtils.displayClassesMenu(d, embed),
    });
}

export function addClass (req, res) {
    const className = req.body.data.options[0].value;
    const ranked = req.body.data.options[1].value;
    const rank = ranked ? "Ranked" : "Unranked";

    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    d.classesList.push(className);
    d.classesMap.push({ class: className, rank: rank, users: [] });
    dataIn.guilds[guildId] = d;
    writeData(dataIn);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Class "${className}" successfully added!`,
        },
    });
}

export function removeClass (req, res){
    const index = req.body.data.options[0].value - 1;
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    if (index >= 0 && index < d.classesList.length) {
        d.classesList.splice(index, 1);
        d.classesMap.splice(index, 1);
        dataIn.guilds[guildId] = d;
        writeData(dataIn);

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Class successfully removed! Current number of classes: ${d.classesList.length}`,
          },
        });
    } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Index not found.",
            ephemeral: true,
        },
        });
    }
}
