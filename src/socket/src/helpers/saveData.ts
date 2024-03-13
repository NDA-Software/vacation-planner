import { writeFileSync } from 'fs';

import { filePath } from './getData';

export default function saveData(data: Array<Record<string, any>>): void {
    writeFileSync(filePath, JSON.stringify(data));
}
