import { promises as fs } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = path.resolve(dirname(fileURLToPath(import.meta.url)), '../../data');
const dataFile = path.join(dataDir, 'greenhouse.json');

interface GreenhouseData {
    lastWateredAt?: string;
}

export class GreenhouseService {
    public async getLastWatered(): Promise<Date | undefined> {
        let data = await this.read();
        return data.lastWateredAt ? new Date(data.lastWateredAt) : undefined;
    }

    public async water(): Promise<Date> {
        let now = new Date();
        await this.write({ lastWateredAt: now.toISOString() });
        return now;
    }

    public async reset(): Promise<void> {
        await this.write({});
    }

    private async read(): Promise<GreenhouseData> {
        try {
            let raw = await fs.readFile(dataFile, 'utf-8');
            return JSON.parse(raw) as GreenhouseData;
        } catch {
            return {};
        }
    }

    private async write(data: GreenhouseData): Promise<void> {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(dataFile, JSON.stringify(data, null, 4));
    }
}
