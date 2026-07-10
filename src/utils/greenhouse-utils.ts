import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    InteractionReplyOptions,
    InteractionUpdateOptions,
} from 'discord.js';

export class GreenhouseUtils {
    public static readonly WATER_BUTTON_ID = 'GREENHOUSE_WATER';
    public static readonly RESET_BUTTON_ID = 'GREENHOUSE_RESET';

    public static buildMessage(
        lastWatered: Date | undefined
    ): InteractionReplyOptions & InteractionUpdateOptions {
        let timestamp = Math.floor((lastWatered ?? new Date()).getTime() / 1000);
        let content = lastWatered
            ? `La serre a été arrosée pour la dernière fois <t:${timestamp}:R> (<t:${timestamp}:F>).`
            : `La serre n'a jamais été arrosée pour l'instant !`;

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(GreenhouseUtils.WATER_BUTTON_ID)
                .setEmoji('💧')
                .setLabel('Arroser')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(GreenhouseUtils.RESET_BUTTON_ID)
                .setEmoji('🔄')
                .setLabel('Réinitialiser')
                .setStyle(ButtonStyle.Secondary)
        );

        return { content, components: [row] };
    }
}
