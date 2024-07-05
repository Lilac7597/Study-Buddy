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

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

//Gerald's responses
var responsesList = [
  // "STUDY HARDER!!!",
  // "ew its you",
  // "smh",
  // "what are you doing here",
  // "ur annoying",
  // "bye",
  "hey",
  "hi",
  "hello",
  "howdy",
  "what's up,",
  "bonjour",
];
//List of current available classes
var classesList;
//Map of users and the classes they are assigned to
var classesMap;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Omg I'm working!!",
        },
      });
    }

    if (name === "hi") {
      // Send a message into the channel where command was triggered from

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
      const d = readData(); // Read data from JSON file

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
      const d = readData(); // Read data from JSON file

      d.classesList.push(className); // Add the class to the list
      d.classesMap.push({ class: className, users: [] });
      writeData(d); // Write updated data back to the JSON file

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Class "${className}" successfully added!`,
        },
      });
    }

    if (name === "remove-class") {
      const index = req.body.data.options[0].value - 1;

      const d = readData(); // Read data from JSON file

      if (index >= 0 && index < d.classesList.length) {
        d.classesList.splice(index, 1); // Remove the class at the specified index
        d.classesMap.splice(index, 1);
        writeData(d); // Write updated data back to the JSON file

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
      const d = readData();

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
                      const eventName = entry.name.padEnd(17);
                      const eventDate = entry.date.padEnd(8);
                      return `${
                        index + 1
                      }. ${className} ${eventName} ${eventDate}`;
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
      const d = readData();
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
        writeData(d);
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

      const d = readData(); // Read data from JSON file

      if (index >= 0 && index < d.eventsMap.length) {
        d.eventsMap.splice(index, 1); // Remove the class at the specified index
        writeData(d); // Write updated data back to the JSON file

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

    if (name === "calculate") {
      var allClassAvgList = [
        req.body.data.options[0].value,
        req.body.data.options[2].value,
        req.body.data.options[4].value,
        req.body.data.options[6].value,
      ];
      var allClassWeightsList = [
        req.body.data.options[1].value,
        req.body.data.options[3].value,
        req.body.data.options[5].value,
        req.body.data.options[7].value,
      ];
      var sum = 0;
      for (var i = 0; i < allClassAvgList.length; i++) {
        var decrement = 4;
        var count = 0;
        var classGPA;
        if (allClassWeightsList[i] == "REG") {
          classGPA = 5;
        } else if (allClassWeightsList[i] == "MAP") {
          classGPA = 5.5;
        } else if (allClassWeightsList[i] == "AP") {
          classGPA = 6;
        }
        for (var j = 97; j > allClassAvgList[i]; j -= decrement) {
          classGPA -= 0.2;
          if (count == 0) {
            decrement = 4;
          } else {
            decrement = 3;
          }
          count = (count + 1) % 3;
        }
        if (allClassAvgList[i] < 70) {
          classGPA = 0;
        } else if (allClassAvgList[i] == 70) {
          classGPA -= 0.4;
        }
        sum += classGPA;
      }
      var GPA = sum / allClassAvgList.length;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Your GPA is: " + GPA,
        },
      });
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;
    const d = readData();

    if (componentId === "choose_btn") {
      // return res.send({
      //   type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      //   data: {
      //     content: "hi",
      //   }
      // });

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
                    options: await getClassesOptions(),
                    //options: [{ label: "hi", value: "hi" }],
                    min_values: 1,
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

    if (componentId === "class_select") {
      //get user's id
      const userId = req.body.member.user.id;
      const d = readData();
      var selected = [];

      for (var i = 0; i < data.values.length; i++) {
        selected.push(data.values[i]);
        for (var j = 0; j < d.classesMap.length; j++) {
          if (d.classesMap[i].class === data.values[j])
            if (!d.classesMap[i].users.includes(userId)) {
              d.classesMap[i].users.push(userId);
            }
          break;
        }
      }

      // Delete message with token in request body
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      try {
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              "You will now be notified of any upcoming quizzes, tests, or events from these classes: " +
              "```\n" +
              selected.join("\n") +
              "\n```",
          },
        });
        // Delete previous message
        await DiscordRequest(endpoint, { method: "DELETE" });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

async function getClassesOptions() {
  const d = readData();
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
//add todo list :) (how ironic)
