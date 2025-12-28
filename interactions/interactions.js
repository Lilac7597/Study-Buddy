import { InteractionType, InteractionResponseType } from "discord-interactions";
import { commands } from "../commands/index.js";
import { components, modalSubmit } from "../components/index.js";

export async function interactionsHandler(req, res) {
  const { type, data } = req.body;

  // PING
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Slash commands
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    const handler = commands[name];

    if (!handler) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `Unknown command: ${name}` },
      });
    }

    return handler(req, res);
  }

  // Components (buttons)
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const customId = data.custom_id;
    const handler = components[customId];

    if (!handler) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `Unknown component: ${customId}` },
      });
    }

    return handler(req, res);
  }

  //modal submit
  if (type === InteractionType.MODAL_SUBMIT) {
    const customId = data.custom_id;
    const handler = modalSubmit[customId];

    if (!handler) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `Unknown modal submit: ${customId}` },
      });
    }

    return handler(req, res);
  }

  return res.sendStatus(200);
}
