import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dataPath = path.join(__dirname, 'data.json');
const path = './data.json';

export function readData() {
  try {
    if (!fs.existsSync(path)) {
       fs.writeFileSync(path, JSON.stringify({ classesList: [], usersMap: [] }, null, 2));
    }
    const d = fs.readFileSync(path, 'utf8');
    return JSON.parse(d);
  } catch (error) {
    console.error('Error reading data:', error);
    return {};
  }
}

export function writeData(d) {
  try {
    fs.writeFileSync(path, JSON.stringify(d, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

// // Path to the data file
// const path = './data.json';

// // Read JSON data from the file
// const readData = () => {
//   try {
//     if (!fs.existsSync(path)) {
//       fs.writeFileSync(path, JSON.stringify({ classesList: [] }, null, 2));
//     }
//     const data = fs.readFileSync(path, 'utf8');
//     return JSON.parse(data);
//   } catch (err) {
//     console.error('Error reading data.json:', err);
//     return { classesList: [] };
//   }
// };

// // Write JSON data to the file
// const writeData = (data) => {
//   try {
//     fs.writeFileSync(path, JSON.stringify(data, null, 2));
//   } catch (err) {
//     console.error('Error writing to data.json:', err);
//   }
// };

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}