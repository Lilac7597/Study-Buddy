import { InteractionResponseType } from "discord-interactions";
import { constants, dataUtils, embedUtils, utils } from "../utils/index.js";
import { readData, writeData, DiscordRequest } from "../utils/utils.js";

//help command
export async function commands_btn(req, res) {
    const embed = {
        title: "Commands",
        description: "Here's a list of all the available commands you can use!",
        color: 7793062,
        footer: {
            icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
            text: "Hope this helped!",
        },
        thumbnail: {
            url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
            {
            name: "Try out any of these:",
            value:
                "- **/test:** Just makes sure Gerald works :)\n- **/hi:** He will greet you back!\n- **/settings:** Allows users to connfigure their notification channel and timezone settings, as well as enable/disable notifications.\n- **/classes:** View a list of all the classes that have been added. The 'Choose...' button allows the user to stay notified of upcoming events in the classes they choose.\n- **/add-class:** Adds a class.\n- **/remove-class:** Removes a class.\n- **/events:** View a list of all upcoming tests, quizzes, and events.\n- **/add-event:** Adds an event.\n- **/remove-event:** Removes an event.\n- **/calculate-gpa:** Calculates ranked GPA. In a modal, the user can enter their grades for each ranked class they are enrolled in.\n- **Additional:** The bot is programmed to remind users of the next day's events at 8pm. It will ping the people who are enrolled in the event's corresponding class. Also, it will delete the current day's events, as they have probably already been completed by 8pm.",
            },
        ],
    };

    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    await res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        embeds: [embed],
        components: [
        {
            type: 1,
            components: [
            {
                type: 2,
                custom_id: "back_btn",
                style: 1,
                label: "Go Back",
            },
            ],
        },
        ],
    },
    });
    await DiscordRequest(endpoint, { method: "DELETE" });
}

//help command
export async function classes_btn(req, res) {
const embed = {
        title: "Classes",
        description: "Explanation of what the `/classes` command does!",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: "Hope this helped!",
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "What is this command for?",
            value:
              "The `/classes` command allows you to view a list of all the classes you added to it. The button below the embed that says `Choose...` allows the user to choose which classes they are currently enrolled in. Choosing classes will ensure that the user gets notified of any upcoming events (the ones in the `/events` list) that correspond to those classes.",
          },
          {
            name: "`/add-class`",
            value:
              "Adds a class to the list of\nclasses. Begin the class\nname with `MAP` if the class\nis a MAP class, or with `AP`\nif the class is an AP class.\nThis ensures accurate GPA\ncalculation.",
            inline: true,
          },
          {
            name: "`/remove-class`",
            value:
              "Removes a class\nfrom the list of\nclasses. Be careful,\nthis will delete the\nclass and all the\nuserIds associated\nwith it.",
            inline: true,
          },
        ],
      };

      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "back_btn",
                  style: 1,
                  label: "Go Back",
                },
              ],
            },
          ],
        },
      });
      await DiscordRequest(endpoint, { method: "DELETE" });
}

//help command
export async function events_btn(req, res) {
const embed = {
        title: "Events",
        description: "Explanation of what the `/events` command does!",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: "Hope this helped!",
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "What is this command for?",
            value:
              "The `/events` command allows you to view a list of all the upcoming tests, quizzes, and events you added to it. The left column is the class name, the middle column is the name of the event, and the right column is the date. This information is used by Gerald to notify users of any events occurring soon in their classes.",
          },
          {
            name: "`/add-event`",
            value:
              "Adds an event to the list of\nevents. Takes in three\narguments: class number,\nevent name, and date. The\nclass number can be found\nby doing the `/classes`\ncommand.",
            inline: true,
          },
          {
            name: "`/remove-event`",
            value:
              "Removes an event\nfrom the list of\nevents. Gerald will\nautomatically\nremove the current\nday's events at the\nend of the day.",
            inline: true,
          },
        ],
      };

      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "back_btn",
                  style: 1,
                  label: "Go Back",
                },
              ],
            },
          ],
        },
      });
      await DiscordRequest(endpoint, { method: "DELETE" });
}

//help command
export async function gpa_btn(req, res) {
       const embed = {
        title: "GPA Calculator",
        description: "Explanation of what the `/calculate-gpa` command does!",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: "Hope this helped!",
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "What is this command for?",
            value:
              "The `/calculate-gpa` command allows you calculate your ranked GPA. When you run the command, an embed containing additional information will be sent, with an `Open Form` button below it. This button will open a modal where you can enter your grades for each ranked class that you chose in `/classes`.",
          },
          {
            name: "How to use:",
            value:
              "1. Type `/classes` and click the `Choose...` button to choose the ranked classes you are enrolled in.\n2. Type `/calculate-gpa` and click the `Open Form` button to fill out your grades for each ranked class.\n3. Click `Submit` and your ranked GPA will be displayed!",
          },
          {
            name: "Disclaimers",
            value:
              "- Make sure you chose the correct classes in `/classes`, as you will be asked to input grades for those classes.\n- Discord modals have a limit of 5 text inputs per modal, so if you have more than 5 ranked classes, then only the first 5 will be displayed, which can result in inaccurate GPA calculations.",
          },
        ],
      };
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "back_btn",
                  style: 1,
                  label: "Go Back",
                },
              ],
            },
          ],
        },
      });
      await DiscordRequest(endpoint, { method: "DELETE" });
}

//settings command
export async function channel_id_btn (req, res) {
      await res.send({
        type: InteractionResponseType.MODAL,
        data: {
          title: "Update Notification Channel",
          custom_id: "channelModal",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 4,
                  style: 1,
                  label: "Enter Channel ID",
                  custom_id: "channel_id_input",
                  placeholder: "ex. 012345678901234567",
                },
              ],
            },
          ],
        },
      });
}

//settings command
export async function timezone_btn (req, res) {
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "What hemisphere are you located in?",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "eastern_btn",
                  style: 2,
                  label: "Eastern",
                },
                {
                  type: 2,
                  custom_id: "western_btn",
                  style: 2,
                  label: "Western",
                },
              ],
            },
          ],
        },
    });
    await DiscordRequest(endpoint, { method: "DELETE" });
}

//if user chooses eastern hemisphere for timezone
export async function eastern_btn (req, res) {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Select your timezone:",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: "timezone_select",
                  placeholder: "Please select a timezone",
                  options: constants.easternTimezoneOptions,
                },
              ],
            },
          ],
        },
      });

      await DiscordRequest(endpoint, { method: "DELETE" });
}

//if user chooses western hemisphere for timezone
export async function western_btn (req, res) {
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    await res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content: "Select your timezone:",
        components: [
        {
            type: 1,
            components: [
            {
                type: 3,
                custom_id: "timezone_select",
                placeholder: "Please select a timezone",
                options: constants.westernTimezoneOptions,
            },
            ],
        },
        ],
    },
    });

    await DiscordRequest(endpoint, { method: "DELETE" });
}

//after user has selected their timezone
export async function timezone_select (req, res) {
    const { data } = req.body;
    const inputValue = data.values[0];

    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    d.timezone = inputValue;
    dataIn.guilds[guildId] = d;
    writeData(dataIn);

    const timezoneLabel = utils.findTimezoneLabel(d);

    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    await res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
        content: `Timezone updated to **${timezoneLabel}**!\n`,
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

//settings command
export async function notifs_btn (req, res) {
    const userId = req.body.member.user.id;
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    if (d.userNotifs.includes(userId)) {
    d.userNotifs.splice(d.userNotifs.indexOf(userId), 1);
    } else {
    d.userNotifs.push(userId);
    }

    dataIn.guilds[guildId] = d;
    writeData(dataIn);

    const timezoneLabel = utils.findTimezoneLabel(d);
    
    const embed = embedUtils.createSettingsEmbed(d, timezoneLabel, userId);

    return res.send({
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: dataUtils.displaySettingsMenu(d, embed, userId),
    });
}

//help command + settings command
export async function exit_btn (req, res) {
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    await res.send({
    type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
    });
    await DiscordRequest(endpoint, { method: "DELETE" });
}

//help command
export async function back_btn (req, res) {
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    const embed = embedUtils.createHelpEmbed();
    
    await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: dataUtils.displayHelpMenu(embed),
    });
    await DiscordRequest(endpoint, { method: "DELETE" });
}

//settings command
export async function s_back_btn (req, res) {
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    const guildId = req.body.guild_id;
    const userId = req.body.member.user.id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);
    const timezoneLabel = utils.findTimezoneLabel(d);
    
    const embed = embedUtils.createSettingsEmbed(d, timezoneLabel, userId);

    await res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: dataUtils.displaySettingsMenu(d, embed, userId),
    });
    await DiscordRequest(endpoint, { method: "DELETE" });
}