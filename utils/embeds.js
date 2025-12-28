export function createHelpEmbed(){
    return {
          title: "User Guide",
          description:
            "Hi I'm Gerald! I am designed to make your school life easier. I can provide you with multiple tools that will hopefully make school less painful :D",
          color: 7793062,
          footer: {
            icon_url:
              "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
            text: "Press any of the buttons below to learn more!",
          },
          thumbnail: {
            url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          },
          fields: [
            {
              name: "Features:",
              value:
                "- Create a list of upcoming tests, quizzes, and events.\n- Stay notified of upcoming events.\n- Calculate your GPA.",
            },
            {
              name: "Confused?",
              value:
                "If you don't know how to use one of the features, click on the corresponding button below for a guide!",
            },
          ],
    };
}

export function createSettingsEmbed(d, timezoneLabel, userId) {
    return {
          title: "Settings",
          description:
            "Update your channel ID or timezone, or enable/disable notifications here.",
          color: 7793062,
          footer: {
            icon_url:
              "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
            text: "Press one of buttons below to update a setting!",
          },
          thumbnail: {
            url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          },
          fields: [
            {
              name: "Information:",
              value:
                "- **Notifications:** Enable or disable your notifications for upcoming events (Will not affect other users).\n- **Channel ID:** Notifications about upcoming events will occur in this channel. To find a channel ID, right click a channel in your server's sidebar and click on `Copy Channel ID` (Affects the entire server).\n- **Timezone:** Ensures that Gerald will ping you at the correct time in your timezone (Affects the entire server).",
            },
            {
              name: "Current Settings:",
              value: `- **Notifications:** ${
                d.userNotifs.includes(userId) ? "Enabled" : "Disabled"
              }\n- **Channel ID:** ${d.channel_id || "None"}\n- **Timezone:** ${
                timezoneLabel || "None"
              }
              `,
            },
          ],
    };
}

export function createClassesEmbed(d) {
    return {
        title: "All Classes",
        description:
          "Type `/add-class` to add a class, or type `/remove-class` to remove a class.",
        color: 7793062,
        footer: {
          icon_url:
            "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
          text: `Total: ${d.classesList.length}`,
        },
        thumbnail: {
          url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
        },
        fields: [
          {
            name: "Current List of Available Classes:",
            value:
              d.classesList.length === 0
                ? "Type `/add-class` to get started!"
                : "```\n" +
                  d.classesList
                    .map((className, index) => `${index + 1}. ${className}`)
                    .join("\n") +
                  "\n```",
          },
        ],
      };
}

export function createEventsEmbed(d) {
    return {
            title: "Upcoming Events",
            description:
              "Type `/add-event` to add an event, or type `/remove-event` to remove an event.",
            color: 7793062,
            footer: {
              icon_url:
                "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
              text: `Total: ${d.eventsMap.length}`,
            },
            thumbnail: {
              url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
            },
            fields: [
              {
                name: "List of Upcoming Events:",
                value:
                  d.eventsMap.length === 0
                    ? "Type `/add-event` to get started!"
                    : "```\n" +
                      d.eventsMap
                        .map((entry, index) => {
                          const className = entry.class.padEnd(15);
                          const eventName = entry.name.padEnd(15);
                          const eventDate = entry.date.padEnd(8);
                          return `${
                            index + 1
                          }. ${className}  ${eventName}  ${eventDate}`;
                        })
                        .join("\n") +
                      "\n```",
              },
            ],
    };
}

export function createGPAEmbed() {
    return {
            title: "Calculate Your Ranked GPA",
            description: "Click on the `Open Form` button to get started!",
            color: 7793062,
            footer: {
              icon_url:
                "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
              text: "Press the button below :D",
            },
            thumbnail: {
              url: "https://cdn.glitch.global/a69e3a17-ba16-44e3-8c4c-e13ba17901b7/download.jpg?v=1720107311250",
            },
            fields: [
              {
                name: "Note:",
                value:
                  "The form will ask you to input grades for the ranked classes you chose in `/classes`, so make sure the classes you chose are the current classes you are taking. \n\n Also, the form can only support a maximum of 5 inputs, so if you are taking more than 5 ranked classes, then only the first 5 will be recognized. In that case, your result may not be accurate.",
              },
            ],
    };
}