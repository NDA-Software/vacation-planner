import { Socket } from 'socket-actions/server';

import AddPlan from './actions/addPlan';
import EditPlan from './actions/editPlan';
import RemovePlan from './actions/removePlan';

const actions = {
    addPlan: new AddPlan(),
    editPlan: new EditPlan(),
    removePlan: new RemovePlan()
};

// eslint-disable-next-line no-new
new Socket({
    actions,
    port: 3001,
    disableAuthentication: true
});
