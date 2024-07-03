import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

// Simple test command
const TEST_COMMAND = {
  name: "test",
  description: "Basic command",
  type: 1,
};

// Command containing options
const CALCULATE_COMMAND = {
  name: "calculate",
  description: "Calculate your GPA",
  options: [
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
      description: "Enter your grade in class 2",
      required: false,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, CALCULATE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
