import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  readData,
  writeData,
  VerifyDiscordRequest,
  DiscordRequest,
} from "./utils.js";
import cron from "node-cron";
import {
  Client,
  Events,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import { config } from "dotenv";

// Load environment variables from a .env file
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

//Gerald's responses
var responsesList = ["hey", "hi", "hello", "howdy", "what's up,", "bonjour"];

//List of current available classes
var classesList;
//Map of users and the classes they are assigned to
var classesMap;

// Interactions endpoint URL where Discord will send HTTP requests
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data, guild_id } = req.body;

  // Handle verification requests
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Handle slash command requests
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === "test") {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Yayy I'm working :D",
        },
      });
    }

    if (name === "hi") {
      var random = Math.floor(Math.random() * responsesList.length);
      const userId = req.body.member.user.id;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: responsesList[random] + ` <@${userId}>!`,
        },
      });
    }

    if (name === "classes") {
      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      const embed = {
        title: "All Classes",
        description:
          "Type `/add-class` to add a class, or type `/remove-class` to remove a class.",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: `Total: ${d.classesList.length}`,
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "Current List of Available Classes:",
            value:
              d.classesList.length === 0
                ? "Type `/add-class` to get started!"
                : "```\n" +
                  d.classesList
                    .map((className, index) => `${index + 1}. ${className}`)
                    .join("\n") +
                  "\n```",
          },
        ],
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
          components:
            d.classesList.length === 0
              ? []
              : [
                  {
                    type: 1,
                    components: [
                      {
                        type: 2,
                        custom_id: "choose_btn",
                        style: 1,
                        label: "Choose...",
                      },
                    ],
                  },
                ],
        },
      });
    }

    if (name === "add-class") {
      const className = req.body.data.options[0].value;
      const ranked = req.body.data.options[1].value;
      var rank = "";
      if (ranked) rank = "Ranked";
      else rank = "Unranked";

      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      d.classesList.push(className);
      d.classesMap.push({ class: className, rank: rank, users: [] });
      writeData(dataIn);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Class "${className}" successfully added!`,
        },
      });
    }

    if (name === "remove-class") {
      const index = req.body.data.options[0].value - 1;

      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      if (index >= 0 && index < d.classesList.length) {
        d.classesList.splice(index, 1);
        d.classesMap.splice(index, 1);
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

    if (name === "events") {
      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      const embed = {
        title: "Upcoming Events",
        description:
          "Type `/add-event` to add an event, or type `/remove-event` to remove an event.",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: `Total: ${d.eventsMap.length}`,
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "List of Upcoming Events:",
            value:
              d.eventsMap.length === 0
                ? "Type `/add-event` to get started!"
                : "```\n" +
                  d.eventsMap
                    .map((entry, index) => {
                      const className = entry.class.padEnd(15);
                      const eventName = entry.name.padEnd(15);
                      const eventDate = entry.date.padEnd(8);
                      return `${
                        index + 1
                      }. ${className}  ${eventName}  ${eventDate}`;
                    })
                    .join("\n") +
                  "\n```",
          },
        ],
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
        },
      });
    }

    if (name == "add-event") {
      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

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

        writeData(dataIn);
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Event "${eventName}" successfully added!`,
        },
      });
    }

    if (name === "remove-event") {
      const index = req.body.data.options[0].value - 1;

      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      if (index >= 0 && index < d.eventsMap.length) {
        d.eventsMap.splice(index, 1);
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

    if (name === "calculate-gpa") {
      const embed = {
        title: "Calculate Your Ranked GPA",
        description: "Click on the `Open Form` button to get started!",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: "Press the button below :D",
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "Note:",
            value:
              "The form will ask you to input grades for the ranked classes you chose in `/classes`, so make sure the classes you chose are the current classes you are taking. \n\n Also, the form can only support a maximum of 5 inputs, so if you are taking more than 5 ranked classes, then only the first 5 will be recognized. In that case, your result may not be accurate.",
          },
        ],
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "open_form_btn",
                  style: 1,
                  label: "Open Form",
                },
              ],
            },
          ],
        },
      });
    }

    if (name === "help") {
      displayHelpMenu();
    }

    if (name === "settings") {
      displaySettings();
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const componentId = data.custom_id;
    //classes command
    if (componentId === "choose_btn") {
      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

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
                    options: await getClassesOptions(guild_id),
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
    if (componentId === "class_select") {
      //get user's id
      const userId = String(req.body.member.user.id);
      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      var selected = data.values;

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

    //calculate-gpa command
    if (componentId === "open_form_btn") {
      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;

      const userId = String(req.body.member.user.id);
      // const rank = req.body.data.options[0].value;
      var filteredClassesMap = [];
      // if (rank === "Ranked")
      filteredClassesMap = d.classesMap.filter(
        (entry) => entry.rank === "Ranked"
      );

      filteredClassesMap = filteredClassesMap.filter((entry) =>
        entry.users.includes(userId)
      );

      const modal = new ModalBuilder()
        .setCustomId("calculateModal")
        .setTitle(`Calculate Your Ranked GPA`);

      filteredClassesMap.forEach((entry, index) => {
        if (index >= 5) return;

        const textInput = new TextInputBuilder()
          .setCustomId(`text_input_${index}`)
          .setLabel(`Enter grade for ${entry.class}`)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(`Enter grade (0-100)`)
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(3);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
      });

      // Delete message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      await res.send({
        type: InteractionResponseType.MODAL,
        data: modal.toJSON(),
      });

      // Delete previous message
      await DiscordRequest(endpoint, { method: "DELETE" });
    }

    //help command
    if (componentId === "commands_btn") {
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
              "- **/test:** Just makes sure Gerald works :)\n- **/hi:** He will greet you back!\n- **/settings:** Allows users to update their notification channel and timezone, and enable/disable notifications.\n- **/classes:** View a list of all the classes that have been added. The 'Choose...' button allows the user to stay notified of upcoming events in the classes they choose.\n- **/add-class:** Adds a class.\n- **/remove-class:** Removes a class.\n- **/events:** View a list of all upcoming tests, quizzes, and events.\n- **/add-event:** Adds an event.\n- **/remove-event:** Removes an event.\n- **/calculate-gpa:** Calculates ranked GPA. In a modal, the user can enter their grades for each ranked class they are enrolled in.\n- **Additional:** The bot is programmed to remind users of the next day's events at 8pm. It will ping the people who are enrolled in the event's corresponding class. Also, it will delete the current day's events, as they have probably already been completed by 8pm.",
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
    if (componentId === "classes_btn") {
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
    if (componentId === "events_btn") {
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
    if (componentId === "gpa_btn") {
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

    if (componentId === "channel_id_btn") {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      await res.send({
        type: InteractionResponseType.MODAL,
        data: {
					title: 'Update Notification Channel',
					custom_id: 'channelModal',
					components: [
						{
							type: 1,
							components: [
								{
									type: 4,
									style: 1,
									label: 'Enter Channel ID',
									custom_id: 'channel_id_input',
									placeholder: 'ex. 012345678901234567',
								},
							],
						},
            ]
            }
      });
      await DiscordRequest(endpoint, { method: "DELETE" });
    }

    if (componentId === "timezone_btn") {
      
    }

    if (componentId === "notifs_btn") {
    }

    //help command + settings command
    if (componentId === "exit_btn") {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      await res.send({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      });
      await DiscordRequest(endpoint, { method: "DELETE" });
    }

    //help command
    if (componentId === "back_btn") {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      displayHelpMenu();
      await DiscordRequest(endpoint, { method: "DELETE" });
    }

    //settings command
    if (componentId === "s_back_btn") {
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      displaySettings();
      await DiscordRequest(endpoint, { method: "DELETE" });
    }
  }

  if (type === InteractionType.MODAL_SUBMIT) {
    const componentId = data.custom_id;

    if (componentId === "calculateModal") {
      var inputValues = [];
      for (let action of data.components) {
        let inputComponent = action.components[0];
        inputValues.push(inputComponent.value);
      }

      const dataIn = readData();
      const d = dataIn.guilds[guild_id] || {
        classesList: [],
        classesMap: [],
        eventsMap: [],
        userNotifs: [],
        channel_id: "",
        timezone: "",
      };
      dataIn.guilds[guild_id] = d;
      const userId = String(req.body.member.user.id);
      var filteredClassesMap = [];
      filteredClassesMap = d.classesMap.filter(
        (entry) => entry.rank === "Ranked"
      );

      filteredClassesMap = filteredClassesMap.filter((entry) =>
        entry.users.includes(userId)
      );

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

      await res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Your ranked GPA is: ${GPA.toFixed(3)}`,
        },
      });
    }
  }

  function displayHelpMenu() {
    const embed = {
      title: "User Guide",
      description:
        "Hi I'm Gerald! I am designed to make your school life easier. I can provide you with multiple tools that will hopefully make school less painful :D",
      color: 7793062,
      footer: {
        icon_url:
          "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        text: "Press any of the buttons below to learn more!",
      },
      thumbnail: {
        url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
      },
      fields: [
        {
          name: "Features:",
          value:
            "- Create a list of upcoming tests, quizzes, and events.\n- Stay notified of upcoming events.\n- Calculate your GPA.",
        },
        {
          name: "Confused?",
          value:
            "If you don't know how to use one of the features, click on the corresponding button below for a guide!",
        },
      ],
    };

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                custom_id: "commands_btn",
                style: 1,
                label: "Commands",
              },
              {
                type: 2,
                custom_id: "classes_btn",
                style: 2,
                label: "Classes",
              },
              {
                type: 2,
                custom_id: "events_btn",
                style: 2,
                label: "Events",
              },
              {
                type: 2,
                custom_id: "gpa_btn",
                style: 2,
                label: "GPA Calculator",
              },
              {
                type: 2,
                custom_id: "exit_btn",
                style: 4,
                label: "Exit",
              },
            ],
          },
        ],
      },
    });
  }

  function displaySettings() {
    const userId = req.body.member.user.id;
    const dataIn = readData();
    const d = dataIn.guilds[guild_id] || {
      classesList: [],
      classesMap: [],
      eventsMap: [],
      userNotifs: [],
      channel_id: "",
      timezone: "",
    };
    dataIn.guilds[guild_id] = d;

    const embed = {
      title: "Settings",
      description:
        "Update your channel ID or timezone, or enable/disable notifications here.",
      color: 7793062,
      footer: {
        icon_url:
          "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        text: "Press one of buttons below to update a setting!",
      },
      thumbnail: {
        url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
      },
      fields: [
        {
          name: "Information:",
          value:
            "- **Channel ID:** Notifications about upcoming events will occur in this channel. To find a channel ID, right click a channel in your server's sidebar and click on `Copy Channel ID` (Affects the entire server).\n- **Timezone:** Ensures that Gerald will ping you at the correct time in your timezone (Affects the entire server).\n- **Notifications:** Enable or disable your notifications for upcoming events (Will not affect other users).",
        },
        {
          name: "Current Settings:",
          value: `- **Channel ID:** ${
            d.channel_id || "None"
          }\n- **Timezone:** ${d.timezone || "None"}\n- **Notifications:** ${
            d.userNotifs.includes(userId) ? "Enabled" : "Disabled"
          }`,
        },
      ],
    };

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                custom_id: "channel_id_btn",
                style: 2,
                label: "Channel ID",
              },
              {
                type: 2,
                custom_id: "timezone_btn",
                style: 2,
                label: "Timezone",
              },
              {
                type: 2,
                custom_id: "notifs_btn",
                style: 2,
                label: "Notifications",
              },
              {
                type: 2,
                custom_id: "exit_btn",
                style: 4,
                label: "Exit",
              },
            ],
          },
        ],
      },
    });
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.forEach((guild) => {
    const guild_id = guild.id;
    const dataIn = readData();
    const d = dataIn.guilds[guild_id] || {
      classesList: [],
      classesMap: [],
      eventsMap: [],
      userNotifs: [],
      channel_id: "",
      timezone: "",
    };
    dataIn.guilds[guild_id] = d;

    if (d.channel_id.length > 0) {
      cron.schedule(
        "0 20 * * *",
        async () => {
          for (const guild of client.guilds.cache.values()) {
            if (d.channel_id.length > 0) {
              const channelId = d.channel_id;
              const channel = await client.channels.fetch(channelId);

              //delete today's events from event list
              const td = new Date();
              td.setDate(td.getDate());
              const tdStr = `${String(td.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(td.getDate()).padStart(2, "0")}-${String(
                td.getFullYear()
              ).slice(-2)}`;

              d.eventsMap = d.eventsMap.filter((event) => event.date !== tdStr);

              writeData(dataIn);

              //notify users of tmr's events
              const tmr = new Date();
              tmr.setDate(tmr.getDate() + 1);

              const tmrStr = `${String(tmr.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(tmr.getDate()).padStart(2, "0")}-${String(
                tmr.getFullYear()
              ).slice(-2)}`;

              const tmrEvents = d.eventsMap.filter(
                (event) => event.date === tmrStr
              );

              for (var i = 0; i < tmrEvents.length; i++) {
                for (var j = 0; j < d.classesMap.length; j++) {
                  const notifiedUsers = d.classesMap[j].users.filter((entry) =>
                    d.userNotifs.includes(entry)
                  );
                  if (
                    tmrEvents[i].class === d.classesMap[j].class &&
                    notifiedUsers.length > 0
                  ) {
                    const message = [];

                    message.push(
                      notifiedUsers.map((entry) => `<@${entry}>`).join(" ")
                    );
                    message.push(
                      `Don't forget! You have a(n) ${tmrEvents[i].class}: ${tmrEvents[i].name} tomorrow!\n`
                    );

                    await channel.send(message.join("\n"));
                  }
                }
              }
            }
          }
        },
        {
          timezone: d.timezone || "America/Chicago",
        }
      );
    }
  });
});
client.login(process.env.DISCORD_TOKEN);

async function getClassesOptions(guild_id) {
  const dataIn = readData();
  const d = dataIn.guilds[guild_id] || {
    classesList: [],
    classesMap: [],
    eventsMap: [],
    userNotifs: [],
    channel_id: "",
    timezone: "",
  };
  dataIn.guilds[guild_id] = d;

  var options = [];
  for (var i = 0; i < d.classesList.length; i++) {
    options.push({
      label: d.classesList[i],
      value: d.classesList[i],
    });
  }

  return options;
}
//TODO:
//user guide
//maybe todo list
