import { Socket } from 'socket-actions/server';

import AddPlans from './actions/addPlans';
import RemovePlan from './actions/removePlan';

const actions = {
    addPlans: new AddPlans(),
    removePlan: new RemovePlan()
};

// eslint-disable-next-line no-new
new Socket({
    actions,
    port: 3001,
    disableAuthentication: true
});
