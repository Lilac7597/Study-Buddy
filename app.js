import "dotenv/config";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import { VerifyDiscordRequest, DiscordRequest } from "./utils.js";
import { Client, GatewayIntentBits } from "discord.js";
import { readData, writeData } from "./utils.js"; // Adjust the path to where you save the functions

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
var classesList = [];

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

    if (name === "add-class") {
      const className = req.body.data.options[0].value;
      let { classesList } = readData(); // Read data from JSON file

      classesList.push(className); // Add the class to the list
      writeData({ classesList }); // Write updated data back to the JSON file

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Class "${className}" successfully added!`,
        },
      });
    }

    if (name === "remove-class") {
      const index = req.body.data.options[0].value-1;

      let { classesList } = readData(); // Read data from JSON file

      if (index >= 0 && index < classesList.length) {
        classesList.splice(index, 1); // Remove the class at the specified index
        writeData({ classesList }); // Write updated data back to the JSON file

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Class successfully removed! Current number of classes: ${classesList.length}`,
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

    if (name === "classes") {
      let { classesList } = readData(); // Read data from JSON file

      const embed = {
        title: "All Classes",
        description:
          "Type `/add-class` to add a class, or type `/remove-class` to remove a class.",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: `Total: ${classesList.length}`,
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "Current List of Available Classes:",
            value:
              classesList.length === 0
                ? "Type `/add-class` to get started!"
                : "```\n" +
                  classesList
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
          components: [
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

    //     if (name === "classes") {
    //       const embed = {
    //         title: "All Classes",
    //         description:
    //           "Type `/add-class` to add a class, or type `/remove-class` to remove a class.",
    //         color: 7793062,
    //         footer: {
    //           icon_url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
    //           text: "Total: " + classesList.length,
    //         },
    //         thumbnail: {
    //           url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
    //         },
    //         fields: [
    //           {
    //             name: "Current List of Available Classes:",
    //             value:
    //               classesList.length === 0
    //                 ? "Type `/add_class` to get started!"
    //                 : "```\n" + classesList.map((className, index) => `${index + 1}. ${className}`).join('\n') + "\n```",
    //           },
    //         ],
    //       };

    //       return res.send({
    //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: {
    //           embeds: [embed],
    //           components: [
    //             {
    //               type: 1,
    //               components: [
    //                 {
    //                   type: 2,
    //                   custom_id: "choose_btn",
    //                   style: 1,
    //                   label: "Choose...",
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //       });
    //     }

    //     if(name === "add-class") {
    //       classesList.push(req.body.data.options[0].value);

    //       return res.send({
    //          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: {
    //           content: "Class successfully added!",
    //         }
    //       });
    //     }

    //     if(name === "remove-class") {
    //       var index = req.body.data.options[0].value-1;

    //       if (index >= 0 && index < classesList.length)
    //       classesList.splice(index, 1);

    //       return res.send({
    //          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: {
    //           content: "Class successfully removed!",
    //         }
    //       });
    //     }

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
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

/* return res.send({
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
                  placeholder: "Select classes",
                  options: [
                    {
                      label: "Math",
                      value: "math",
                    },
                    {
                      label: "Science",
                      value: "science",
                    },
                    {
                      label: "History",
                      value: "history",
                    },
                    {
                      label: "English",
                      value: "english",
                    },
                    {
                      label: "Physical Education",
                      value: "pe",
                    },
                  ],
                  min_values: 1,
                  max_values: 5,
                },
              ],
            },
          ],
        },
      }); */
