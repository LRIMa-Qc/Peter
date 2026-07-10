import { ButtonInteraction } from 'discord.js';

import { Button, ButtonDeferType } from './button.js';
import { EventData } from '../models/internal-models.js';
import { GreenhouseService } from '../services/index.js';
import { GreenhouseUtils, InteractionUtils } from '../utils/index.js';

export class WaterGreenhouseButton implements Button {
    public ids = [GreenhouseUtils.WATER_BUTTON_ID];
    public deferType = ButtonDeferType.UPDATE;
    public requireGuild = false;
    public requireEmbedAuthorTag = false;

    private greenhouseService = new GreenhouseService();

    public async execute(intr: ButtonInteraction, _data: EventData): Promise<void> {
        let wateredAt = await this.greenhouseService.water();
        await InteractionUtils.editReply(intr, GreenhouseUtils.buildMessage(wateredAt));
    }
}
