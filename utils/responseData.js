export function displayHelpMenu(embed){
    return {
        embeds: [embed],
        components: [
            {
            type: 1,
            components: [
                {
                type: 2,
                custom_id: "commands_btn",
                style: 1,
                label: "Commands",
                },
                {
                type: 2,
                custom_id: "classes_btn",
                style: 2,
                label: "Classes",
                },
                {
                type: 2,
                custom_id: "events_btn",
                style: 2,
                label: "Events",
                },
                {
                type: 2,
                custom_id: "gpa_btn",
                style: 2,
                label: "GPA Calculator",
                },
                {
                type: 2,
                custom_id: "exit_btn",
                style: 4,
                label: "Exit",
                },
            ],
            },
        ],
    };
}

export function displaySettingsMenu(d, embed, userId){
    return {
        embeds: [embed],
        components: [
          {
            type: 1,
            components: d.userNotifs.includes(userId)
              ? [
                  {
                    type: 2,
                    custom_id: "notifs_btn",
                    style: 1,
                    label: "Notifications: On",
                  },
                  {
                    type: 2,
                    custom_id: "channel_id_btn",
                    style: 2,
                    label: "Channel ID",
                  },
                  {
                    type: 2,
                    custom_id: "timezone_btn",
                    style: 2,
                    label: "Timezone",
                  },
                  {
                    type: 2,
                    custom_id: "exit_btn",
                    style: 4,
                    label: "Exit",
                  },
                ]
              : [
                  {
                    type: 2,
                    custom_id: "notifs_btn",
                    style: 2,
                    label: "Notifications: Off",
                  },
                  {
                    type: 2,
                    custom_id: "channel_id_btn",
                    style: 2,
                    label: "Channel ID",
                  },
                  {
                    type: 2,
                    custom_id: "timezone_btn",
                    style: 2,
                    label: "Timezone",
                  },
                  {
                    type: 2,
                    custom_id: "exit_btn",
                    style: 4,
                    label: "Exit",
                  },
                ],
          },
        ],
      };
}

export function displayClassesMenu(d, embed){
    return {
          embeds: [embed],
          components:
            d.classesList.length === 0
              ? []
              : [
                  {
                    type: 1,
                    components: [
                      {
                        type: 2,
                        custom_id: "choose_btn",
                        style: 1,
                        label: "Choose...",
                      },
                    ],
                  },
                ],
    };
}

export function displayGPAMenu(embed){
    return {
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  custom_id: "open_form_btn",
                  style: 1,
                  label: "Open Form",
                },
              ],
            },
          ],
    };
}