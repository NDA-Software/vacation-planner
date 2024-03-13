import { Action } from 'socket-actions/server';

import { type ActionParameters } from 'socket-actions/server';
import getData from '../helpers/getData';
import saveData from '../helpers/saveData';

export default class AddPlan extends Action {
    override async onRun(param: ActionParameters): Promise<void> {
        const { data } = param;

        const newData = getData();

        newData.push(data);

        saveData(newData);

        this.server?.sendMessageToAll({ newData }, { exceptions: [] });
    }
}
