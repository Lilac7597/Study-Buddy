import { InteractionResponseType } from "discord-interactions";
import { utils } from "../utils/index.js";
import { readData, writeData, DiscordRequest } from "../utils/utils.js";

//calculate-gpa command - runs when modal submit button is pressed
export async function calculateModal (req, res) {
    const { data } = req.body;
    var inputValues = [];
    for (let action of data.components) {
        let inputComponent = action.components[0];
        inputValues.push(inputComponent.value);
    }

    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    const userId = String(req.body.member.user.id);
    var filteredClassesMap = [];
    filteredClassesMap = d.classesMap.filter(
        (entry) => entry.rank === "Ranked"
    );

    filteredClassesMap = filteredClassesMap.filter((entry) =>
        entry.users.includes(userId)
    );

    for (var i = filteredClassesMap.length - 1; i > 4; i--) {
        filteredClassesMap.splice(i, 1);
    }

    var sum = 0;
    for (var i = 0; i < inputValues.length; i++) {
        var decrement = 4;
        var count = 0;
        var classGPA;

        if (filteredClassesMap[i].class.startsWith("AP")) {
          classGPA = 6;
        } else if (filteredClassesMap[i].class.startsWith("MAP")) {
          classGPA = 5.5;
        } else {
          classGPA = 5;
        }

        for (var j = 97; j > inputValues[i]; j -= decrement) {
          classGPA -= 0.2;
          if (count == 0) {
            decrement = 4;
          } else {
            decrement = 3;
          }
          count = (count + 1) % 3;
        }

        if (inputValues[i] < 70) {
          classGPA = 0;
        } else if (inputValues[i] == 70) {
          classGPA -= 0.4;
        }
        sum += classGPA;
    }
    var GPA = sum / inputValues.length;

    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Your ranked GPA is: ${GPA.toFixed(3)}`,
        },
    });

    await DiscordRequest(endpoint, { method: "DELETE" });
}

//settings command - runs when the channel ID modal is submitted
export async function channelModal (req, res) {
    const { data } = req.body;
    const inputValue = data.components[0].components[0].value;

    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    d.channel_id = inputValue;
    dataIn.guilds[guildId] = d;
    writeData(dataIn);

    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Channel ID updated to **${d.channel_id}**!\n`,
            components: [
{
                type: 1,
                components: [
                {
                    type: 2,
                    custom_id: "s_back_btn",
                    style: 1,
                    label: "Back to Settings",
                },
                ],
            },
            ],
        },
    });

    await DiscordRequest(endpoint, { method: "DELETE" });
}