import { readFileSync, existsSync, writeFileSync } from 'fs';

import { Action } from 'socket-actions/server';

import { type ActionParameters } from 'socket-actions/server';

const filePath = '../../data.json';

export default class AddPlans extends Action {
    override async onRun(param: ActionParameters): Promise<void> {
        const { data, userData } = param;

        let newData = [];
        if (existsSync(filePath)) {
            const fileData = readFileSync(filePath, { encoding: 'utf-8' }).toString();

            newData = JSON.parse(fileData);
        }

        newData.push(data);

        writeFileSync(filePath, JSON.stringify(newData));

        this.server?.sendMessageToAll({ data }, { exceptions: [userData.id] });
    }
}
