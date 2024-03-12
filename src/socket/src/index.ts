import { Socket } from 'socket-actions/server';

import AddPlans from './actions/addPlans';

const actions = {
    addPlans: new AddPlans()
};

// eslint-disable-next-line no-new
new Socket({
    actions,
    port: 3001,
    disableAuthentication: true
});
