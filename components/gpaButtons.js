import { InteractionResponseType } from "discord-interactions";
import { utils } from "../utils/index.js";
import { readData, writeData } from "../utils/utils.js";
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

//calculate-gpa command
export async function open_form_btn(req, res) {
    const guildId = req.body.guild_id;
    const dataIn = readData();
    const d = utils.loadData(dataIn, guildId);

    const userId = String(req.body.member.user.id);
    // const rank = req.body.data.options[0].value;
    var filteredClassesMap = [];
    // if (rank === "Ranked")
    filteredClassesMap = d.classesMap.filter(
        (entry) => entry.rank === "Ranked"
    );

    filteredClassesMap = filteredClassesMap.filter((entry) =>
        entry.users.includes(userId)
    );

    const modal = new ModalBuilder()
        .setCustomId("calculateModal")
        .setTitle(`Calculate Your Ranked GPA`);

    filteredClassesMap.forEach((entry, index) => {
        if (index >= 5) return;

    const textInput = new TextInputBuilder()
        .setCustomId(`text_input_${index}`)
        .setLabel(`Enter grade for ${entry.class}`)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder(`Enter grade (0-100)`)
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(3);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    });

    await res.send({
        type: InteractionResponseType.MODAL,
        data: modal.toJSON(),
    });
}
