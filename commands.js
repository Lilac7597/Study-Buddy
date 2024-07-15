import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

// Simple test command
const TEST_COMMAND = {
  name: "test",
  description: "See if Gerald works.",
  type: 1,
};

const HI_COMMAND = {
  name: "hi",
  description: "Say hi to Gerald!",
  type: 1,
};

const HELP_COMMAND = {
  name: "help",
  description: "Guide on how to use this bot.",
  type: 1,
};

const SETTINGS_COMMAND = {
  name: "settings",
  description:
    "Configure your user and server settings so that the bot works as intended.",
  type: 1,
};

const CLASSES_COMMAND = {
  name: "classes",
  description: "View the current list of classes.",
  type: 1,
};

const ADDCLASS_COMMAND = {
  name: "add-class",
  description: "Add a class.",
  type: 1,
  options: [
    {
      type: 3,
      name: "class",
      description: "Enter the name of the class.",
      required: true,
    },
    {
      type: 5,
      name: "ranked",
      description: "Choose whether your class is ranked or unranked.",
      required: true,
    },
  ],
};

const REMOVECLASS_COMMAND = {
  name: "remove-class",
  description: "Remove a class.",
  type: 1,
  options: [
    {
      type: 4,
      name: "class-number",
      description: "Enter the class number.",
      required: true,
    },
  ],
};

const EVENTS_COMMAND = {
  name: "events",
  description: "View the list of upcoming events.",
  type: 1,
};

const ADDEVENT_COMMAND = {
  name: "add-event",
  description: "Add an event.",
  type: 1,
  options: [
    {
      type: 4,
      name: "class-number",
      description:
        "Enter the class number of the class this event is associated with.",
      required: true,
    },
    {
      type: 3,
      name: "event-name",
      description: "Enter the name of the event.",
      required: true,
    },
    {
      type: 3,
      name: "event-date",
      description: "Enter the date the event takes place, in MM-DD-YY format.",
      required: true,
    },
  ],
};

const REMOVEEVENT_COMMAND = {
  name: "remove-event",
  description: "Remove an event.",
  type: 1,
  options: [
    {
      type: 4,
      name: "event-number",
      description: "Enter the event number.",
      required: true,
    },
  ],
};

// Command containing options
const CALCULATEGPA_COMMAND = {
  name: "calculate-gpa",
  description: "Calculate your ranked GPA.",
  type: 1,
};

const ALL_COMMANDS = [
  TEST_COMMAND,
  HI_COMMAND,
  HELP_COMMAND,
  SETTINGS_COMMAND,
  CLASSES_COMMAND,
  ADDCLASS_COMMAND,
  REMOVECLASS_COMMAND,
  EVENTS_COMMAND,
  ADDEVENT_COMMAND,
  REMOVEEVENT_COMMAND,
  CALCULATEGPA_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

//AddGlobalCommand(process.env.APP_ID, CALCULATE_COMMAND);

//DeleteGlobalCommand(process.env.APP_ID, CHALLENGE_COMMAND.id);
