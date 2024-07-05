import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

// Simple test command
const TEST_COMMAND = {
  name: "test",
  description: "Basic command",
  type: 1,
};

const HI_COMMAND = {
  name: "hi",
  description: "Say hi to Gerald!",
  type: 1,
};

const CLASSES_COMMAND = {
  name: "classes",
  description: "View the current list of classes",
  type: 1,
}

const ADDCLASS_COMMAND = {
  name: "add-class",
  description: "Add a class",
  type: 1,
  options: [
    {
      type: 3,
      name: "class",
      description: "Enter the name of the class",
      required: true,
    }
  ]
}

const REMOVECLASS_COMMAND = {
  name: "remove-class",
  description: "Remove a class",
  type: 1,
  options: [
    {
      type: 4,
      name: "class-number",
      description: "Enter the class number",
      required: true,
    }
  ]
}

const EVENTS_COMMAND = {
  name: "events",
  description: "View a list of upcoming events",
  type: 1,
}

const ADDEVENT_COMMAND = {
  name: "add-event",
  description: "Add an event",
  type: 1,
}

const REMOVEEVENT_COMMAND = {
  name: "remove-event",
  description: "Remove an event",
  type: 1,
}

// Command containing options
const CALCULATE_COMMAND = {
  name: "calculate",
  description: "Calculate your GPA",
  options: [
    {
      type: 4,
      name: "grade1",
      description: "Enter your grade in class 1",
      required: true,
    },
    {
      type: 3,
      name: "type1",
      description: "Choose your class 1 type",
      required: true,
      choices: [
        {
          name: "REG",
          value: "REG",
        },
        {
          name: "MAP",
          value: "MAP",
        },
        {
          name: "AP",
          value: "AP",
        },
      ],
    },
    {
      type: 4,
      name: "grade2",
      description: "Enter your grade in class 2",
      required: true,
    },
    {
      type: 3,
      name: "type2",
      description: "Choose your class 2 type",
      required: true,
      choices: [
        {
          name: "REG",
          value: "REG",
        },
        {
          name: "MAP",
          value: "MAP",
        },
        {
          name: "AP",
          value: "AP",
        },
      ],
    },
    {
      type: 4,
      name: "grade3",
      description: "Enter your grade in class 3",
      required: true,
    },
    {
      type: 3,
      name: "type3",
      description: "Choose your class 3 type",
      required: true,
       choices: [
        {
          name: "REG",
          value: "REG",
        },
        {
          name: "MAP",
          value: "MAP",
        },
        {
          name: "AP",
          value: "AP",
        },
      ],
    },
    {
      type: 4,
      name: "grade4",
      description: "Enter your grade in class 4",
      required: true,
    },
    {
      type: 3,
      name: "type4",
      description: "Choose your class 4 type",
      required: true,
       choices: [
        {
          name: "REG",
          value: "REG",
        },
        {
          name: "MAP",
          value: "MAP",
        },
        {
          name: "AP",
          value: "AP",
        },
      ],
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, HI_COMMAND, CLASSES_COMMAND, ADDCLASS_COMMAND, REMOVECLASS_COMMAND,
                      EVENTS_COMMAND, ADDEVENT_COMMAND, REMOVEEVENT_COMMAND, CALCULATE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

//AddGlobalCommand(process.env.APP_ID, CALCULATE_COMMAND);

//DeleteGlobalCommand(process.env.APP_ID, CHALLENGE_COMMAND.id);