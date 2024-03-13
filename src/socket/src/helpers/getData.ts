import { existsSync, readFileSync } from 'fs';

export const filePath = '../../data.json';

export default function getData(): Array<Record<string, any>> {
    let data = [];
    if (existsSync(filePath)) {
        const fileData = readFileSync(filePath, { encoding: 'utf-8' }).toString();

        data = JSON.parse(fileData);
    }

    return data;
}
