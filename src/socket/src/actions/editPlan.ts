import { Action } from 'socket-actions/server';

import { type ActionParameters } from 'socket-actions/server';
import getData from '../helpers/getData';
import saveData from '../helpers/saveData';

export default class EditPlan extends Action {
    override async onRun(param: ActionParameters): Promise<void> {
        const { data } = param;

        const { key } = data;

        delete data.key;

        const newData = getData();

        newData[key] = data;

        saveData(newData);

        this.server?.sendMessageToAll({ newData }, { exceptions: [] });
    }
}
