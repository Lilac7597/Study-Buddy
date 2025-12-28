import { InteractionResponseType } from "discord-interactions";
import { utils } from "../utils/index.js";
import { readData, writeData, DiscordRequest } from "../utils/utils.js";

//classes command
export async function choose_btn(req, res) {
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Select the classes you are currently taking: ",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 3,
                    custom_id: "class_select",
                    placeholder: "Select classes (max 7)",
                    options: await utils.getClassesOptions(guildId),
                    //options: [{ label: "hi", value: "hi" }],
                    min_values: 0,
                    max_values:
                      d.classesList.length < 7 ? d.classesList.length : 7,
                  },
                ],
              },
            ],
          },
        });
        // Delete previous message
        await DiscordRequest(endpoint, { method: "DELETE" });
    } catch (err) {
        console.error("Error sending message:", err);
    }
}

//classes command
export async function class_select(req, res) {
    const userId = String(req.body.member.user.id);
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    const { data } = req.body;
    const selected = data.values;

    for (var i = 0; i < d.classesMap.length; i++) {
        if (d.classesMap[i].users.includes(userId)) {
          d.classesMap[i].users.splice(
            d.classesMap[i].users.indexOf(userId),
            1
          );
        }
    }

    d.classesMap.forEach((cls) => {
        // Check if the class is selected and the userId is not already in the users list
        if (selected.includes(cls.class) && !cls.users.includes(userId)) {
            cls.users.push(userId); // Add userId to the users list
        }
    });

    if (!d.userNotifs.includes(userId)) {
        d.userNotifs.push(userId);
    }

    dataIn.guilds[guildId] = d;
    writeData(dataIn);

    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              data.values.length === 0
                ? "You will not be notified of any upcoming quizzes, tests, or events."
                : "You will now be notified of any upcoming quizzes, tests, or events from these classes: " +
                  "```\n" +
                  selected.join("\n") +
                  "\n```" +
                  "Go to `/settings` to disable notifications.",
          },
        });
        // Delete previous message
        await DiscordRequest(endpoint, { method: "DELETE" });
    } catch (err) {
        console.error("Error sending message:", err);
    }
}