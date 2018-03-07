import {connectionService} from 'core/services';

import { Client } from './client-logic';

new Client(connectionService).init();
