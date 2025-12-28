import "dotenv/config";
import express from "express";
import {
  readData,
  writeData,
  VerifyDiscordRequest,
} from "./utils/utils.js";
import cron from "node-cron";
import {
  Client,
  GatewayIntentBits,
} from "discord.js";
import { config } from "dotenv";
import moment from "moment-timezone";
import { interactions } from "./interactions/index.js";

// Load environment variables from a .env file
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));


// Interactions endpoint URL where Discord will send HTTP requests
app.post("/interactions", interactions.interactionsHandler);

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

    if (d.channel_id.length > 0) {
      const timezone = d.timezone || "UTC";

      cron.schedule(
        "0 20 * * *",
        async () => {
          if (d.channel_id.length > 0) {
            const channelId = d.channel_id;
            const channel = await client.channels.fetch(channelId);

            //delete today's events from event list
            const td = moment().tz(timezone);
            const tdStr = `${td.format("MM-DD-YY")}`;

            d.eventsMap = d.eventsMap.filter((event) => event.date !== tdStr);

            dataIn.guilds[guild_id] = d;
            writeData(dataIn);

            //notify users of tmr's events
            const tmr = moment().tz(timezone).add(1, "day");
            const tmrStr = `${tmr.format("MM-DD-YY")}`;

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
                  break;
                }
              }
            }
          }
        },
        {
          timezone: timezone,
        }
      );
    }
  });
});
client.login(process.env.DISCORD_TOKEN);