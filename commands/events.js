import { InteractionResponseType } from "discord-interactions";
import { constants, dataUtils, embedUtils, utils } from "../utils/index.js";
import { readData, writeData } from "../utils/utils.js";

export function events (req, res) {
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

      const embed = embedUtils.createEventsEmbed(d);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
        },
      });
}

export function addEvent (req, res) {
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    var className = d.classesList[req.body.data.options[0].value - 1];
    var eventName = req.body.data.options[1].value;
    var eventDate = req.body.data.options[2].value;

    const datePattern = /^\d{2}-\d{2}-\d{2}$/;
    const dateObj = new Date(eventDate);
    if (!datePattern.test(eventDate) || isNaN(dateObj.getTime())) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Invalid date. Please use MM-DD-YY format.",
            ephemeral: true,
          },
        });
    } else if (
        req.body.data.options[0].value <= 0 ||
        req.body.data.options[0].value > d.classesList.length
    ) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Class number not found.",
            ephemeral: true,
          },
        });
    } else {
        d.eventsMap.push({
          class: className,
          name: eventName,
          date: eventDate,
        });

        d.eventsMap.sort((a, b) => {
          const [aMonth, aDay, aYear] = a.date.split("-").map(Number);
          const [bMonth, bDay, bYear] = b.date.split("-").map(Number);
          const dateA = new Date(aYear, aMonth - 1, aDay); // Months are 0-based in JS
          const dateB = new Date(bYear, bMonth - 1, bDay);
          return dateA - dateB;
        });

        dataIn.guilds[guildId] = d;
        writeData(dataIn);
    }

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Event "${eventName}" successfully added!`,
        },
    });
}

export function removeEvent (req, res) {
    const index = req.body.data.options[0].value - 1;

    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    if (index >= 0 && index < d.eventsMap.length) {
        d.eventsMap.splice(index, 1);
        dataIn.guilds[guildId] = d;
        writeData(dataIn);

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Event successfully removed! Current number of events: ${d.eventsMap.length}`,
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