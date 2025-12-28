import * as basic from "../commands/basic.js";
import * as classes from "../commands/classes.js";
import * as events from "../commands/events.js";
import * as gpa from "./gpa.js";

export const commands = {
  ...basic,
  "classes": classes.classes,
  "add-class": classes.addClass,
  "remove-class": classes.removeClass,
  "events": events.events,
  "add-event": events.addEvent,
  "remove-event": events.removeEvent,
  "calculate-gpa": gpa.calculateGPA,
};