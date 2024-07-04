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

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const eventsList = {};
//Gerald's responses
var responsesList = [
  "STUDY HARDER!!!",
  "ew its you",
  "smh",
  "what are you doing here",
  "ur annoying",
  "bye",
];

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
          content: "woah ",
        },
      });
    }

    if (name === "hi") {
      // Send a message into the channel where command was triggered from

      var random = Math.floor(Math.random() * responsesList.length);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "" + responsesList[random],
        },
      });
    }

    if (name === "classes") {
      return res.send({
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
      });
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
          classGPA = classGPA - 0.2;
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
          classGPA = classGPA - 0.4;
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

    if (name === "calculate") {
      var sum = 0;
      var allGradesList = [
        req.body.data.options[3].value,
        req.body.data.options[4].value,
        req.body.data.options[5].value,
        req.body.data.options[6].value,
        req.body.data.options[7].value,
        req.body.data.options[8].value,
        req.body.data.options[9].value,
      ];
      var allWeightsList = [
        req.body.data.options[0].value,
        req.body.data.options[1].value,
        req.body.data.options[2].value,
      ];

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
          classGPA = roundToTenths(classGPA - 0.2);
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
          classGPA = roundToTenths(classGPA - 0.4);
        }
        sum += classGPA;
      }
      return roundToTenths(sum / allClassAvgList.length);

      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Your GPA is: ",
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
