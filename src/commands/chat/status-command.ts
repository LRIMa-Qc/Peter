import { ChatInputCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../../models/internal-models.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

interface Item {
    is_alive: boolean;
    service: string;
    uptime: string;
}

export class StatusCommand implements Command {
    public names = ['status'];
    public cooldown = new RateLimiter(1, 1000);
    public deferType = CommandDeferType.HIDDEN;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const message = await intr.channel.send('Récupération des données...');
        const content = (await (await fetch('https://culture.lrima.ca/uptime')).json()) as
            | Item[]
            | null;
        if (!content) {
            message.edit(
                'Impossible de récupérer les données. Il se peut que le server soit down.'
            );
            return;
        }

        try {
            const lrimaData = await (await fetch('https://lrima.ca/api/healthz')).json() as {
                status: string;
                details: object;
            };

            content.push({
                is_alive: lrimaData.status === 'pass',
                service: 'lrima.ca',
                uptime: lrimaData.uptime,
            });
        } catch (error) {
            content.push({
                is_alive: false,
                service: 'lrima.ca',
                uptime: '0s',
            });
        }

        const item_answers = content.map(
            item =>
                `- ${item.service}: ${item.is_alive ? `✅ En marche (Uptime: *${item.uptime}*)` : '❌ Pas en vie'}`
        );
        const header = '**États des services**: \n';
        message.edit(header + item_answers.join('\n'));
        InteractionUtils.send(intr, 'Données envoyées');
    }
}
