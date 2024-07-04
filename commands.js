import "dotenv/config";
import { InstallGlobalCommands, AddGlobalCommand, DeleteGlobalCommand } from "./utils.js";

// Simple test command
const TEST_COMMAND = {
  name: "test",
  description: "Basic command",
  type: 1,
};

const CHALLENGE_COMMAND = {
  id: "bleh",
};

// Command containing options
const CALCULATE_COMMAND = {
  name: "calculate",
  description: "Calculate your GPA",
  options: [
    {
      type: 4,
      name: "REG",
      description: "Enter the amount of REG classes you are taking",
      required: true,
    },
    {
      type: 4,
      name: "MAP",
      description: "Enter the amount of MAP classes you are taking",
      required: true,
    },
    {
      type: 4,
      name: "AP",
      description: "Enter the amount of AP classes you are taking",
      required: true,
    },
    {
      type: 4,
      name: "1",
      description: "Enter your grade in class 1",
      required: true,
    },
    {
      type: 4,
      name: "2",
      description: "Enter your grade in class 2",
      required: true,
    },
    {
      type: 4,
      name: "3",
      description: "Enter your grade in class 3",
      required: true,
    },
    {
      type: 4,
      name: "4",
      description: "Enter your grade in class 4",
      required: true,
    },
    {
      type: 4,
      name: "5",
      description: "Enter your grade in class 5",
      required: false,
    },
    {
      type: 4,
      name: "6",
      description: "Enter your grade in class 6",
      required: false,
    },
    {
      type: 4,
      name: "7",
      description: "Enter your grade in class 7",
      required: false,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, CALCULATE_COMMAND];

//InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

//AddGlobalCommand(process.env.APP_ID, CALCULATE_COMMAND);

DeleteGlobalCommand(process.env.APP_ID, CHALLENGE_COMMAND.id);