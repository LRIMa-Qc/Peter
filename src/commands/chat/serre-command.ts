import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../../models/internal-models.js';
import { GreenhouseService } from '../../services/index.js';
import { GreenhouseUtils, InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class SerreCommand implements Command {
    public names = ['serre'];
    public cooldown = new RateLimiter(1, 1000);
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    private greenhouseService = new GreenhouseService();

    public async execute(intr: ChatInputCommandInteraction, _data: EventData): Promise<void> {
        let lastWatered = await this.greenhouseService.getLastWatered();
        InteractionUtils.send(intr, GreenhouseUtils.buildMessage(lastWatered));
    }
}
