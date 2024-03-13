import { Action } from 'socket-actions/server';

import { type ActionParameters } from 'socket-actions/server';

import getData from '../helpers/getData';
import saveData from '../helpers/saveData';

export default class RemovePlan extends Action {
    override async onRun(param: ActionParameters): Promise<void> {
        const { data } = param;

        const { key } = data;

        const newData = getData();

        if (newData[key] === undefined)
            return;

        newData.splice(key, 1);

        saveData(newData);

        this.server?.sendMessageToAll({ newData }, { exceptions: [] });
    }
}
